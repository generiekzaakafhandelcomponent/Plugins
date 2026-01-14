/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.oipklanttaak.service

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.authorization.AuthorizationContext
import com.ritense.document.domain.patch.JsonPatchService
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectRecord
import com.ritense.objectenapi.client.ObjectRequest
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.patch.JsonPatchBuilder
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oipklanttaak.domain.Authorizee
import com.ritense.valtimoplugins.oipklanttaak.domain.Betrokkene
import com.ritense.valtimoplugins.oipklanttaak.dto.DataBinding
import com.ritense.valtimoplugins.oipklanttaak.domain.Formulier
import com.ritense.valtimoplugins.oipklanttaak.domain.InformatieObject
import com.ritense.valtimoplugins.oipklanttaak.domain.Koppeling
import com.ritense.valtimoplugins.oipklanttaak.domain.LegalSubject
import com.ritense.valtimoplugins.oipklanttaak.domain.LevelOfAssurance
import com.ritense.valtimoplugins.oipklanttaak.domain.OipKlanttaak
import com.ritense.valtimoplugins.oipklanttaak.domain.Portaalformulier
import com.ritense.valtimoplugins.oipklanttaak.ProcessVariables
import com.ritense.valtimoplugins.oipklanttaak.domain.Soort
import com.ritense.valtimoplugins.oipklanttaak.domain.Status
import com.ritense.valtimoplugins.oipklanttaak.copy
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import com.ritense.zakenapi.ZakenApiPlugin
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
    private val taskService: OperatonTaskService,
    private val valueResolverService: ValueResolverService,
    private val zaakUrlProvider: ZaakUrlProvider
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
                                    data = objectMapper.convertValue(
                                        OipKlanttaak(
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

    fun completeDelegatedTask(
        execution: DelegateExecution,
        objectManagementId: UUID,
        saveReceivedData: Boolean,
        receivedDataMapping: List<DataBinding>? = null,
        linkDocuments: Boolean,
        pathToDocuments: String? = null,
    ) {
        val verwerkerTaakId = execution.getVariableAsString(ProcessVariables.VERWERKER_TAAK_ID)
        val oipTaskObjectUrl = execution.getVariableAsURI(ProcessVariables.OIP_KLANTTAAK_OBJECT_URL)

        objectManagementById(objectManagementId).let { objectManagement ->
            objectenApiPluginByPluginConfigurationId(objectManagement.objectenApiPluginConfigurationId).let { objectenApiPlugin ->
                objectenApiPlugin.getObject(oipTaskObjectUrl).let { objectWrapper ->
                    requireNotNull(objectWrapper.record.data) {
                        "No data found for object with URL '$oipTaskObjectUrl'"
                    }
                    objectMapper.convertValue<OipKlanttaak>(objectWrapper.record.data).let { oipKlanttaak ->
                        require(oipKlanttaak.soort == Soort.EXTERNFORMULIER) {
                            "Soort is not '${Soort.EXTERNFORMULIER.name}'"
                        }
                        require(oipKlanttaak.status == Status.UITGEVOERD) {
                            "Status is not '${Status.UITGEVOERD.name}'"
                        }
                        AuthorizationContext.Companion.runWithoutAuthorization { taskService.complete(verwerkerTaakId) }
                            .also {
                            logger.info { "Task with id '$verwerkerTaakId' for object with URL '$oipTaskObjectUrl' completed" }
                        }

                        if (saveReceivedData || linkDocuments) {
                            requireNotNull(oipKlanttaak.portaalformulier.verzondenData) {
                                "Form does not contain any submitted data"
                            }
                            objectMapper.valueToTree<ObjectNode>(oipKlanttaak.portaalformulier.verzondenData).let { receivedDataNode ->
                                if (saveReceivedData) {
                                    logger.debug { "Saving received data to document" }
                                    requireNotNull(receivedDataMapping) { "Received data mapping is null" }
                                    require(receivedDataMapping.isNotEmpty()) { "Received data mapping is empty" }
                                    // extract data from submitted data and map to document
                                    receivedDataMapping.associate { it.value to receivedDataNode.at(JsonPointer.valueOf(it.key)) }.let { resolvedData ->
                                        valueResolverService.handleValues(
                                            documentId = UUID.fromString(execution.businessKey),
                                            values = resolvedData
                                        )
                                    }
                                }

                                if (linkDocuments) {
                                    logger.debug { "Linking documents to zaak" }
                                    requireNotNull(pathToDocuments) { "Path to documents is null" }
                                    require(pathToDocuments.isNotBlank()) { "Path to documents is blank" }
                                    receivedDataNode.at(JsonPointer.valueOf(pathToDocuments)).let { documentsNode ->
                                        if (documentsNode.isArray) {
                                            zakenApiPluginByDocumentId(UUID.fromString(execution.businessKey)).let { zakenApiPlugin ->
                                                documentsNode.forEach { documentNode ->
                                                    objectMapper.convertValue<InformatieObject>(documentNode).let { informatieObject ->
                                                        zakenApiPlugin.linkDocumentToZaak(
                                                            execution = execution,
                                                            documentUrl = informatieObject.informatieobjecttype.toASCIIString(),
                                                            titel = informatieObject.titel,
                                                            beschrijving = informatieObject.omschrijving
                                                        )
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        oipKlanttaak.copy(status = Status.VERWERKT).let { modifiedOipTask ->
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
                                    "OipTask object with URL '${oipTaskObjectUrl}' completed by changing status to '${Status.VERWERKT.name}'"
                                }
                            }
                        }
                    }
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

    private fun zakenApiPluginByDocumentId(id: UUID): ZakenApiPlugin =
        zaakUrlProvider.getZaakUrl(id).let { zaakUrl ->
            requireNotNull(pluginService.createInstance(
                ZakenApiPlugin::class.java,
                ZakenApiPlugin.Companion.findConfigurationByUrl(zaakUrl)
            )) { "Zaken API Plugin configuration not found for zaak with URL '$zaakUrl'" }
        }

    private fun DelegateExecution.getVariableAsString(variableName: String): String =
        getVariable(variableName).let { variableValue ->
            requireNotNull(variableValue) { "Variable '$variableName' is required but was not provided" }
            variableValue as String
        }

    private fun DelegateExecution.getVariableAsURI(variableName: String): URI =
        URI.create(getVariableAsString(variableName))

    companion object {
        private val logger = KotlinLogging.logger {}

        private const val DEFAULT_TASK_OWNER = "GZAC"
    }
}