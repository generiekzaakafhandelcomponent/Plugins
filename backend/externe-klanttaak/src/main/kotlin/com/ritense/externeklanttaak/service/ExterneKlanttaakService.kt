/*
 * Copyright 2025 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.externeklanttaak.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.externeklanttaak.domain.IExterneKlanttaakVersion
import com.ritense.externeklanttaak.domain.IExterneKlanttaak
import com.ritense.externeklanttaak.domain.IPluginActionConfig
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectRecord
import com.ritense.objectenapi.client.ObjectRequest
import com.ritense.objectenapi.client.ObjectWrapper
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KLogger
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.delegate.DelegateTask
import java.net.URI
import java.time.LocalDate
import java.util.UUID

open class ExterneKlanttaakService(
    private val objectManagementService: ObjectManagementService,
    private val pluginService: PluginService,
    private val valueResolverService: ValueResolverService,
    private val taskService: CamundaTaskService,
) {
    internal fun createExterneKlanttaak(
        klanttaakVersion: IExterneKlanttaakVersion,
        objectManagementId: UUID,
        delegateTask: DelegateTask,
        config: IPluginActionConfig,
    ) {
        val objectManagement = objectManagementService.getById(objectManagementId)
            ?: throw IllegalStateException("Could not find Object Management Configuration by ID $objectManagementId")

        val resolvedConfig =
            resolvePluginActionProperties(
                config = config,
                execution = delegateTask.execution
            )

        val klanttaak =
            klanttaakVersion.create(
                pluginActionConfig = resolvedConfig,
                delegateTask = delegateTask
            )

        objectManagement.createObject(objectMapper.valueToTree(klanttaak))
            .also { result ->
                logger.info {
                    "Created Externe Klanttaak object with URL [${result.url}] for task with id [${delegateTask.id}]"
                }
                config.resultingKlanttaakObjectUrlVariable?.let { variableName ->
                    delegateTask.execution.setVariable(variableName, result.url)
                        .also {
                            logger.debug { "Created Klanttaak object url saved to variable [$variableName]" }
                        }
                }
            }
    }

    internal fun completeExterneKlanttaak(
        klanttaakVersion: IExterneKlanttaakVersion,
        config: IPluginActionConfig,
        objectManagementId: UUID,
        execution: DelegateExecution
    ) {
        logger.debug { "Completing Externe Klanttaak" }
        val resolvedConfig =
            resolvePluginActionProperties(
                config = config,
                execution = execution
            )

        val objectManagement = objectManagementService.getById(objectManagementId)
            ?: throw IllegalStateException("Could not find Object Management Configuration by ID $objectManagementId")

        val externeKlanttaakObject =
            objectManagement.getObjectByUrl(
                resolvedConfig.klanttaakObjectUrl
                    ?: throw RuntimeException("Failed get Externe Klanttaak Object from [${resolvedConfig.klanttaakObjectUrl}]")
            )

        val externeKlanttaak: IExterneKlanttaak = objectMapper.convertValue(
            externeKlanttaakObject.record.data
                ?: throw RuntimeException("Failed to handle empty object as Externe Klanttaak")
        )

        val completedTaak =
            klanttaakVersion
                .complete(
                    externeKlanttaak = externeKlanttaak,
                    pluginActionConfig = resolvedConfig,
                    delegateExecution = execution,
                )
                ?: run {
                    logger.info {
                        "Could not Complete External Task with id [${externeKlanttaakObject.uuid}]"
                    }
                    return
                }

        runWithoutAuthorization { taskService.complete(externeKlanttaak.verwerkerTaakId) }

        objectManagement.patchObject(externeKlanttaakObject.url, objectMapper.convertValue(completedTaak))
            .also {
                logger.info {
                    "Completed Externe Klanttaak with Id [${it.uuid}] and VerwerkerTaakId [${externeKlanttaak.verwerkerTaakId}]."
                }
            }
    }

    private fun resolvePluginActionProperties(
        config: IPluginActionConfig,
        execution: DelegateExecution
    ): IPluginActionConfig {
        val configProperties = objectMapper.valueToTree<ObjectNode>(config)
        val requestedValues =
            configProperties.properties()
                .filter { it.value.isTextual }
                .mapNotNull { it.value.textValue() }
        val resolvedValues =
            valueResolverService.resolveValues(
                execution.processInstanceId,
                execution,
                requestedValues
            )

        return objectMapper.convertValue(
            configProperties.properties().associate { (key, value) ->
                key to (resolvedValues[value.textValue()] ?: value)
            }
        )
    }

    private fun ObjectManagement.getObjectByUrl(
        url: String,
    ): ObjectWrapper {
        val objectUri = URI.create(url)
        val objectenApiPlugin: ObjectenApiPlugin =
            pluginService.createInstance(objectenApiPluginConfigurationId)

        return objectenApiPlugin.getObject(objectUri)
    }

    private fun ObjectManagement.createObject(
        objectData: JsonNode,
    ): ObjectWrapper {
        val objectenApiPlugin: ObjectenApiPlugin =
            pluginService.createInstance(objectenApiPluginConfigurationId)
        val objecttypenApiPlugin: ObjecttypenApiPlugin =
            pluginService.createInstance(objecttypenApiPluginConfigurationId)
        val objectTypeUrl = objecttypenApiPlugin.getObjectTypeUrlById(objecttypeId)
        val createObjectRequest = ObjectRequest(
            objectTypeUrl,
            ObjectRecord(
                typeVersion = objecttypeVersion,
                data = objectData,
                startAt = LocalDate.now()
            )
        )

        return objectenApiPlugin.createObject(createObjectRequest)
    }

    private fun ObjectManagement.patchObject(
        objectUrl: URI,
        objectData: JsonNode,
    ): ObjectWrapper {
        val objectenApiPlugin: ObjectenApiPlugin =
            pluginService.createInstance(objectenApiPluginConfigurationId)
        val objecttypenApiPlugin: ObjecttypenApiPlugin = pluginService
            .createInstance(objecttypenApiPluginConfigurationId)
        val objectTypeUrl = objecttypenApiPlugin.getObjectTypeUrlById(objecttypeId)
        val createObjectRequest = ObjectRequest(
            objectTypeUrl,
            ObjectRecord(
                typeVersion = objecttypeVersion,
                data = objectData,
                startAt = LocalDate.now()
            )
        )

        return objectenApiPlugin.objectPatch(objectUrl, createObjectRequest)
    }

    companion object {
        private val logger: KLogger = KotlinLogging.logger {}
        private val objectMapper: ObjectMapper = MapperSingleton.get().findAndRegisterModules()
    }
}