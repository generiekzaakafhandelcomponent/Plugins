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

package com.ritense.valtimoplugins.valtimollm.plugin

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.document.domain.impl.JsonSchemaDocument
import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.document.service.impl.JsonSchemaDocumentService
import com.ritense.valtimoplugins.valtimollm.client.ChatCompletionsClients
import com.ritense.valtimoplugins.valtimollm.client.ModelEndpoint
import com.ritense.valtimoplugins.valtimollm.client.ValtimoLlmSummaryModel
import com.ritense.valtimoplugins.valtimollm.client.ValtimoLlmTextGenerationModel
import com.ritense.valtimoplugins.valtimollm.client.valtimollm.StringWrapper
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.Answers.RETURNS_DEEP_STUBS
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.web.client.RestClient
import java.net.URI
import java.util.UUID
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class ValtimoLlmPluginModelTest {
    private val summaryModel = mock<ValtimoLlmSummaryModel>()
    private val textGenerationModel = mock<ValtimoLlmTextGenerationModel>()
    private val documentService = mock<JsonSchemaDocumentService>()
    private val plugin =
        ValtimoLlmPlugin(summaryModel, textGenerationModel, documentService).apply {
            url = URI("http://localhost/")
            token = "token"
            model = "llama3.2"
        }
    private val endpoint = ModelEndpoint(URI("http://localhost/"), "token", "llama3.2")

    @Test
    fun `should pass the configured endpoint to the give-summary action`() {
        whenever(summaryModel.giveSummary(any(), any())).thenReturn("summary")

        plugin.giveSummary(mock<DelegateExecution>(), "A long text", "result")

        verify(summaryModel).giveSummary(endpoint, "A long text")
    }

    @Test
    fun `should pass the configured endpoint to the chat actions`() {
        stubDocument()
        whenever(textGenerationModel.mistralChat(any(), any())).thenReturn("answer")

        plugin.chat(execution(), "question", "answer", "Hi")
        plugin.chatMemorize(execution(), "Hi", "answer", "question", null, null, null)

        verify(textGenerationModel, times(2)).mistralChat(eq(endpoint), any())
    }

    // The models are shared beans; actions of two configurations at the same time must each reach their own model.
    @Test
    fun `should not mix configurations when actions run at the same time`() {
        val servers = (1..2).map { MockWebServer().apply { dispatcher = AnswerWithToken() }.apply { start() } }
        try {
            val clients = ChatCompletionsClients(RestClient.builder())
            val sharedTextModel = ValtimoLlmTextGenerationModel(clients)
            val sharedSummaryModel = ValtimoLlmSummaryModel(clients)
            stubDocument()
            val plugins =
                servers.mapIndexed { index, server ->
                    ValtimoLlmPlugin(sharedSummaryModel, sharedTextModel, documentService).apply {
                        url = URI(server.url("/").toString())
                        token = "token-$index"
                        model = "model-$index"
                    }
                }
            val executions = plugins.map { mutableListOf<String>() }
            val start = CountDownLatch(1)
            val pool = Executors.newFixedThreadPool(8)
            repeat(40) { run ->
                val index = run % 2
                pool.execute {
                    start.await()
                    val answer = mutableMapOf<String, Any>()
                    val execution = execution(answer)
                    if (run % 4 < 2) {
                        plugins[index].chat(execution, "question", "answer", "Hi")
                    } else {
                        plugins[index].giveSummary(execution, "A long text", "answer")
                    }
                    synchronized(executions) { executions[index] += (answer["answer"] as StringWrapper).value }
                }
            }
            start.countDown()
            pool.shutdown()
            assertThat(pool.awaitTermination(30, TimeUnit.SECONDS)).isTrue()

            executions.forEachIndexed { index, answers ->
                assertThat(answers).hasSize(20).containsOnly("token-$index model-$index")
            }
            servers.forEach { assertThat(it.requestCount).isEqualTo(20) }
        } finally {
            servers.forEach { it.shutdown() }
        }
    }

    private fun stubDocument() {
        val document = mock<JsonSchemaDocument>(defaultAnswer = RETURNS_DEEP_STUBS)
        whenever(document.content().asJson()).thenReturn(jacksonObjectMapper().createObjectNode())
        whenever(documentService.getDocumentBy(any<JsonSchemaDocumentId>())).thenReturn(document)
    }

    private fun execution(variables: MutableMap<String, Any> = mutableMapOf()): DelegateExecution {
        val execution = mock<DelegateExecution>()
        whenever(execution.businessKey).thenReturn(UUID.randomUUID().toString())
        whenever(execution.setVariable(any(), any())).then {
            variables[it.getArgument(0)] = it.getArgument(1)
            null
        }
        return execution
    }

    // Answers with the token and model it was called with, so a mixed-up configuration shows in the answer.
    private class AnswerWithToken : Dispatcher() {
        private val objectMapper = jacksonObjectMapper()

        override fun dispatch(request: RecordedRequest): MockResponse {
            val token = request.getHeader("Authorization")!!.removePrefix("Bearer ")
            val model = objectMapper.readTree(request.body.readUtf8())["model"].asText()
            val answer = objectMapper.writeValueAsString("$token $model")
            return MockResponse()
                .setResponseCode(200)
                .setHeader("Content-Type", "application/json")
                .setBody(
                    """{"id":"1","model":"m","choices":[{"index":0,"message":{"role":"assistant","content":$answer},"finish_reason":"stop"}]}""",
                )
        }
    }
}
