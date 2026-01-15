package com.ritense.valtimoplugins.printstraat.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.documentenapi.service.DocumentenApiService
import com.ritense.valtimoplugins.printstraat.client.PrintstraatClient
import com.ritense.valtimoplugins.printstraat.dto.DocumentenApiDto
import com.ritense.valtimoplugins.printstraat.dto.PrintstraatBodyDto
import com.ritense.zakenapi.service.ZaakDocumentService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.BpmnError
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.io.InputStream
import java.util.Base64
import java.util.UUID

class PrintstraatService(
    private val printstraatClient: PrintstraatClient,
    private val zaakDocumentService: ZaakDocumentService,
    private val documentenApiService: DocumentenApiService,
    private val objectMapper: ObjectMapper,
) {

    fun getFilesAndSendToPrintstraat(
        execution: DelegateExecution,
        documentenApiPluginConfigurationId: String,
        documentenListVariableName: String
    ) {
        try {
            val zaak = zaakDocumentService.getZaakByDocumentId(UUID.fromString(execution.businessKey))
            val documentenBijlagen = getDocumentenBijlageIdList(execution, objectMapper, documentenListVariableName)

            documentenBijlagen.forEach { documentData ->
                val file = documentenApiService.downloadInformatieObject(
                    pluginConfigurationId = documentenApiPluginConfigurationId,
                    documentId = documentData.id.toString()
                )

                // Printstraat cannot handle multiple calls with the same file
                val uniqueFileName = UUID.randomUUID().toString() + " - " + documentData.name

                printstraatClient.postDocumentToPrintstraat(
                    PrintstraatBodyDto(
                        zaaknummer = zaak?.identificatie,
                        file = inputStreamToBase64(file),
                        fileName = uniqueFileName
                    )
                )
            }
        } catch (e: Exception) {
            logger.warn { "Printing of file has failed with error message: ${e.stackTraceToString()}" }
            throwBpmnError()
        }
    }

    private fun inputStreamToBase64(inputStream: InputStream): String {
        val bytes = inputStream.readBytes()
        return Base64.getEncoder().encodeToString(bytes)
    }

    private fun getDocumentenBijlageIdList(
        execution: DelegateExecution,
        objectMapper: ObjectMapper,
        documentenListVariableName: String
    ): List<DocumentenApiDto> {
        val documentenBijlageIdListString = execution.getVariable(documentenListVariableName) as String
        return objectMapper.readValue(
            documentenBijlageIdListString,
            object : TypeReference<List<DocumentenApiDto>>() {})
    }

    private fun throwBpmnError() {
        throw BpmnError(
            "PrintstraatError",
            "File has not been sent to Printstraat"
        )
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
