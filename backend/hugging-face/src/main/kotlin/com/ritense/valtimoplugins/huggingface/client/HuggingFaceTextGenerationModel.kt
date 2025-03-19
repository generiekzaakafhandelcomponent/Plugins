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

package com.ritense.valtimoplugins.huggingface.client

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

@Component
@SkipComponentScan
class HuggingFaceTextGenerationModel(
    private val restClientBuilder: RestClient.Builder,
    var baseUri: URI? = null,
    var token: String? = null,
) {

    fun chat(question: String): String {
        val result = post(
            "google/gemma-2-2b-it/v1/chat/completions",
            GemmaRequest(
                model = "google/gemma-2-2b-it",
                messages = listOf(
                    GemmaMessage(
                        role = "user",
                        content = question
                    )
                )
            )
        )
        return result
    }

    private fun post(path: String, gemmaRequest: GemmaRequest): String {
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
            .body(ObjectMapper().writeValueAsString(gemmaRequest))
            .retrieve()
            .body<GemmaResponse>()!!

        if (response.choices.isEmpty()) {
            throw AiAgentException("Empty response")
        }
        return response.choices.first().message.content
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }

}
