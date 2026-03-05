package com.ritense.valtimoplugins.printstraat.service

import com.ritense.documentenapi.service.DocumentenApiService
import com.ritense.valtimoplugins.printstraat.client.PrintstraatClient
import com.ritense.valtimoplugins.printstraat.dto.PrintstraatBodyDto
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.BpmnError
import org.springframework.web.client.RestClientResponseException
import java.io.InputStream
import java.net.URI
import java.util.Base64

class PrintstraatService(
    private val printstraatClient: PrintstraatClient,
    private val documentenApiService: DocumentenApiService,
) {

    fun sendFileToPrintstraat(
        documentenApiPluginConfigurationId: String,
        zaaknummer: String?,
        documentUrl: URI
    ) {
        try {

            val documentId = documentUrl.path.substringAfterLast("/")

            val informatieObject = documentenApiService.getInformatieObject(
                pluginConfigurationId = documentenApiPluginConfigurationId,
                documentId = documentId
            )

            val stream = documentenApiService.downloadInformatieObject(
                pluginConfigurationId = documentenApiPluginConfigurationId,
                documentId = documentId
            )

            val fileName = sanitizeFilename(informatieObject.bestandsnaam) ?: "document-$documentId"

            printstraatClient.postDocumentToPrintstraat(
                PrintstraatBodyDto(
                    zaaknummer = zaaknummer,
                    file = inputStreamToBase64(stream),
                    fileName = fileName
                )
            )
            logger.info { "Printstraat | upload ok | zaak='$zaaknummer' id='${documentId}' file='${informatieObject.bestandsnaam}" }
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

    private fun throwBpmnError(message: String) {
        throw BpmnError("PRINTSTRAAT_ERROR", message)
    }

    private fun sanitizeFilename(name: String?): String? =
        name?.trim()
            ?.substringAfterLast('/')
            ?.substringAfterLast('\\')
            ?.replace(Regex("[^\\p{L}\\p{N} ._()-]"), "_")
            ?.takeIf { it.isNotBlank() }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
