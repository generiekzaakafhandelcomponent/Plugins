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

import org.springframework.http.MediaType
import org.springframework.web.client.RestClient
import java.net.URI

// One RestClient per model URL and token, built on first use instead of for every call.
class ChatCompletionsClients(
    private val restClientBuilder: RestClient.Builder,
    maxClients: Int = MAX_CLIENTS,
) {
    private val clients = BoundedCache<Key, ChatCompletionsClient>(maxClients)

    fun forEndpoint(
        url: URI,
        token: String,
    ): ChatCompletionsClient = clients.get(Key(url, token)) { build(url, token) }

    private fun build(
        url: URI,
        token: String,
    ): ChatCompletionsClient {
        val restClient =
            restClientBuilder
                .clone()
                .defaultHeaders { it.setBearerAuth(token) }
                .build()
        return ChatCompletionsClient(restClient, url)
    }

    private data class Key(
        val url: URI,
        val token: String,
    ) {
        override fun toString() = "Key(url=$url)"
    }

    companion object {
        private const val MAX_CLIENTS = 32
    }
}

// The chat completions endpoint of one model server, as one configuration reaches it.
class ChatCompletionsClient(
    private val restClient: RestClient,
    private val baseUri: URI,
) {
    fun <T : Any> complete(
        body: Any,
        responseType: Class<T>,
    ): T =
        restClient
            .post()
            .uri {
                it
                    .scheme(baseUri.scheme)
                    .host(baseUri.host)
                    .path(baseUri.path)
                    .path(PATH)
                    .port(baseUri.port)
                    .build()
            }.contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body(responseType)
            ?: throw AiAgentException("Empty response")

    companion object {
        // With the leading slash, a URL with a path but no trailing slash is called under that path.
        private const val PATH = "/v1/chat/completions"
    }
}
