package com.ritense.valtimoplugins.oiptask.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectGeometry
import com.ritense.objectenapi.client.ObjectRecord
import com.ritense.objectenapi.client.ObjectRequest
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.OperatonProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oiptask.domain.Authorizee
import com.ritense.valtimoplugins.oiptask.domain.Betrokkene
import com.ritense.valtimoplugins.oiptask.domain.Formulier
import com.ritense.valtimoplugins.oiptask.domain.LegalSubject
import com.ritense.valtimoplugins.oiptask.domain.LevelOfAssurance
import com.ritense.valtimoplugins.oiptask.domain.OipKlanttaak
import com.ritense.valtimoplugins.oiptask.domain.Portaalformulier
import com.ritense.valtimoplugins.oiptask.domain.ProcessVariables.OBJECTEN_API_PLUGIN_CONFIGURATION_ID
import com.ritense.valtimoplugins.oiptask.domain.ProcessVariables.OIP_KLANTTAAK_OBJECT_URL
import com.ritense.valtimoplugins.oiptask.domain.ProcessVariables.VERWERKER_TAAK_ID
import com.ritense.valtimoplugins.oiptask.domain.Status
import io.github.oshai.kotlinlogging.KotlinLogging
import org.operaton.bpm.engine.delegate.DelegateExecution
import org.operaton.bpm.engine.delegate.DelegateTask
import java.net.URI
import java.time.LocalDate
import java.util.UUID

class OipKlanttaakService(
    private val pluginService: PluginService,
    private val objectManagementService: ObjectManagementService,
    private val objectMapper: ObjectMapper,
    private val processDocumentService: ProcessDocumentService,
    private val taskService: OperatonTaskService
) {

    fun delegateTaskToOip(
        delegateTask: DelegateTask,
        objectManagementId: UUID,
        portaalFormulierUri: URI
    ) {
        val objectManagement = objectManagementService.getById(objectManagementId)
        requireNotNull(objectManagement) { "Object management not found for OIP Task" }

        val documentId = processDocumentService.getDocumentId(
            OperatonProcessInstanceId(delegateTask.processInstanceId), delegateTask
        )

        pluginService.createInstance<ObjecttypenApiPlugin>(objectManagement.objecttypenApiPluginConfigurationId)
            .getObjectTypeUrlById(objectManagement.objecttypeId).let { objectTypeUrl ->
                pluginService.createInstance<ObjectenApiPlugin>(objectManagement.objectenApiPluginConfigurationId)
                    .createObject(
                        ObjectRequest(
                            type = objectTypeUrl,
                            record = ObjectRecord(
                                typeVersion = objectManagement.objecttypeVersion,
                                data = objectMapper.convertValue(OipKlanttaak(
                                    titel = delegateTask.name,
                                    status = Status.OPEN,
                                    eigenaar = "",
                                    betrokkene = Betrokkene(
                                        levelOfAssurance = LevelOfAssurance.PASSWORD_PROTECTED_TRANSPORT,
                                        authorizee = Authorizee(
                                            legalSubject = LegalSubject(
                                                identifier = ""
                                            )
                                        )
                                    ),
                                    portaalformulier = Portaalformulier(
                                        formulier = Formulier(
                                            value = portaalFormulierUri
                                        )
                                    ),
                                    verwerkerTaakId = UUID.fromString(delegateTask.id)
                                )),
                                startAt = LocalDate.now()
                            )
                        )
                    ).also {
                        logger.info {
                            "OIP Klanttaak object with UUID '${it.uuid}' and URL '${it.url}' created for task with id '${delegateTask.id}'"
                        }
                    }
            }
    }

    fun completeToOipDelegatedTask(
        execution: DelegateExecution,
    ) {
        val verwerkerTaakId = execution.getVariableAsString(VERWERKER_TAAK_ID)
        val objectenApiPluginId = execution.getVariableAsUUID(OBJECTEN_API_PLUGIN_CONFIGURATION_ID)
        val oipTaskObjectUrl = execution.getVariableAsURI(OIP_KLANTTAAK_OBJECT_URL)

        runWithoutAuthorization { taskService.complete(verwerkerTaakId) }.also {
            logger.info { "Task with id '$verwerkerTaakId' for object with URL '$oipTaskObjectUrl' completed" }
        }

        val objectenApiPlugin = pluginService.createInstance<ObjectenApiPlugin>(objectenApiPluginId)

        objectenApiPlugin.getObject(oipTaskObjectUrl).let { objectWrapper ->
            requireNotNull(objectWrapper.record.data) { "No data found for object with URL '$oipTaskObjectUrl'" }
            objectMapper.convertValue<OipKlanttaak>(objectWrapper.record.data).let { oipTask ->
                oipTask.copy(status = Status.VERWERKT).let { modifiedOipTask ->
                    objectenApiPlugin.objectPatch(
                        oipTaskObjectUrl,
                        ObjectRequest(
                            type = objectWrapper.type,
                            record = objectWrapper.record.copy(
                                data = objectMapper.convertValue(modifiedOipTask)
                            )
                        )
                    ).also {
                        logger.info {
                            "OipTask object with URL '${oipTaskObjectUrl}' completed by changing status to 'VERWERKT'"
                        }
                    }
                }
            }
        }
    }

    private fun DelegateExecution.getVariableAsString(variableName: String): String =
        getVariable(variableName).let { variableValue ->
            requireNotNull(variableValue) { "Variable '$variableName' is required but was not provided" }
            variableValue as String
        }

    private fun DelegateExecution.getVariableAsUUID(variableName: String): UUID =
        UUID.fromString(getVariableAsString(variableName))

    private fun DelegateExecution.getVariableAsURI(variableName: String): URI =
        URI.create(getVariableAsString(variableName))

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}

internal fun ObjectRecord.copy(
    index: Int? = this.index,
    typeVersion: Int = this.typeVersion,
    data: JsonNode? = this.data,
    geometry: ObjectGeometry? = this.geometry,
    startAt: LocalDate = this.startAt,
    endAt: LocalDate? = this.endAt,
    registrationAt: LocalDate? = this.registrationAt,
    correctionFor: String? = this.correctionFor,
    correctedBy: String? = this.correctedBy
) = ObjectRecord(
    index = index,
    typeVersion = typeVersion,
    data = data,
    geometry = geometry,
    startAt = startAt,
    endAt = endAt,
    registrationAt = registrationAt,
    correctionFor = correctionFor,
    correctedBy = correctedBy
)
