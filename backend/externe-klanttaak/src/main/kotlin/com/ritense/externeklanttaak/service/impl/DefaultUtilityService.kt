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

package com.ritense.externeklanttaak.service.impl

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.treeToValue
import com.ritense.document.domain.patch.JsonPatchService
import com.ritense.externeklanttaak.domain.DataBindingConfig
import com.ritense.externeklanttaak.model.TaakIdentificatie
import com.ritense.externeklanttaak.model.TaakIdentificatie.Companion.TYPE_BSN
import com.ritense.externeklanttaak.model.TaakIdentificatie.Companion.TYPE_KVK
import com.ritense.externeklanttaak.service.UtilityService
import com.ritense.notificatiesapi.exception.NotificatiesNotificationEventException
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.contract.json.patch.JsonPatchBuilder
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import com.ritense.zakenapi.ZakenApiPlugin
import com.ritense.zakenapi.domain.rol.RolNatuurlijkPersoon
import com.ritense.zakenapi.domain.rol.RolNietNatuurlijkPersoon
import com.ritense.zakenapi.domain.rol.RolType
import mu.KLogger
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.delegate.DelegateTask
import java.net.MalformedURLException
import java.net.URI
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.UUID

class DefaultUtilityService(
    private val pluginService: PluginService,
    private val valueResolverService: ValueResolverService,
    private val getZaakUrl: ZaakUrlProvider,
) : UtilityService {
    internal fun stringAsInstantOrNull(input: String?): Instant? {
        val commonGzacDateTimeFormats = listOf(
            DateTimeFormatter.BASIC_ISO_DATE,
            DateTimeFormatter.ofPattern("d-MM-uuuu"), // mm-DD-yyyy
            DateTimeFormatter.ISO_LOCAL_DATE,
            DateTimeFormatter.ISO_LOCAL_DATE_TIME,
            DateTimeFormatter.ISO_ZONED_DATE_TIME,
            DateTimeFormatter.ISO_INSTANT,
        )

        return input?.let {
            commonGzacDateTimeFormats.firstNotNullOfOrNull {
                try {
                    LocalDate.parse(input, it).atStartOfDay().atZone(ZoneId.systemDefault()).toInstant()
                } catch (ex: RuntimeException) {
                    logger.debug { "Input string [$input] didn't match DateTimeFormatter [$it]" }
                    null
                }
            }
        }
    }

    internal fun getZaakinitiatorByDocumentId(businessKey: String): TaakIdentificatie {
        val (zaakUrl, zakenApiPlugin) = getZaakUrlAndPluginByDocumentId(businessKey)

        val initiator = requireNotNull(
            zakenApiPlugin.getZaakRollen(zaakUrl, RolType.INITIATOR).firstOrNull()
        ) { "No initiator role found for zaak with URL $zaakUrl" }

        return requireNotNull(
            initiator.betrokkeneIdentificatie.let {
                when (it) {
                    is RolNatuurlijkPersoon -> TaakIdentificatie(
                        TYPE_BSN,
                        requireNotNull(it.inpBsn) {
                            "Zaak initiator did not have valid inpBsn BSN"
                        }
                    )

                    is RolNietNatuurlijkPersoon -> TaakIdentificatie(
                        TYPE_KVK,
                        requireNotNull(it.annIdentificatie) {
                            "Zaak initiator did not have valid annIdentificatie KVK"
                        }
                    )

                    else -> null
                }
            }
        ) { "Could not map initiator identificatie (value=${initiator.betrokkeneIdentificatie}) for zaak with URL $zaakUrl to TaakIdentificatie" }
    }

    private fun getZaakUrlAndPluginByDocumentId(businessKey: String): Pair<URI, ZakenApiPlugin> {
        val documentId = UUID.fromString(businessKey)
        val zaakUrl = getZaakUrl.getZaakUrl(documentId)
        val zakenApiPlugin = requireNotNull(
            pluginService.createInstance(ZakenApiPlugin::class.java, ZakenApiPlugin.findConfigurationByUrl(zaakUrl))
        ) { "No plugin configuration was found for zaak with URL $zaakUrl" }
        return Pair(zaakUrl, zakenApiPlugin)
    }

    internal fun resolveFormulierTaakData(
        delegateTask: DelegateTask,
        sendData: List<DataBindingConfig>,
        documentId: String
    ): Map<String, Any> {
        val sendDataValuesResolvedMap = valueResolverService.resolveValues(documentId, sendData.map { it.key })

        if (sendData.size != sendDataValuesResolvedMap.size) {
            val failedValues = sendData
                .filter { !sendDataValuesResolvedMap.containsKey(it.key) }
                .joinToString(", ") { "'${it.key}' = '${it.value}'" }
            throw IllegalArgumentException(
                "Error in sendData for task: '${delegateTask.taskDefinitionKey}' and documentId: '${documentId}'. Failed to resolve values: $failedValues".trimMargin()
            )
        }

        val sendDataResolvedMap = sendData.associate { it.value to sendDataValuesResolvedMap[it.key] }
        val jsonPatchBuilder = JsonPatchBuilder()
        val taakData = objectMapper.createObjectNode()

        sendDataResolvedMap.forEach {
            val path = JsonPointer.valueOf(it.key)
            val valueNode = objectMapper.valueToTree<JsonNode>(it.value)
            jsonPatchBuilder.addJsonNodeValue(taakData, path, valueNode)
        }

        JsonPatchService.apply(jsonPatchBuilder.build(), taakData)

        return objectMapper.convertValue(taakData)
    }

    internal fun handleFormulierTaakSubmission(
        submission: Map<String, Any>,
        submissionMapping: List<DataBindingConfig>,
        verwerkerTaakId: String,
        delegateExecution: DelegateExecution,
    ) {
        logger.debug {
            "Handling Form Submission for Externe Klanttaak with [verwerkerTaakId]: $verwerkerTaakId"
        }
        if (submission.isNotEmpty()) {
            val processInstanceId = delegateExecution.processInstanceId
            val taakObjectData = objectMapper.valueToTree<JsonNode>(submission)
            val resolvedValues = getResolvedValues(submissionMapping, taakObjectData)

            if (resolvedValues.isNotEmpty()) {
                valueResolverService.handleValues(
                    processInstanceId = processInstanceId,
                    variableScope = delegateExecution,
                    values = resolvedValues,
                )
            }
        } else {
            logger.warn { "No data found in taakobject for task with id '$verwerkerTaakId'" }
        }
    }

    internal fun linkDocumentsToZaak(
        documentPathsPath: String? = "/documenten",
        verzondenData: Map<String, Any>,
        delegateExecution: DelegateExecution,
    ) {
        val documenten = getDocumentUrisFromSubmission(
            documentPathsPath = documentPathsPath,
            data = verzondenData,
        )
        if (documenten.isNotEmpty()) {
            val (_, zakenApiPlugin) = getZaakUrlAndPluginByDocumentId(delegateExecution.processBusinessKey)
            documenten.forEach { documentUri ->
                zakenApiPlugin.linkDocumentToZaak(
                    execution = delegateExecution,
                    documentUrl = documentUri,
                    titel = DEFAULT_ZAAKDOCUMENT_TITLE,
                    beschrijving = DEFAULT_ZAAKDOCUMENT_OMSCHRIJVING
                )
            }
        }
    }

    internal fun getDocumentUrisFromSubmission(
        documentPathsPath: String? = "/documenten",
        data: Map<String, Any>
    ): List<String> {
        val dataNode: ObjectNode = objectMapper.valueToTree(data)
        val documentPathsNode = dataNode.at(documentPathsPath)
        if (documentPathsNode.isMissingNode || documentPathsNode.isNull) {
            return emptyList()
        }
        if (!documentPathsNode.isArray) {
            throw NotificatiesNotificationEventException(
                "Could not retrieve document Urls.'/documenten' is not an array"
            )
        }
        val documentenUris = mutableListOf<String>()
        for (documentPathNode in documentPathsNode) {
            val documentUrlNode = dataNode.at(documentPathNode.textValue())
            if (!documentUrlNode.isMissingNode && !documentUrlNode.isNull) {
                try {
                    if (documentUrlNode.isTextual) {
                        documentenUris.add(documentUrlNode.textValue())
                    } else if (documentUrlNode.isArray) {
                        documentUrlNode.forEach { documentenUris.add(it.textValue()) }
                    } else {
                        throw NotificatiesNotificationEventException(
                            "Could not retrieve document Urls. Found invalid URL in '/documenten'. ${documentUrlNode.toPrettyString()}"
                        )
                    }
                } catch (e: MalformedURLException) {
                    throw NotificatiesNotificationEventException(
                        "Could not retrieve document Urls. Malformed URL in: '/documenten'"
                    )
                }
            }
        }
        return documentenUris
    }

    private fun getResolvedValues(receiveData: List<DataBindingConfig>, data: JsonNode): Map<String, Any> {
        return receiveData.associateBy({ it.key }, { getValue(data, it.value) })
    }

    private fun getValue(data: JsonNode, path: String): Any {
        val valueNode = data.at(JsonPointer.valueOf(path))
        if (valueNode.isMissingNode) {
            throw RuntimeException("Failed to find path '$path' in data: \n${data.toPrettyString()}")
        }
        return objectMapper.treeToValue(valueNode)
    }

    companion object {
        private const val DEFAULT_ZAAKDOCUMENT_TITLE = "Externe Klanttaak Document"
        private const val DEFAULT_ZAAKDOCUMENT_OMSCHRIJVING = "Een document die in een Externe Klanttaak geüpload was"
        private val logger: KLogger = KotlinLogging.logger {}
        private val objectMapper: ObjectMapper = MapperSingleton.get()
    }
}