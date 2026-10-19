package com.ritense.valtimoplugins.openklant.resolver

import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.plugin.OpenKlantPlugin
import com.ritense.valtimoplugins.openklant.service.OpenKlantService
import com.ritense.valtimoplugins.openklant.util.ReflectionUtil
import com.ritense.valueresolver.ValueResolverFactory
import com.ritense.zakenapi.service.ZaakDocumentService
import org.jetbrains.annotations.VisibleForTesting
import org.camunda.bpm.engine.delegate.VariableScope
import java.util.UUID
import java.util.function.Function

class OpenKlantValueResolverFactory(
    private val processDocumentService: ProcessDocumentService,
    private val zaakDocumentService: ZaakDocumentService,
    private val openKlantService: OpenKlantService,
    private val reflectionUtil: ReflectionUtil,
    private val pluginService: PluginService,
    private val openKlantPropertiesFromEnvironmentVariables: OpenKlantProperties? = null,
) : ValueResolverFactory {
    override fun supportedPrefix(): String = "klant"

    override fun createResolver(documentId: String): Function<String, Any?> {
        val zaakUuid = zaakDocumentService.getZaakByDocumentIdOrThrow(UUID.fromString(documentId)).uuid

        return Function { requestedValue ->
            when (requestedValue) {
                "klantcontacten" -> getKlantcontacten(zaakUuid)
                "klantcontactenOrNull" -> getKlantcontactenOrNull(zaakUuid)

                else -> throw IllegalArgumentException("Unknown Open Klant column with name: $requestedValue")
            }
        }
    }

    override fun createResolver(
        processInstanceId: String,
        variableScope: VariableScope,
    ): Function<String, Any?> {
        // TODO CamundaProcessInstanceId CHANGES TO OperatonProcessInstanceId in v13
        val document = processDocumentService.getDocument(CamundaProcessInstanceId(processInstanceId), variableScope)
        return createResolver(document.id().toString())
    }

    override fun handleValues(
        processInstanceId: String,
        variableScope: VariableScope?,
        values: Map<String, Any?>,
    ) {
        TODO()
    }

    private fun getKlantcontacten(zaakUuid: UUID) = getKlantcontactenOrNull(zaakUuid) ?: emptyList<Any>()

    private fun getKlantcontactenOrNull(zaakUuid: UUID): Any? =
        runCatching {
            openKlantService.getAllKlantcontacten(
                createKlantcontactOptions(zaakUuid, openKlantProperties()),
            )
        }.getOrNull()
            ?.let { reflectionUtil.deepReflectedMapOf(it) }

    @VisibleForTesting
    internal fun openKlantProperties(): OpenKlantProperties =
        openKlantPropertiesFromPluginConfiguration()
            ?: openKlantPropertiesFromEnvironmentVariables
            ?: throw IllegalStateException(MISSING_CONFIGURATION_MESSAGE)

    private fun openKlantPropertiesFromPluginConfiguration(): OpenKlantProperties? =
        pluginService
            .findPluginConfigurations(OpenKlantPlugin::class.java) { true }
            .also { configurations ->
                check(configurations.size <= 1) { multipleConfigurationsMessage(configurations.map { it.title }) }
            }.firstOrNull()
            ?.let { pluginService.createInstance(it) as OpenKlantPlugin }
            ?.let {
                OpenKlantProperties(
                    klantinteractiesUrl = it.klantinteractiesUrl,
                    token = it.token,
                )
            }

    private fun createKlantcontactOptions(
        zaakUuid: UUID,
        properties: OpenKlantProperties,
    ): KlantcontactOptions =
        KlantcontactOptions(
            klantinteractiesUrl = properties.klantinteractiesUrl,
            token = properties.token,
            objectTypeId = OBJECT_TYPE_ID,
            objectUuid = zaakUuid.toString(),
        )

    companion object {
        private const val OBJECT_TYPE_ID = "zaak"

        internal const val MISSING_CONFIGURATION_MESSAGE =
            "Cannot resolve 'klant:' values: no Open Klant configuration found. " +
                "Configure the Open Klant plugin (klantinteractiesUrl and token) in the admin UI."

        internal const val MULTIPLE_CONFIGURATIONS_MESSAGE =
            "Cannot resolve 'klant:' values: multiple Open Klant plugin configurations found. " +
                "Keep exactly one configuration, so it is unambiguous which Open Klant to query."

        internal fun multipleConfigurationsMessage(titles: List<String>): String =
            "$MULTIPLE_CONFIGURATIONS_MESSAGE Found: ${titles.joinToString()}."
    }
}
