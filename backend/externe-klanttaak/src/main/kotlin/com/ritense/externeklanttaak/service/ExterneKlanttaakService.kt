/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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
import com.ritense.externeklanttaak.domain.KlanttaakVersion
import com.ritense.externeklanttaak.model.IPluginActionConfig
import com.ritense.externeklanttaak.service.impl.DefaultUtilityService
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
import jdk.jshell.execution.Util
import mu.KLogger
import mu.KotlinLogging
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
    private val utilService: UtilityService,
) {
    internal fun createExterneKlanttaak(
        klanttaakVersion: KlanttaakVersion,
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
                delegateTask = delegateTask,
                config = resolvedConfig,
                utilService = utilService
            )

        objectManagement.createObject(objectMapper.valueToTree(klanttaak))
            .also { result ->
                logger.info {
                    "Created Externe Klanttaak object with URL [${result.url}] for task with id [${delegateTask.id}]"
                }
                config.resultingKlanttaakObjectUrlVariable?.let {
                    delegateTask.execution.setVariable(it, result.url)
                }
            }
    }

    internal fun completeExterneKlanttaak(
        klanttaakVersion: KlanttaakVersion,
        objectManagementId: UUID,
        execution: DelegateExecution
    ) {
        logger.debug { "Completing Externe Klanttaak" }
        val objectManagement = objectManagementService.getById(objectManagementId)
            ?: throw IllegalStateException("Could not find Object Management Configuration by ID $objectManagementId")

        val (verwerkerTaakId: String, externeKlanttaakObjectUrl: String) =
            REQUIRED_FINALIZER_PROCESS_VARIABLES.map {
                execution.getVariable(it).toString()
            }
        val externeKlanttaakObject = objectManagement.getObject(URI.create(externeKlanttaakObjectUrl))

        val completedTaak = klanttaakVersion.complete(
            externeTaak =
            objectMapper.convertValue(
                externeKlanttaakObject.record.data
                    ?: throw RuntimeException("externeKlanttaak meta data was empty!")
            ),
            utilService = utilService
        )

        runWithoutAuthorization { taskService.complete(verwerkerTaakId) }

        objectManagement.patchObject(externeKlanttaakObject.url, objectMapper.convertValue(completedTaak))
            .also {
                logger.info {
                    "Completed Externe Klanttaak with Id [${it.uuid}] and VerwerkerTaakId [$verwerkerTaakId]."
                }
            }
    }

    private fun resolvePluginActionProperties(
        config: IPluginActionConfig,
        execution: DelegateExecution
    ): IPluginActionConfig {
        val configProperties = objectMapper.valueToTree<ObjectNode>(config)
        val requestedValues = configProperties.properties()
            .filter { it.value.isTextual }
            .mapNotNull { it.value.textValue() }
        val resolvedValues = valueResolverService.resolveValues(
            execution.processInstanceId,
            execution,
            requestedValues
        )

        return objectMapper.convertValue(
            configProperties.properties().associate { (key, value) ->
                key to (resolvedValues.get(value.textValue()) ?: value)
            }
        )
    }

    private fun ObjectManagement.getObject(
        objectUrl: URI,
    ): ObjectWrapper {
        val objectenApiPlugin: ObjectenApiPlugin =
            pluginService.createInstance(objectenApiPluginConfigurationId)

        return objectenApiPlugin.getObject(objectUrl)
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
        val REQUIRED_FINALIZER_PROCESS_VARIABLES = listOf("verwerkerTaakId", "externeKlanttaakObjectUrl")
        private val logger: KLogger = KotlinLogging.logger {}
        private val objectMapper: ObjectMapper = MapperSingleton.get()
    }
}