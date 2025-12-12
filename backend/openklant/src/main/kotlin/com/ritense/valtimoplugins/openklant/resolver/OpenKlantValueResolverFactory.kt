package com.ritense.valtimoplugins.openklant.resolver

import com.ritense.processdocument.domain.impl.OperatonProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimoplugins.openklant.model.KlantContactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.service.OpenKlantService
import com.ritense.valtimoplugins.openklant.util.ReflectionUtil
import com.ritense.valueresolver.ValueResolverFactory
import com.ritense.zakenapi.service.ZaakDocumentService
import kotlinx.coroutines.runBlocking
import org.operaton.bpm.engine.delegate.VariableScope
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
                "klantcontacten" -> runBlocking { getKlantContacten(zaakUuid) }
                "klantcontactenOrNull" -> runBlocking { getKlantContactenOrNull(zaakUuid) }

                else -> throw IllegalArgumentException("Unknown openklant column with name: $requestedValue")
            }
        }
    }

    override fun createResolver(
        processInstanceId: String,
        variableScope: VariableScope,
    ): Function<String, Any?> {
        val document = processDocumentService.getDocument(OperatonProcessInstanceId(processInstanceId), variableScope)
        return createResolver(document.id().toString())
    }

    override fun handleValues(
        processInstanceId: String,
        variableScope: VariableScope?,
        values: Map<String, Any?>,
    ) {
        TODO()
    }

    private suspend fun getKlantContacten(zaakUuid: UUID) = getKlantContactenOrNull(zaakUuid) ?: emptyList<Any>()

    private suspend fun getKlantContactenOrNull(zaakUuid: UUID) =
        runCatching { openKlantService.getAllKlantContacten(createKlantContactOptions(zaakUuid)) }
            .getOrNull()
            ?.let { reflectionUtil.deepReflectedMapOf(it) }

    private fun createKlantContactOptions(zaakUuid: UUID): KlantContactOptions =
        KlantContactOptions(
            klantinteractiesUrl = properties.klantinteractiesUrl,
            token = properties.token,
            objectTypeId = OBJECT_TYPE_ID,
            objectUuid = zaakUuid.toString(),
        )

    companion object {
        private const val OBJECT_TYPE_ID = "zaak"
    }
}