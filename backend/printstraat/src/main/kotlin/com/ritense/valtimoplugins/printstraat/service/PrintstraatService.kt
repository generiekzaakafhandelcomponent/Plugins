package com.ritense.valtimoplugins.printstraat.service

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.documentenapi.service.DocumentenApiService
import com.ritense.valtimoplugins.printstraat.client.PrintstraatClient
import com.ritense.valtimoplugins.printstraat.dto.DocumentenApiDto
import com.ritense.valtimoplugins.printstraat.dto.PrintstraatBodyDto
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.BpmnError
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.web.client.RestClientResponseException
import java.io.InputStream
import java.util.Base64

class PrintstraatService(
    private val printstraatClient: PrintstraatClient,
    private val documentenApiService: DocumentenApiService,
    private val objectMapper: ObjectMapper,
) {

    fun sendFileToPrintstraat(
        execution: DelegateExecution,
        documentenApiPluginConfigurationId: String,
        zaaknummer: String?,
        documentMetadataVariableName: String
    ) {
        try {
            val metadata = readDocumentMetadataFromExecution(execution, objectMapper, documentMetadataVariableName)

            // Printstraat cannot handle multiple calls with the same file
            val uniqueFileName = "${metadata.id} - ${metadata.name}"

            val stream = documentenApiService.downloadInformatieObject(
                pluginConfigurationId = documentenApiPluginConfigurationId,
                documentId = metadata.id.toString()
            )
            printstraatClient.postDocumentToPrintstraat(
                PrintstraatBodyDto(
                    zaaknummer = zaaknummer,
                    file = inputStreamToBase64(stream),
                    fileName = uniqueFileName
                )
            )
            logger.info { "Printstraat | upload ok | zaak='$zaaknummer' id='${metadata.id}' file='$uniqueFileName'" }
        } catch (e: RestClientResponseException) {
            logger.error(e) { "Printstraat request failed (status=${e.statusCode}) body='${e.responseBodyAsString}'" }
            throwBpmnError("Request to Printstraat failed (status ${e.statusCode})")
        } catch (e: Exception) {
            logger.error(e) { "Sending file to Printstraat failed: ${e.message}" }
            throwBpmnError("Sending file to Printstraat failed: ${e.message}")
        }
    }

    private fun inputStreamToBase64(inputStream: InputStream): String {
        val bytes = inputStream.readBytes()
        return Base64.getEncoder().encodeToString(bytes)
    }

    private fun readDocumentMetadataFromExecution(
        execution: DelegateExecution,
        objectMapper: ObjectMapper,
        documentMetadataVariableName: String
    ): DocumentenApiDto {
        val documentMetadataString = execution.getVariable(documentMetadataVariableName) as String
        return objectMapper.readValue(
            documentMetadataString,
            object : TypeReference<DocumentenApiDto>() {})
    }

    private fun throwBpmnError(message: String) {
        throw BpmnError("PrintstraatError", message)
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
