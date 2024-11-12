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
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.DataBindingConfig
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort.PORTAALFORMULIER
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakStatus.AFGEROND
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakStatus.VERWERKT
import com.ritense.notificatiesapi.exception.NotificatiesNotificationEventException
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import com.ritense.zakenapi.ZakenApiPlugin
import mu.KLogger
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.MalformedURLException
import java.net.URI
import java.util.UUID

class CompleteExterneKlanttaakActionV1x1x0(
    private val pluginService: PluginService,
    private val valueResolverService: ValueResolverService,
    private val getZaakUrl: ZaakUrlProvider,
) : IPluginAction {

    fun <C : IPluginActionConfig> complete(): (IExterneKlanttaak, C, DelegateExecution) -> IExterneKlanttaak? =
        { externeKlanttaak, config, execution ->
            require(externeKlanttaak is ExterneKlanttaakV1x1x0)
            require(config is CompleteExterneKlanttaakActionConfigV1x1x0)
            when (externeKlanttaak.status == AFGEROND) {
                true -> {
                    if (externeKlanttaak.soort == PORTAALFORMULIER) {
                        val verzondenData = requireNotNull(externeKlanttaak.portaalformulier?.verzondenData) {
                            "Property [portaalformulier] is required when [taakSoort] is ${externeKlanttaak.soort}"
                        }
                        if (config.koppelDocumenten) {
                            linkDocumentsToZaak(
                                documentPathsPath = config.documentPadenPad,
                                verzondenData = verzondenData,
                                delegateExecution = execution,
                            )
                        }

                        if (config.bewaarIngediendeGegevens) {
                            handleFormulierTaakSubmission(
                                submission = verzondenData,
                                submissionMapping = config.verzondenDataMapping,
                                verwerkerTaakId = externeKlanttaak.verwerkerTaakId,
                                delegateExecution = execution,
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
        val zaakUrl = getZaakUrl.getZaakUrl(documentId)
        val zakenApiPlugin = requireNotNull(
            pluginService.createInstance(ZakenApiPlugin::class.java, ZakenApiPlugin.findConfigurationByUrl(zaakUrl))
        ) { "No plugin configuration was found for zaak with URL $zaakUrl" }
        return Pair(zaakUrl, zakenApiPlugin)
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

    @SpecVersion(min = "1.1.0")
    data class CompleteExterneKlanttaakActionConfigV1x1x0(
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