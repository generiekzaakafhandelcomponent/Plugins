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

package com.ritense.valtimoplugins.valtimos2t.client

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.valtimos2t.client.mistral.TranscriptionResult
import com.ritense.valtimoplugins.valtimos2t.client.mistral.buildFormData
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.util.MultiValueMap
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

const val MODEL = "voxtral-mini-2507"
const val PATH = "v1/audio/transcriptions"

@Component
@SkipComponentScan
class MistralVoxtralClient(
    private val restClientBuilder: RestClient.Builder
) {
    fun transcribeSpeech(fileBase64: String, fileName: String, url: URI, token: String): TranscriptionResult {
        val formData = buildFormData(MODEL, fileBase64, fileName)
        return post(PATH, formData, url, token)
    }

    private fun post(path: String, formData: MultiValueMap<String, Any>, url: URI, token: String): TranscriptionResult {
        val base = requireNotNull(url) { "The API URL has not been set" }
        val requestUri = base.resolve(path)

        val client = restClientBuilder.clone().build()

        return client.post()
            .uri(requestUri)
            .headers {
                it.contentType = MediaType.MULTIPART_FORM_DATA
                it.setBearerAuth(requireNotNull(token) { "The API-key has not been set" })
            }
            .accept(MediaType.APPLICATION_JSON)
            .body(formData)
            .retrieve()
            .body<TranscriptionResult>()!!
    }
}
