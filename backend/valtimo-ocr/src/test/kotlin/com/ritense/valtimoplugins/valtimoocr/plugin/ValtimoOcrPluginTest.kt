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

package com.ritense.valtimoplugins.valtimoocr.plugin

import com.ritense.valtimoplugins.valtimoocr.client.MistralOCRModel
import com.ritense.valtimoplugins.valtimoocr.client.mistral.OCRResult
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.assertj.core.api.Assertions.assertThat
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.web.client.RestClient
import java.net.URI
import java.util.concurrent.CountDownLatch
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit

class ValtimoOcrPluginTest {

    // The model is a shared bean; actions of two configurations at the same time must each reach their own URL with their own token.
    @Test
    fun `should not mix configurations when actions run at the same time`() {
        val servers = (1..2).map { MockWebServer().apply { dispatcher = AnswerWithToken() }.apply { start() } }
        try {
            val sharedModel = MistralOCRModel(RestClient.builder())
            val plugins = servers.mapIndexed { index, server ->
                ValtimoOcrPlugin(sharedModel).apply {
                    url = URI(server.url("/").toString())
                    token = "token-$index"
                }
            }
            val results = plugins.map { mutableListOf<String?>() }
            val start = CountDownLatch(1)
            val pool = Executors.newFixedThreadPool(8)
            repeat(40) { run ->
                val index = run % 2
                pool.execute {
                    start.await()
                    val variables = mutableMapOf<String, Any>()
                    plugins[index].fileToText(execution(variables), "file", 1, false, "result")
                    synchronized(results) { results[index] += (variables["result"] as OCRResult).markdownCombined }
                }
            }
            start.countDown()
            pool.shutdown()
            assertThat(pool.awaitTermination(30, TimeUnit.SECONDS)).isTrue()

            results.forEachIndexed { index, markdown ->
                assertThat(markdown).hasSize(20).containsOnly("token-$index")
            }
            servers.forEach { assertThat(it.requestCount).isEqualTo(20) }
        } finally {
            servers.forEach { it.shutdown() }
        }
    }

    private fun execution(variables: MutableMap<String, Any>): DelegateExecution {
        val execution = mock<DelegateExecution>()
        whenever(execution.getVariable("file")).thenReturn(
            listOf("{name=scan-0b4a1c2e-6f3d-4e5a-9b8c-7d6e5f4a3b2c.pdf, url=data:application/pdf;base64,JVBERi0=, size=5}")
        )
        whenever(execution.setVariable(any(), any())).then {
            variables[it.getArgument(0)] = it.getArgument(1)
            null
        }
        return execution
    }

    // Answers with the token it was called with, so a mixed-up configuration shows in the result.
    private class AnswerWithToken : Dispatcher() {
        override fun dispatch(request: RecordedRequest): MockResponse {
            val token = request.getHeader("Authorization")!!.removePrefix("Bearer ")
            return MockResponse()
                .setResponseCode(200)
                .setHeader("Content-Type", "application/json")
                .setBody(
                    """{"pages":[{"index":0,"markdown":"$token","images":[],"dimensions":{"dpi":72,"height":1,"width":1}}],""" +
                        """"model":"mistral-ocr-latest","usage_info":{"pages_processed":1,"doc_size_bytes":5}}""",
                )
        }
    }
}
