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

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.web.client.RestClient
import java.net.URI

class ConfiguredModelTest {
    private val objectMapper = jacksonObjectMapper()
    private val clients = ChatCompletionsClients(RestClient.builder())
    private lateinit var server: MockWebServer

    @BeforeEach
    fun setUp() {
        server = MockWebServer().apply { start() }
    }

    @AfterEach
    fun tearDown() {
        server.shutdown()
    }

    @Test
    fun `should use the configured model for the chat and summary actions`() {
        repeat(2) { server.enqueue(completion()) }

        ValtimoLlmTextGenerationModel(clients).mistralChat(endpoint("llama3.2"), "Hi")
        ValtimoLlmSummaryModel(clients).giveSummary(endpoint("llama3.2"), "A long text")

        assertThat(models()).containsExactly("llama3.2", "llama3.2")
    }

    @Test
    fun `should use open-mistral-nemo-2407 when no model is configured`() {
        repeat(2) { server.enqueue(completion()) }

        ValtimoLlmTextGenerationModel(clients).mistralChat(endpoint(null), "Hi")
        ValtimoLlmSummaryModel(clients).giveSummary(endpoint(" "), "A long text")

        assertThat(models()).containsExactly("open-mistral-nemo-2407", "open-mistral-nemo-2407")
    }

    @Test
    fun `should send the token of the endpoint with every request`() {
        repeat(2) { server.enqueue(completion()) }

        ValtimoLlmTextGenerationModel(clients).mistralChat(endpoint(null, token = "first"), "Hi")
        ValtimoLlmTextGenerationModel(clients).mistralChat(endpoint(null, token = "second"), "Hi")

        assertThat(
            (1..2).map { server.takeRequest().getHeader("Authorization") },
        ).containsExactly("Bearer first", "Bearer second")
    }

    @Test
    fun `should reuse one client per url and token`() {
        val url = URI(server.url("/").toString())

        val first = clients.forEndpoint(url, "token")

        assertThat(clients.forEndpoint(url, "token")).isSameAs(first)
        assertThat(clients.forEndpoint(url, "other")).isNotSameAs(first)
        assertThat(clients.forEndpoint(URI("http://other/"), "token")).isNotSameAs(first)
    }

    @Test
    fun `should keep only the most recently used clients`() {
        val bounded = ChatCompletionsClients(RestClient.builder(), maxClients = 2)
        val first = bounded.forEndpoint(URI("http://one/"), "token")
        bounded.forEndpoint(URI("http://two/"), "token")
        bounded.forEndpoint(URI("http://three/"), "token")

        assertThat(bounded.forEndpoint(URI("http://one/"), "token")).isNotSameAs(first)
    }

    @Test
    fun `should not show the token of an endpoint`() {
        assertThat(endpoint("m", token = "secret").toString()).doesNotContain("secret")
    }

    private fun endpoint(
        model: String?,
        token: String = "token",
    ) = ModelEndpoint(URI(server.url("/").toString()), token, model)

    private fun models() =
        (1..server.requestCount).map {
            objectMapper.readTree(server.takeRequest().body.readUtf8())["model"].asText()
        }

    private fun completion() =
        MockResponse()
            .setResponseCode(200)
            .setHeader("Content-Type", "application/json")
            .setBody(
                """{"id":"1","model":"m","choices":[{"index":0,"message":{"role":"assistant","content":"ok"},"finish_reason":"stop"}]}""",
            )
}
