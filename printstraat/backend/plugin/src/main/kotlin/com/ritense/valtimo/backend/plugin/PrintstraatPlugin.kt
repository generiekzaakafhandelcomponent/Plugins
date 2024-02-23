/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.valtimo.backend.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.ActivityType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.implementation.commutr.printstraat.dto.PrintstraatBodyDto
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.http.HttpStatus
import org.springframework.web.client.HttpServerErrorException
import org.springframework.web.reactive.function.client.WebClient
import java.net.URI
import java.util.Base64

@Plugin(
    key = "printstraat",
    title = "Printstraat Plugin",
    description = "Send a file to the printstraat in Utrecht with the Printstraat plugin"
)
class PrintstraatPlugin(
    val temporaryResourceStorageService: TemporaryResourceStorageService
) {
    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "token", secret = true)
    lateinit var token: String


    @PluginAction(
        key = "send-document-to-printstraat",
        title = "Send document to Printstraat",
        description = "Sends an document to the printstraat",
        activityTypes = [ActivityType.SERVICE_TASK_START]
    )
    fun sendDocumentToPrintstraat(
        execution: DelegateExecution,
        @PluginActionProperty zaaknummerVariable: String?,
        @PluginActionProperty tempFileIdVariable: String?
    ) {
        val tempFileId = execution.getVariable(tempFileIdVariable) as String? ?: execution.getVariable(
            PRINTSTRAAT_TEMPORARY_FILE_ID
        ) as String
        val fileImageInputStream = temporaryResourceStorageService.getResourceContentAsInputStream(tempFileId)
        val fileInByteArray = fileImageInputStream.readAllBytes()

        val fileMetadata = temporaryResourceStorageService.getResourceMetadata(tempFileId)

        val printstraatBodyDto = PrintstraatBodyDto(
            zaaknummer = execution.getVariable(zaaknummerVariable) as String? ?: execution.getVariable(
                PRINTSTRAAT_ZAAKNUMMER
            ) as String,
            fileName = fileMetadata["filename"] as String,
            file = documentToBase64(fileInByteArray)
        )

        sendDocument(printstraatBodyDto)
    }

    private fun sendDocument(printstraatBodyDto: PrintstraatBodyDto) {
        try {
            WebClient.builder()
                .baseUrl(url.toString())
                .defaultHeader(API_KEY_HEADER_NAME, token)
                .build()
                .post()
                .bodyValue(printstraatBodyDto)
                .retrieve()
                .toBodilessEntity()
                .block()
        } catch (e: Exception) {
            throw HttpServerErrorException(
                HttpStatus.BAD_REQUEST,
                "Request to Printstraat has failed. Error message '$e'"
            )
        }
    }

    private fun documentToBase64(file: ByteArray): String {
        fun ByteArray.toBase64(): String =
            String(Base64.getEncoder().encode(this))
        return file.toBase64()
    }

    companion object {
        private const val API_KEY_HEADER_NAME = "X-OPENTUNNEL-API-KEY"
        const val PRINTSTRAAT_ZAAKNUMMER = "printstraatZaaknummer"
        const val PRINTSTRAAT_TEMPORARY_FILE_ID = "printstraatTemporaryFileId"
    }
}