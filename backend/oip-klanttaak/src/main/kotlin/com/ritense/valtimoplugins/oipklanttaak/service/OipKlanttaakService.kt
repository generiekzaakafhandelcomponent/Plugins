package com.ritense.valtimoplugins.oipklanttaak.service

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.patch.JsonPatchService
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectGeometry
import com.ritense.objectenapi.client.ObjectRecord
import com.ritense.objectenapi.client.ObjectRequest
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.contract.json.patch.JsonPatchBuilder
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oipklanttaak.domain.Authorizee
import com.ritense.valtimoplugins.oipklanttaak.domain.Betrokkene
import com.ritense.valtimoplugins.oipklanttaak.domain.DataBinding
import com.ritense.valtimoplugins.oipklanttaak.domain.Formulier
import com.ritense.valtimoplugins.oipklanttaak.domain.Koppeling
import com.ritense.valtimoplugins.oipklanttaak.domain.LegalSubject
import com.ritense.valtimoplugins.oipklanttaak.domain.LevelOfAssurance
import com.ritense.valtimoplugins.oipklanttaak.domain.OipKlanttaak
import com.ritense.valtimoplugins.oipklanttaak.domain.Portaalformulier
import com.ritense.valtimoplugins.oipklanttaak.domain.ProcessVariables.OBJECTEN_API_PLUGIN_CONFIGURATION_ID
import com.ritense.valtimoplugins.oipklanttaak.domain.ProcessVariables.OIP_KLANTTAAK_OBJECT_URL
import com.ritense.valtimoplugins.oipklanttaak.domain.ProcessVariables.VERWERKER_TAAK_ID
import com.ritense.valtimoplugins.oipklanttaak.domain.Status
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.operaton.bpm.engine.delegate.DelegateExecution
import org.operaton.bpm.engine.delegate.DelegateTask
import java.net.URI
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.Period
import java.util.UUID

