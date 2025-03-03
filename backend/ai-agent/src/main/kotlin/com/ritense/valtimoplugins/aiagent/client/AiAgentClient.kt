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

package com.ritense.valtimoplugins.aiagent.client

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.MediaType
import org.springframework.http.MediaType.MULTIPART_FORM_DATA
import org.springframework.stereotype.Component
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

@Component
@SkipComponentScan
class AiAgentClient(
    private val restClientBuilder: RestClient.Builder,
    var baseUri: URI? = null,
    var token: String? = null,
) {

    fun givePrompt(prompt: String) {
        logger.debug { "Give prompt ('$prompt')" }

        val multipartFormData = mutableMapOf(
            "prompt" to prompt
        )

        post("/api/ai/prompt", multipartFormData)
    }

    private fun post(path: String, multipartFormData: Map<String, Any>) {
        val body = LinkedMultiValueMap<String, Any>()
        multipartFormData.forEach { body.add(it.key, it.value) }

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
                it.contentType = MULTIPART_FORM_DATA
                it.setBearerAuth(token!!)
            }
            .accept(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body<AiAgentResponse>()

        if (response?.ok != true) {
            throw AiAgentException(response?.error)
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
