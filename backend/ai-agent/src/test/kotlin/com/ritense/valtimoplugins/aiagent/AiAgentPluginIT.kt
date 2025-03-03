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

package com.ritense.valtimoplugins.aiagent

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
class AiAgentPluginIT : BaseIntegrationTest() {

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
    fun `should give prompt`() {
        createProcessLink(
            "give-prompt", """
            {
                "prompt": "Do my prompt"
            }"""
        )

        // when
        createDocumentAndStartProcess()

        // then
        val requestBody = getRequest(HttpMethod.POST, "/api/ai/prompt").body.readUtf8()
        assertThat(requestBody).contains("This is my answer to your prompt")
    }

    fun startMockServer() {
        executedRequests = mutableListOf()
        val dispatcher: Dispatcher = object : Dispatcher() {
            @Throws(InterruptedException::class)
            override fun dispatch(request: RecordedRequest): MockResponse {
                executedRequests.add(request)
                val response = when (request.method + " " + request.path?.substringBefore('?')) {
                    "POST /api/ai/prompt" -> mockResponseFromFile("/data/chat-post-message-response.json")
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
            "Ai agent plugin configuration",
            MapperSingleton.get().readTree(configurationProperties) as ObjectNode,
            "ai-agent"
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
