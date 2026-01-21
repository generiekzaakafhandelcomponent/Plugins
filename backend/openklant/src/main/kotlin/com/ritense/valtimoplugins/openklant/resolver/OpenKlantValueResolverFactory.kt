package com.ritense.valtimoplugins.openklant.resolver

import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.service.OpenKlantService
import com.ritense.valtimoplugins.openklant.util.ReflectionUtil
import com.ritense.valueresolver.ValueResolverFactory
import com.ritense.zakenapi.service.ZaakDocumentService
import kotlinx.coroutines.runBlocking
import org.camunda.bpm.engine.delegate.VariableScope
import java.util.UUID
import java.util.function.Function

class OpenKlantValueResolverFactory(
    private val processDocumentService: ProcessDocumentService,
    private val zaakDocumentService: ZaakDocumentService,
    private val openKlantService: OpenKlantService,
    private val reflectionUtil: ReflectionUtil,
    private val properties: OpenKlantProperties,
) : ValueResolverFactory {
    override fun supportedPrefix(): String = "klant"

    override fun createResolver(documentId: String): Function<String, Any?> {
        val zaakUuid = zaakDocumentService.getZaakByDocumentIdOrThrow(UUID.fromString(documentId)).uuid

        return Function { requestedValue ->
            when (requestedValue) {
                "klantcontacten" -> runBlocking { getKlantcontacten(zaakUuid) }
                "klantcontactenOrNull" -> runBlocking { getKlantcontactenOrNull(zaakUuid) }

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

    private suspend fun getKlantcontacten(zaakUuid: UUID) = getKlantcontactenOrNull(zaakUuid) ?: emptyList<Any>()

    private suspend fun getKlantcontactenOrNull(zaakUuid: UUID) =
        runCatching { openKlantService.getAllKlantcontacten(createKlantcontactOptions(zaakUuid)) }
            .getOrNull()
            ?.let { reflectionUtil.deepReflectedMapOf(it) }

    private fun createKlantcontactOptions(zaakUuid: UUID): KlantcontactOptions =
        KlantcontactOptions(
            klantinteractiesUrl = properties.klantinteractiesUrl,
            token = properties.token,
            objectTypeId = OBJECT_TYPE_ID,
            objectUuid = zaakUuid.toString(),
        )

    companion object {
        private const val OBJECT_TYPE_ID = "zaak"
    }
}