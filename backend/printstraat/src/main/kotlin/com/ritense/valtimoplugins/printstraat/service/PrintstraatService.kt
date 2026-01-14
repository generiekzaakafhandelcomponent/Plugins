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

    fun getFilesAndSendToPrintstraat(execution: DelegateExecution) {
        try {
            val zaak = zaakDocumentService.getZaakByDocumentId(UUID.fromString(execution.businessKey))
            val documentenBijlagen = getDocumentenBijlageIdList(objectMapper, execution)

            documentenBijlagen.forEach { documentData ->
                val file = documentenApiService.downloadInformatieObject(
                    pluginConfigurationId = DOCUMENTEN_API_PLUGIN_CONFIGURATION_ID,
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

    private fun throwBpmnError() {
        throw BpmnError(
            "PrintstraatError",
            "File has not been sent to Printstraat"
        )
    }

    companion object {
        val logger = KotlinLogging.logger {}

        const val DOCUMENTEN_LIST = "documentenDataList"
        private const val DOCUMENTEN_API_PLUGIN_CONFIGURATION_ID = "ef0f96bc-dd85-4c69-a284-d4d44ed4b352"

        fun getDocumentenBijlageIdList(
            objectMapper: ObjectMapper,
            execution: DelegateExecution,
        ): List<DocumentenApiDto> {
            val documentenBijlageIdListString = execution.getVariable(DOCUMENTEN_LIST) as String
            return objectMapper.readValue(
                documentenBijlageIdListString,
                object : TypeReference<List<DocumentenApiDto>>() {})
        }

        fun setDocumentenBijlageIdList(
            objectMapper: ObjectMapper,
            execution: DelegateExecution,
            documentenBijlageIdList: List<DocumentenApiDto>,
        ) {
            execution.setVariable(DOCUMENTEN_LIST, objectMapper.writeValueAsString(documentenBijlageIdList))
        }
    }
}
