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

package com.ritense.valtimoplugins.huggingface

import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.impl.request.NewDocumentRequest
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.service.PluginService
import com.ritense.plugin.web.rest.request.PluginProcessLinkCreateDto
import com.ritense.processdocument.domain.impl.request.NewDocumentAndStartProcessRequest
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.valtimo.contract.json.MapperSingleton
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.assertj.core.api.Assertions.assertThat
import org.camunda.bpm.engine.RepositoryService
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpMethod
import org.springframework.transaction.annotation.Transactional
import kotlin.test.fail

@Transactional
class HuggingFacePluginIT : BaseIntegrationTest() {

    @Autowired
    lateinit var processDocumentService: ProcessDocumentService

    @Autowired
    lateinit var pluginService: PluginService

    @Autowired
    lateinit var repositoryService: RepositoryService

    lateinit var executedRequests: MutableList<RecordedRequest>
    lateinit var server: MockWebServer
    lateinit var configuration: PluginConfiguration

    @BeforeEach
    internal fun setUp() {
        startMockServer()
        configuration = createAiAgentPluginConfiguration()
    }

    @AfterEach
    internal fun tearDown() {
        server.shutdown()
    }

    @Test
    fun `should give summary`() {
        val longText =
            "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct."

        createProcessLink(
            "give-summary", """
            {
                "longText": "$longText"
            }"""
        )

        // when
        createDocumentAndStartProcess()

        // then
        val requestBody = getRequest(HttpMethod.POST, "/facebook/bart-large-cnn").body.readUtf8()
        assertThat(requestBody).contains("The tower is 324 metres")
    }

    fun startMockServer() {
        executedRequests = mutableListOf()
        val dispatcher: Dispatcher = object : Dispatcher() {
            @Throws(InterruptedException::class)
            override fun dispatch(request: RecordedRequest): MockResponse {
                executedRequests.add(request)
                val response = when (request.method + " " + request.path?.substringBefore('?')) {
                    "POST /facebook/bart-large-cnn" -> mockResponseFromFile("/data/summary-response.json")
                    else -> MockResponse().setResponseCode(404)
                }
                return response
            }
        }
        server = MockWebServer()
        server.dispatcher = dispatcher
        server.start()
    }

    fun findRequest(method: HttpMethod, path: String): RecordedRequest? {
        return executedRequests
            .filter { method.matches(it.method!!) }
            .firstOrNull { it.path?.substringBefore('?').equals(path) }
    }

    fun getRequest(method: HttpMethod, path: String): RecordedRequest {
        return findRequest(method, path) ?: fail("Request with method $method and path $path was not sent")
    }

    private fun createAiAgentPluginConfiguration(): PluginConfiguration {
        val configurationProperties = """
            {
                "url": "${server.url("/")}",
                "token": "test-token"
            }"""

        return pluginService.createPluginConfiguration(
            "hugging-face plugin configuration",
            MapperSingleton.get().readTree(configurationProperties) as ObjectNode,
            "hugging-face"
        )
    }

    private fun createProcessLink(actionDefinitionKey: String, actionProperties: String) {
        val processDefinition = repositoryService.createProcessDefinitionQuery()
            .processDefinitionKey(PROCESS_DEFINITION_KEY)
            .latestVersion()
            .singleResult()

        pluginService.createProcessLink(
            PluginProcessLinkCreateDto(
                processDefinition.id,
                "ServiceTask",
                configuration.id.id,
                actionDefinitionKey,
                MapperSingleton.get().readTree(actionProperties) as ObjectNode,
                SERVICE_TASK_START,
            )
        )
    }

    private fun createDocumentAndStartProcess(processVars: Map<String, Any> = emptyMap()) {
        val documentContent = """
            {
                "lastname": "Doe"
            }
        """
        val request = NewDocumentAndStartProcessRequest(
            PROCESS_DEFINITION_KEY,
            NewDocumentRequest(
                DOCUMENT_DEFINITION_KEY,
                MapperSingleton.get().readTree(documentContent)
            )
        )
        request.withProcessVars(processVars)
        val result = runWithoutAuthorization { processDocumentService.newDocumentAndStartProcess(request) }
        if (result.errors().isNotEmpty()) {
            fail(result.errors().first().asString())
        }
    }

    private fun mockResponseFromFile(fileName: String): MockResponse {
        return MockResponse()
            .addHeader("Content-Type", "application/json; charset=utf-8")
            .setResponseCode(200)
            .setBody(readFileAsString(fileName))
    }

    companion object {
        private const val PROCESS_DEFINITION_KEY = "ServiceTaskProcess"
        private const val DOCUMENT_DEFINITION_KEY = "profile"
    }

}
