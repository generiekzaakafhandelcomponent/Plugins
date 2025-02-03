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
package com.ritense.externeklanttaak.version.v1x1x0

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.treeToValue
import com.ritense.externeklanttaak.domain.FinalizerProcessVariables.EXTERNE_KLANTTAAK_OBJECT_URL
import com.ritense.externeklanttaak.domain.IExterneKlanttaak
import com.ritense.externeklanttaak.domain.IPluginAction
import com.ritense.externeklanttaak.domain.IPluginActionConfig
import com.ritense.externeklanttaak.domain.SpecVersion
import com.ritense.externeklanttaak.domain.Version
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.DataBindingConfig
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort.PORTAALFORMULIER
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakStatus.VERWERKT
import com.ritense.notificatiesapi.exception.NotificatiesNotificationEventException
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import com.ritense.zakenapi.ZakenApiPlugin
import io.github.oshai.kotlinlogging.KLogger
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.MalformedURLException
import java.net.URI
import java.util.UUID

class CompleteExterneKlanttaakActionV1x1x0(
    private val pluginService: PluginService,
    private val valueResolverService: ValueResolverService,
    private val taskService: CamundaTaskService,
    private val zaakUrlProvider: ZaakUrlProvider,
) : IPluginAction {
    fun complete(
        externeKlanttaak: ExterneKlanttaakV1x1x0,
        pluginActionConfig: CompleteExterneKlanttaakActionConfigV1x1x0,
        delegateExecution: DelegateExecution
    ): IExterneKlanttaak? {
        return when (externeKlanttaak.canBeHandled()) {
            true -> {
                if (externeKlanttaak.soort == PORTAALFORMULIER) {
                    val verzondenData = requireNotNull(externeKlanttaak.portaalformulier?.verzondenData) {
                        "Property [portaalformulier] is required when [taakSoort] is ${externeKlanttaak.soort}"
                    }
                    if (pluginActionConfig.koppelDocumenten) {
                        linkDocumentsToZaak(
                            documentPathsPath = pluginActionConfig.documentPadenPad,
                            verzondenData = verzondenData,
                            delegateExecution = delegateExecution,
                        )
                    }

                    if (pluginActionConfig.bewaarIngediendeGegevens) {
                        handleFormulierTaakSubmission(
                            submission = verzondenData,
                            submissionMapping = pluginActionConfig.verzondenDataMapping,
                            verwerkerTaakId = externeKlanttaak.verwerkerTaakId,
                        )
                    }
                }
                externeKlanttaak.copy(status = VERWERKT)
            }

            false -> {
                logger.debug { "Task not completed due to unmatched criteria." }
                null
            }
        }
    }

    private fun getZaakUrlAndPluginByDocumentId(businessKey: String): Pair<URI, ZakenApiPlugin> {
        val documentId = UUID.fromString(businessKey)
        val zaakUrl = zaakUrlProvider.getZaakUrl(documentId)
        val zakenApiPlugin = requireNotNull(
            pluginService.createInstance(ZakenApiPlugin::class.java, ZakenApiPlugin.findConfigurationByUrl(zaakUrl))
        ) { "No plugin configuration was found for zaak with URL $zaakUrl" }
        return Pair(zaakUrl, zakenApiPlugin)
    }

    internal fun handleFormulierTaakSubmission(
        submission: Map<String, Any>,
        submissionMapping: List<DataBindingConfig>,
        verwerkerTaakId: String,
    ) {
        logger.debug {
            "Handling Form Submission for Externe Klanttaak with [verwerkerTaakId]: $verwerkerTaakId"
        }
        if (submission.isNotEmpty()) {
            val task = taskService.findTaskById(verwerkerTaakId)
            val submissionNode = objectMapper.valueToTree<JsonNode>(submission)
            val resolvedValues = getResolvedValues(submissionMapping, submissionNode)

            if (resolvedValues.isNotEmpty()) {
                valueResolverService.handleValues(
                    processInstanceId = task.getProcessInstanceId(),
                    variableScope = task,
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

    @SpecVersion(min = "1.1.0")
    data class CompleteExterneKlanttaakActionConfigV1x1x0(
        override val externeKlanttaakVersion: Version = Version(1, 1, 0),
        override val resultingKlanttaakObjectUrlVariable: String? = null,
        override val klanttaakObjectUrl: String = "pv:$EXTERNE_KLANTTAAK_OBJECT_URL",
        val bewaarIngediendeGegevens: Boolean,
        val verzondenDataMapping: List<DataBindingConfig> = emptyList(),
        val koppelDocumenten: Boolean,
        val documentPadenPad: String? = "/documenten",
    ) : IPluginActionConfig

    companion object {
        private const val DEFAULT_ZAAKDOCUMENT_TITLE = "Externe Klanttaak Document"
        private const val DEFAULT_ZAAKDOCUMENT_OMSCHRIJVING = "Een document die in een Externe Klanttaak geüpload was"
        private val logger: KLogger = KotlinLogging.logger {}
        private val objectMapper: ObjectMapper = MapperSingleton.get()
    }
}