package com.ritense.valtimoplugins.oipklanttaak.listener

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.authorization.annotation.RunWithoutAuthorization
import com.ritense.notificatiesapi.event.NotificatiesApiNotificationReceivedEvent
import com.ritense.notificatiesapi.exception.NotificatiesNotificationEventException
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectWrapper
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.OperatonProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.operaton.domain.OperatonTask
import com.ritense.valtimo.security.exceptions.TaskNotFoundException
import com.ritense.valtimo.service.OperatonProcessService
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oipklanttaak.OipKlanttaakPlugin
import com.ritense.valtimoplugins.oipklanttaak.domain.OipKlanttaak
import com.ritense.valtimoplugins.oipklanttaak.domain.ProcessVariables.OIP_KLANTTAAK_OBJECT_URL
import com.ritense.valtimoplugins.oipklanttaak.domain.ProcessVariables.VERWERKER_TAAK_ID
import com.ritense.valtimoplugins.oipklanttaak.domain.Status
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.event.EventListener
import org.springframework.transaction.annotation.Transactional
import java.net.URI
import java.util.UUID

open class OipKlanttaakEventListener(
    private val pluginService: PluginService,
    private val objectManagementService: ObjectManagementService,
    private val processDocumentService: ProcessDocumentService,
    private val processService: OperatonProcessService,
    private val taskService: OperatonTaskService
) {

    private val objectMapper = pluginService.getObjectMapper()

    @Transactional
    @RunWithoutAuthorization
    @EventListener(NotificatiesApiNotificationReceivedEvent::class)
    open fun handle(event: NotificatiesApiNotificationReceivedEvent) {
        logger.info { "Received Notification API event, attempting to handle Resource as OIP Task Object" }
        logger.trace { "Event: $event" }
        if (eventMatchesCompleteTaskCriteria(event)) {
            objectManagementFor(event)?.let { objectManagement ->
                oipKlanttaakPluginConfigurationFor(objectManagement)?.let { oipKlanttaakPluginConfiguration ->
                    operatonTaskFor(
                        resourceUrl = event.resourceUrl,
                        objectenApiPluginConfigurationId = objectManagement.objectenApiPluginConfigurationId
                    )?.let { operatonTask ->
                        logger.info {
                            "Trying to handle OIP Klanttaak using plugin configuration with id '${oipKlanttaakPluginConfiguration.id}'"
                        }
                        handleTaskFor(
                            resourceUrl = event.resourceUrl,
                            operatonTask = operatonTask,
                            objectManagement = objectManagement,
                            oipKlanttaakPluginConfiguration = oipKlanttaakPluginConfiguration
                        )
                    }
                }
            }
        }
    }

    private fun eventMatchesCompleteTaskCriteria(event: NotificatiesApiNotificationReceivedEvent): Boolean =
        (
            objectTypeFrom(event) != null
            &&
            event.kanaal.equals("objecten", ignoreCase = true)
            &&
            event.actie.equals("update", ignoreCase = true)
        ).also {
            if (!it) {
                logger.info { "Skipping: Event does not match criteria to complete an OIP Task." }
            }
        }

    private fun operatonTaskFor(
        resourceUrl: String,
        objectenApiPluginConfigurationId: UUID
    ): OperatonTask? =
        getObjectByUrl(resourceUrl, objectenApiPluginConfigurationId).let { objectWrapper ->
            objectMapper.convertValue<OipKlanttaak>(objectWrapper.record.data).let { oipKlanttaak ->
                if (oipKlanttaak.status != Status.UITGEVOERD) {
                    logger.info {
                        "Skipping: Taak cannot be handled. Does not match expected status UITGEVOERD."
                    }
                    return null
                }
                return try {
                    taskService.findTaskById(oipKlanttaak.verwerkerTaakId.toString())
                } catch (_: TaskNotFoundException) {
                    logger.info {
                        "Skipping: No OperatonTask found with id '${oipKlanttaak.verwerkerTaakId}'."
                    }
                    null
                }
            }
        }

    private fun handleTaskFor(
        resourceUrl: String,
        operatonTask: OperatonTask,
        objectManagement: ObjectManagement,
        oipKlanttaakPluginConfiguration: PluginConfiguration,
    ) {
        pluginService.createInstance<OipKlanttaakPlugin>(oipKlanttaakPluginConfiguration.id.id).let { oipKlanttaakPlugin ->
            val documentId = runWithoutAuthorization {
                processDocumentService.getDocumentId(
                    OperatonProcessInstanceId(operatonTask.getProcessInstanceId()),
                    operatonTask
                )
            }
            logger.debug { "Starting finalizer process for OIP Klanttaak with verwerker-taak-id '${operatonTask.id}'" }
            startFinalizerProcess(
                processDefinitionKey = oipKlanttaakPlugin.finalizerProcess,
                businessKey = documentId.id.toString(),
                variables = mapOf(
                    VERWERKER_TAAK_ID to operatonTask.id,
                    OIP_KLANTTAAK_OBJECT_URL to resourceUrl
                )
            )
        }
    }

    private fun startFinalizerProcess(
        processDefinitionKey: String,
        businessKey: String,
        variables: Map<String, Any>
    ) {
        try {
            runWithoutAuthorization {
                processService.startProcess(
                    processDefinitionKey,
                    businessKey,
                    variables
                ).also {
                    logger.info {
                        "Started ProcessInstance(id=${it.processInstanceDto.id}) successfully for " +
                            "ProcessDefinition(key=$processDefinitionKey) and " +
                            "Document(id=$businessKey)"
                    }
                }
            }
        } catch (ex: RuntimeException) {
            throw NotificatiesNotificationEventException(
                "Could not start ProcessInstance from ProcessDefinition(key=$processDefinitionKey) and businessKey: $businessKey.\n" +
                    "Reason: ${ex.message}"
            )
        }
    }

    private fun objectManagementFor(event: NotificatiesApiNotificationReceivedEvent): ObjectManagement? =
        objectTypeFrom(event).let { objectType ->
            requireNotNull(objectType) { "Object type is required." }
            objectType.substringAfterLast("/").let { objectTypeId ->
                objectManagementService.findByObjectTypeId(objectTypeId).also {
                    if (it == null) {
                        logger.warn { "Skipping: Object management not found for object type id '$objectTypeId'" }
                    }
                }
            }
        }

    private fun oipKlanttaakPluginConfigurationFor(objectManagement: ObjectManagement): PluginConfiguration? =
        pluginService.findPluginConfiguration(OipKlanttaakPlugin::class.java) { properties: JsonNode ->
            properties.get(OBJECT_MANAGEMENT_CONFIGURATION_ID).textValue().equals(objectManagement.id.toString())
        }.also {
            if (it == null) {
                logger.warn {
                    "Skipping: No OIP Klanttaak plugin configuration found for object management with id '${objectManagement.id}'"
                }
            }
        }

    private fun objectTypeFrom(event: NotificatiesApiNotificationReceivedEvent): String? =
        event.kenmerken["objectType"]

    private fun getObjectByUrl(url: String, objectenApiPluginConfigurationId: UUID): ObjectWrapper =
        pluginService.createInstance<ObjectenApiPlugin>(objectenApiPluginConfigurationId)
            .getObject(URI.create(url))

    companion object {
        private val logger = KotlinLogging.logger {}

        private const val OBJECT_MANAGEMENT_CONFIGURATION_ID = "objectManagementConfigurationId"
    }
}

