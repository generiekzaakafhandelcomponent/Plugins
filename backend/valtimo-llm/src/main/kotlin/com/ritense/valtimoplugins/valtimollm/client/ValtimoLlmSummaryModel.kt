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
 */

package com.ritense.valtimoplugins.valtimollm.client

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.valtimollm.client.mistral.MISTRAL_SYSTEM_MESSAGE
import com.ritense.valtimoplugins.valtimollm.client.mistral.MistralMessage
import com.ritense.valtimoplugins.valtimollm.client.mistral.MistralRequest
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

@Component
@SkipComponentScan
class ValtimoLlmSummaryModel(
    private val restClientBuilder: RestClient.Builder,
    var baseUri: URI? = null,
    var token: String? = null,
) {

    fun giveSummary(longText: String): String {
        val request = MistralRequest(
            model = "mistral-medium",
            messages = listOf(
                MistralMessage(role = "user", content = longText),
                MISTRAL_SYSTEM_MESSAGE
            ),
            max_tokens = 500,
            stream = false
        )

        val result = post("v1/chat/completions", request)
        return result.summaryText
    }

    private fun post(path: String, body: Any): SummaryResponse {
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
                it.contentType = MediaType.APPLICATION_JSON
                it.setBearerAuth(token!!)
            }
            .accept(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body<SummaryResponse>()!!


        return response
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