class OipKlanttaakService(
    private val pluginService: PluginService,
    private val objectManagementService: ObjectManagementService,
    private val objectMapper: ObjectMapper,
    private val processDocumentService: ProcessDocumentService,
    private val valueResolverService: ValueResolverService,
    private val taskService: OperatonTaskService
) {

    fun delegateTask(
        delegateTask: DelegateTask,
        objectManagementId: UUID,
        taskOwner: String = DEFAULT_TASK_OWNER,
        authorizeeIdentifier: String,
        levelOfAssurance: LevelOfAssurance,
        formUri: URI,
        formDataMapping: List<DataBinding>? = null,
        description: String? = null,
        koppeling: Koppeling? = null,
        leadTime: Period? = null,
        expirationDate: OffsetDateTime? = null,
        deadlineExtendable: Boolean? = null,
    ) {
        objectManagementById(objectManagementId).let { objectManagement ->
            objectTypenApiPluginByPluginConfigurationId(objectManagement.objecttypenApiPluginConfigurationId)
                .getObjectTypeUrlById(objectManagement.objecttypeId).let { objectTypeUrl ->
                    objectenApiPluginByPluginConfigurationId(objectManagement.objectenApiPluginConfigurationId)
                        .createObject(
                            ObjectRequest(
                                type = objectTypeUrl,
                                record = ObjectRecord(
                                    typeVersion = objectManagement.objecttypeVersion,
                                    data = objectMapper.convertValue(OipKlanttaak(
                                        titel = delegateTask.name,
                                        status = Status.OPEN,
                                        eigenaar = taskOwner,
                                        betrokkene = Betrokkene(
                                            levelOfAssurance = levelOfAssurance,
                                            authorizee = Authorizee(
                                                legalSubject = LegalSubject(
                                                    identifier = authorizeeIdentifier
                                                )
                                            )
                                        ),
                                        portaalformulier = Portaalformulier(
                                            formulier = Formulier(
                                                value = formUri
                                            ),
                                            data = formDataMapping?.let {
                                                resolveTaakData(
                                                    delegateTask = delegateTask,
                                                    formDataMapping = it
                                                )
                                            }
                                        ),
                                        verwerkerTaakId = UUID.fromString(delegateTask.id),
                                        koppeling = koppeling,
                                        toelichting = description,
                                        doorlooptijd = leadTime,
                                        verloopdatum = expirationDate,
                                        deadlineVerlengbaar = deadlineExtendable
                                    )),
                                    startAt = LocalDate.now()
                                )
                            )
                        ).also {
                            logger.info {
                                "OIP Klanttaak object with UUID '${it.uuid}' and URL '${it.url}' created for " +
                                    "task with id '${delegateTask.id}'"
                            }
                        }
                }
        }
    }

    fun completeDelegatedTask(
        execution: DelegateExecution,
        objectManagementId: UUID,
        saveReceivedData: Boolean,
        receivedDataMapping: List<DataBinding>? = null,
        linkDocuments: Boolean,
        pathToDocuments: String? = null,
    ) {
        val verwerkerTaakId = execution.getVariableAsString(VERWERKER_TAAK_ID)
        val objectenApiPluginConfigurationId = execution.getVariableAsUUID(OBJECTEN_API_PLUGIN_CONFIGURATION_ID)
        val oipTaskObjectUrl = execution.getVariableAsURI(OIP_KLANTTAAK_OBJECT_URL)

        runWithoutAuthorization { taskService.complete(verwerkerTaakId) }.also {
            logger.info { "Task with id '$verwerkerTaakId' for object with URL '$oipTaskObjectUrl' completed" }
        }

        if (saveReceivedData) {
//        val documentId = processDocumentService.getDocumentId(
//            OperatonProcessInstanceId(delegateTask.processInstanceId), delegateTask
//        )
        }

        if (linkDocuments) {
//            pathToDocuments
        }

        val objectenApiPlugin = objectenApiPluginByPluginConfigurationId(objectenApiPluginConfigurationId)

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

    private fun resolveTaakData(
        delegateTask: DelegateTask,
        formDataMapping: List<DataBinding>
    ): Map<String, Any> {
        valueResolverService.resolveValues(
            processInstanceId = delegateTask.processInstanceId,
            variableScope = delegateTask,
            requestedValues = formDataMapping.map { it.value }
        ).let { resolvedValuesMap ->
            if (formDataMapping.size != resolvedValuesMap.size) {
                formDataMapping.filter { !resolvedValuesMap.containsKey(it.value) }
                    .joinToString(", ") { "'${it.key}' = '${it.value}'" }.let { failedValues ->
                        throw IllegalArgumentException(
                            "Error in data mapping for Task(id=${delegateTask.id}, key=${delegateTask.taskDefinitionKey})'. " +
                                "Failed to resolve values: $failedValues"
                        )
                    }
            }
            JsonPatchBuilder().let { jsonPatchBuilder ->
                objectMapper.createObjectNode().let { taakData ->
                    formDataMapping.associate { it.key to resolvedValuesMap[it.value] }.forEach {
                        val path = JsonPointer.valueOf(it.key)
                        val valueNode = objectMapper.valueToTree<JsonNode>(it.value)
                        jsonPatchBuilder.addJsonNodeValue(taakData, path, valueNode)
                    }
                    JsonPatchService.apply(jsonPatchBuilder.build(), taakData)

                    return objectMapper.convertValue(taakData)
                }
            }
        }
    }

    private fun objectManagementById(id: UUID): ObjectManagement =
        objectManagementService.getById(id).let { objectManagement ->
            requireNotNull(objectManagement) { "Object Management Configuration with ID '$id' not found!" }
            return objectManagement
        }

    private fun objectTypenApiPluginByPluginConfigurationId(id: UUID) =
        pluginService.createInstance<ObjecttypenApiPlugin>(id)

    private fun objectenApiPluginByPluginConfigurationId(id: UUID) =
        pluginService.createInstance<ObjectenApiPlugin>(id)

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

        private const val DEFAULT_TASK_OWNER = "GZAC"
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
