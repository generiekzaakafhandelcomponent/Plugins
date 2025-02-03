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

package com.ritense.externeklanttaak.listener

import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.authorization.annotation.RunWithoutAuthorization
import com.ritense.externeklanttaak.domain.FinalizerProcessVariables.EXTERNE_KLANTTAAK_OBJECT_URL
import com.ritense.externeklanttaak.domain.IExterneKlanttaak
import com.ritense.externeklanttaak.plugin.ExterneKlanttaakPlugin
import com.ritense.notificatiesapi.event.NotificatiesApiNotificationReceivedEvent
import com.ritense.notificatiesapi.exception.NotificatiesNotificationEventException
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectWrapper
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.camunda.domain.CamundaTask
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.service.CamundaProcessService
import com.ritense.valtimo.service.CamundaTaskService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.event.EventListener
import org.springframework.transaction.annotation.Transactional
import java.net.URI


open class ExterneKlanttaakEventListener(
    private val objectManagementService: ObjectManagementService,
    private val pluginService: PluginService,
    private val taskService: CamundaTaskService,
    private val processDocumentService: ProcessDocumentService,
    private val processService: CamundaProcessService,
) {
    @Transactional
    @RunWithoutAuthorization
    @EventListener(NotificatiesApiNotificationReceivedEvent::class)
    open fun handle(event: NotificatiesApiNotificationReceivedEvent) {
        logger.info {
            "Received Notification. Attempting to handle Resource as Externe Klanttaak Object"
        }
        val objectTypeId = event.getObjectTypeIdOrNull()
            ?: run {
                logger.debug {
                    "Skipping Event: Doesn't match handling criteria"
                }
                return@handle
            }
        val objectManagement = objectManagementService.findByObjectTypeId(objectTypeId)
            ?: run {
                logger.info {
                    "Skipping Event: Compatible Object Management configuration not found"
                }
                return@handle
            }
        val matchedPluginConfiguration =
            pluginService
                .findPluginConfiguration(ExterneKlanttaakPlugin::class.java) { config ->
                    config
                        .get("objectManagementConfigurationId")
                        .textValue()
                        .equals(
                            objectManagement.id.toString()
                        )
                }
                ?: run {
                    logger.info {
                        "Skipping Event: No ExterneKlantaakPlugin configuration found for handling this object"
                    }
                    return@handle
                }

        logger.debug {
            "Attempting to handle notification resource with Externe Klanttaak Plugin id [${matchedPluginConfiguration.id}]]"
        }

        handleIfOwnExterneKlanttaak(
            resourceUrl = event.resourceUrl,
            objectManagement = objectManagement,
            pluginConfigurationId = matchedPluginConfiguration.id,
        )
    }

    private fun handleIfOwnExterneKlanttaak(
        resourceUrl: String,
        objectManagement: ObjectManagement,
        pluginConfigurationId: PluginConfigurationId
    ) {
        val resource = objectManagement.getObjectByUrl(resourceUrl)
        val klanttaak: IExterneKlanttaak =
            objectMapper.convertValue(
                resource.record.data
                    ?: throw RuntimeException("Failed to extract Externe Klanttaak body from ObjectWrapper")
            )

        if (!klanttaak.canBeHandled()) {
            logger.info {
                "Skipping Event: Externe Klanttaak with verwerken taak id ${klanttaak.verwerkerTaakId} is already handled."
            }
            return
        }
        val camundaTask: CamundaTask =
            try {
                taskService.findTaskById(klanttaak.verwerkerTaakId)
            } catch (ex: Exception) {
                throw RuntimeException(
                    "Task with id ${klanttaak.verwerkerTaakId} not found. Can not handle this Externe Klanttaak.",
                    ex
                )
            }

        handleResourceAsExterneKlanttaak(
            resourceUrl = resource.url,
            camundaTask = camundaTask,
            pluginConfigurationId = pluginConfigurationId,
        )
    }

    private fun handleResourceAsExterneKlanttaak(
        resourceUrl: URI,
        camundaTask: CamundaTask,
        pluginConfigurationId: PluginConfigurationId
    ) {

        val externeKlanttaakPlugin: ExterneKlanttaakPlugin = pluginService.createInstance(pluginConfigurationId.id)
        val processInstanceId = CamundaProcessInstanceId(camundaTask.getProcessInstanceId())
        val documentId = runWithoutAuthorization {
            processDocumentService.getDocumentId(processInstanceId, camundaTask)
        }
        val variables = mapOf(
            EXTERNE_KLANTTAAK_OBJECT_URL.value to resourceUrl
        )

        logger.debug { "Starting finalizer process for Externe Klanttaak with verwerker task id '${camundaTask.id}'" }
        startFinalizerProcess(
            processDefinitionKey = externeKlanttaakPlugin.finalizerProcess,
            businessKey = documentId.id.toString(),
            variables = variables
        )
    }

    private fun startFinalizerProcess(
        processDefinitionKey: String,
        businessKey: String,
        variables: Map<String, Any>,
    ) {
        try {
            runWithoutAuthorization {
                processService.startProcess(processDefinitionKey, businessKey, variables)
            }
            logger.info { "Process started successfully for process definition key '$processDefinitionKey' and document id '${businessKey}'" }
        } catch (ex: RuntimeException) {
            throw NotificatiesNotificationEventException(
                "Could not start process with definition: $processDefinitionKey and businessKey: $businessKey.\n " +
                    "Reason: ${ex.message}"
            )
        }
    }

    private fun NotificatiesApiNotificationReceivedEvent.getObjectTypeIdOrNull(): String? {
        return when (
            kanaal.equals(DEFAULT_NOTIFICATIONS_CHANNEL, true) ||
                actie.equals(DEFAULT_NOTIFICATIONS_ACTION, true)
        ) {
            true -> kenmerken[DEFAULT_NOTIFICATION_KENMERKEN_OBJECTTYPE]?.substringAfterLast("/")
            false -> null
        }
    }

    private fun ObjectManagement.getObjectByUrl(
        url: String,
    ): ObjectWrapper {
        val objectUri = URI.create(url)
        val objectenApiPlugin: ObjectenApiPlugin =
            pluginService.createInstance(objectenApiPluginConfigurationId)

        return objectenApiPlugin.getObject(objectUri)
    }

    companion object {
        private const val DEFAULT_NOTIFICATION_KENMERKEN_OBJECTTYPE = "objectType"
        private const val DEFAULT_NOTIFICATIONS_CHANNEL = "objecten"
        private const val DEFAULT_NOTIFICATIONS_ACTION = "update"
        private val objectMapper = MapperSingleton.get()
        private val logger = KotlinLogging.logger {}
    }
}