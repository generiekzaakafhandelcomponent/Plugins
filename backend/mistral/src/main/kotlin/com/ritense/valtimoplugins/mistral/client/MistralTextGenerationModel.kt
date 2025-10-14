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

package com.ritense.valtimoplugins.mistral.client

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.mistral.client.mistral.MistralMessage
import com.ritense.valtimoplugins.mistral.client.mistral.MistralRequest
import com.ritense.valtimoplugins.mistral.client.mistral.MistralResponse
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

@Component
@SkipComponentScan
class MistralTextGenerationModel(
    private val restClientBuilder: RestClient.Builder,
    var baseUri: URI? = null,
    var token: String? = null,
) {

    fun mistralChat(question: String): String {
        val result = post(
            "v1/chat/completions",
            MistralRequest(
                model = "mistral-medium-2508",
                messages = listOf(
                    MistralMessage(
                        role = "user",
                        content = question
                    ),
                    MistralMessage(
                        role = "system",
                        content = """
                            You are a writing assistant that produces clear, well-formatted plain text.
                                - Write in complete sentences and organize ideas into readable paragraphs and when needed paragraph titles.
                                - Use blank lines between paragraphs for readability.
                                - Do NOT use any markup, such as HTML tags, Markdown, asterisks, or backticks.
                                - Do NOT include lists, bullet points, or numbered items unless the user explicitly requests them.
                                - Output must be plain text only, no formatting symbols or code fences.
                                - Keep the tone natural and professional.
                                - Replace **text_here** or *text_here* with HTML so it would become <b>text_here</b>.
                                - Do NOT use long dashes like — or ---.
                        """.trimIndent()
                    )
                )
            )
        )
        return result
    }

    private fun post(path: String, mistralRequest: MistralRequest): String {
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
            .body(ObjectMapper().writeValueAsString(mistralRequest))
            .retrieve()
            .body<MistralResponse>()!!

        if (response.choices.isEmpty()) {
            throw AiAgentException("Empty response")
        }
        return response.choices.first().message.content
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
