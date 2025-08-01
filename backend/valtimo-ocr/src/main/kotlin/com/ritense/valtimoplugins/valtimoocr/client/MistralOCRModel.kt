/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
 *
 */

package com.ritense.valtimoplugins.valtimoocr.client

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.valtimoocr.client.mistral.*
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

@Component
@SkipComponentScan
class MistralOCRModel(
    private val restClientBuilder: RestClient.Builder,
    var baseUri: URI? = null,
    var token: String? = null,
) {
    fun mistralFiletoText(
        fileBase64: String,
        documentName: String?,
        pages: Number?,
        includeImageBase64: Boolean
    ): List<MistralOCRPage> {
        val pageArray: List<Int> = (0 until (pages ?: 1).toInt()).toList()

        val isPdf = fileBase64.startsWith("data:application/pdf;")
        val file: MistralFile = if (isPdf) {
            MistralDocument(
                document_url = fileBase64,
                document_name = documentName,
                type = "document_url"
            )
        } else {
            MistralImage(
                image_url = fileBase64,
                type = "image_url"
            )
        }

        val result = post(
            "v1/ocr",
            MistralFileRequest(
                model = "mistral-ocr-latest",
                document = file,
                pages = pageArray,
                include_image_base64 = includeImageBase64,
            )
        )

        return result
    }

    private fun post(path: String, mistralFileRequest: MistralFileRequest): List<MistralOCRPage> {
        try {
            val response = restClientBuilder
                .clone()
                .build()
                .post()
                .uri {
                    it.scheme(baseUri!!.scheme)
                        .host(baseUri!!.host)
                        .path(baseUri!!.path)
                        .path(path)
                        .port(baseUri!!.port)
                        .build()
                }
                .headers {
                    it.contentType = org.springframework.http.MediaType.APPLICATION_JSON
                    it.setBearerAuth(token!!)
                }
                .accept(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(ObjectMapper().writeValueAsString(mistralFileRequest))
                .retrieve()
                .body<MistralOCRResponse>()!!

            if (response.pages.isEmpty()) {
                throw AiAgentException("Empty response")
            }

            return response.pages

        } catch (ex: Exception) {
            ex.printStackTrace()
            throw AiAgentException("Fout tijdens OCR-verzoek: ${ex.message}")
        }
    }
}
