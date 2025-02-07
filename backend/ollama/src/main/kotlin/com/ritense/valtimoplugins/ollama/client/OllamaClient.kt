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

package com.ritense.valtimoplugins.ollama.client

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import io.github.oshai.kotlinlogging.KotlinLogging
import java.net.URI
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.body

@Component
@SkipComponentScan
class OllamaClient(
    private val restClientBuilder: RestClient.Builder,
) {

    fun sendPrompt(baseUrl: URI, languageModel: String, message: String): String {
        logger.debug { "Post message to ollama ('$message')" }

        val body = OllamaPromptBody(message, languageModel)

        val response = restClientBuilder
            .clone()
            .baseUrl(baseUrl.toString())
            .build()
            .post()
            .uri("/api/generate")
            .accept(APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body<OllamaResponse>()

        return response?.response
            ?: error("Could not generate Ollama prompt: $response")
    }

    class OllamaPromptBody(
        val prompt: String,
        val model: String,
        val stream: Boolean = false
    )

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
