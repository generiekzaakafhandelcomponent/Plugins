package com.ritense.valtimoplugins.xential.service

import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimoplugins.xential.domain.XentialDocumentProperties
import com.ritense.zakenapi.service.ZaakDocumentService
import org.camunda.bpm.engine.delegate.DelegateExecution
import com.ritense.documentenapi.web.rest.dto.DocumentSearchRequest
import com.ritense.valtimoplugins.xential.domain.FileFormat
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin.Companion
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import java.util.UUID

@Suppress("UNUSED")
class XentialDocumentHelper(
    private val zaakDocumentService: ZaakDocumentService,
) {
    fun nextDocument(
        execution: DelegateExecution,
        documentPropertiesMap: MutableMap<String, Any>,
    ) {

        val documentProperties: XentialDocumentProperties = objectMapper.convertValue(documentPropertiesMap)
        val docs = zaakDocumentService.getInformatieObjectenAsRelatedFilesPage(
            UUID.fromString(execution.processBusinessKey),
            DocumentSearchRequest(),
            PageRequest.of(0, 1000)
        )
        val over = docs.filter {
            it.informatieobjecttype == documentProperties.informationObjectType
        }.toList()
        val extention = if (documentProperties.fileFormat.equals(FileFormat.WORD)) {
            "docx"
        } else {
            "pdf"
        }
        documentPropertiesMap["documentFilename"] = "${documentProperties.documentFilename}-${over.size + 1}.$extention"
    }

    companion object {
        private val objectMapper = jacksonObjectMapper()
        private val logger = KotlinLogging.logger {}
    }
}
