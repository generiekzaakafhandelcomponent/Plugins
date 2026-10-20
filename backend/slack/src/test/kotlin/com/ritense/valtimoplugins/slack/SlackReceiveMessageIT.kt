/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.slack

import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.impl.request.NewDocumentRequest
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.service.PluginService
import com.ritense.plugin.web.rest.request.PluginProcessLinkCreateDto
import com.ritense.processdocument.domain.impl.request.NewDocumentAndStartProcessRequest
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.domain.ActivityTypeWithEventName.INTERMEDIATE_CATCH_EVENT_END
import com.ritense.processlink.domain.ActivityTypeWithEventName.MESSAGE_START_EVENT_START
import com.ritense.processlink.repository.ValtimoPluginProcessLinkRepository
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimoplugins.slack.domain.SlackMessage
import com.ritense.valtimoplugins.slack.service.SlackMessagePollingService
import okhttp3.mockwebserver.Dispatcher
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import okhttp3.mockwebserver.RecordedRequest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.camunda.bpm.engine.RepositoryService
import org.camunda.bpm.engine.RuntimeService
import org.springframework.beans.factory.annotation.Autowired

/**
 * Proves the inbound half end to end, against a real process engine: a Slack message creates
 * a case, and a reply in that case's thread continues it.
 *
 * Deliberately not transactional. The handler starts each message in its own
 * `REQUIRES_NEW` transaction — the claim that makes two nodes safe has to be committed to
 * mean anything — so a test-managed rollback would not undo the cases anyway, and holding a
 * transaction open around the poll only hides the real behaviour.
 */
class SlackReceiveMessageIT : BaseIntegrationTest() {
    @Autowired
    lateinit var pluginService: PluginService

    @Autowired
    lateinit var processDocumentService: ProcessDocumentService

    @Autowired
    lateinit var repositoryService: RepositoryService

    @Autowired
    lateinit var runtimeService: RuntimeService

    @Autowired
    lateinit var pluginProcessLinkRepository: ValtimoPluginProcessLinkRepository

    @Autowired
    lateinit var pollingService: SlackMessagePollingService

    private lateinit var server: MockWebServer
    private lateinit var configuration: PluginConfiguration
    private var historyBody: String = emptyHistory()
    private var repliesBody: String = emptyHistory()

    @BeforeEach
    fun setUp() {
        startMockServer()
        configuration = createSlackPluginConfiguration()
    }

    /**
     * Nothing here rolls back — the handler commits each message in its own transaction — so
     * every test cleans up after itself. A process link left behind makes the next test fail
     * to create its own, and a case left behind is counted by the next test's assertions.
     */
    @AfterEach
    fun tearDown() {
        server.shutdown()
        runWithoutAuthorization {
            pluginProcessLinkRepository
                .findByPluginActionDefinitionKey(SlackMessagePollingService.RECEIVE_MESSAGE_ACTION)
                .forEach { pluginService.deleteProcessLink(it.id) }
            pluginService.deletePluginConfiguration(configuration.id)

            listOf("SlackMessageStartProcess", "SlackReplyProcess")
                .flatMap { instancesOf(it) }
                .forEach { runtimeService.deleteProcessInstance(it, "test cleanup") }
        }
    }

    @Test
    fun `should create a case for a message posted in the channel`() {
        createProcessLink(
            processDefinitionKey = "SlackMessageStartProcess",
            activityId = "SlackMessageStart",
            activityType = MESSAGE_START_EVENT_START,
            actionProperties = """{"channel": "$CHANNEL"}""",
        )
        historyBody = historyWith(ts = MESSAGE_TS, text = "Ik wil bezwaar maken")

        poll()

        val started = instancesOf("SlackMessageStartProcess")
        assertThat(started).hasSize(1)
        // The case has to know which conversation it came out of, or it can never answer it.
        assertThat(variableOf(started.single(), SlackMessage.THREAD_TS_VARIABLE)).isEqualTo(MESSAGE_TS)
        assertThat(variableOf(started.single(), SlackMessage.CHANNEL_VARIABLE)).isEqualTo(CHANNEL)
        assertThat(variableOf(started.single(), "slackMessageText")).isEqualTo("Ik wil bezwaar maken")
    }

    @Test
    fun `should create only one case when the same message is read twice`() {
        // Two nodes polling the same channel both fetch it, and a cursor re-read after a
        // rollback offers it again. Neither may produce a second case.
        createProcessLink(
            processDefinitionKey = "SlackMessageStartProcess",
            activityId = "SlackMessageStart",
            activityType = MESSAGE_START_EVENT_START,
            actionProperties = """{"channel": "$CHANNEL"}""",
        )
        historyBody = historyWith(ts = MESSAGE_TS, text = "Ik wil bezwaar maken")

        poll()
        poll()

        assertThat(instancesOf("SlackMessageStartProcess")).hasSize(1)
    }

    @Test
    fun `should not create a case for a message the plugin posted itself`() {
        createProcessLink(
            processDefinitionKey = "SlackMessageStartProcess",
            activityId = "SlackMessageStart",
            activityType = MESSAGE_START_EVENT_START,
            actionProperties = """{"channel": "$CHANNEL"}""",
        )
        historyBody =
            historyWith(
                ts = MESSAGE_TS,
                text = "Uw bericht is ontvangen",
                extraFields = """"subtype": "bot_message", "bot_id": "B012AB3CD",""",
            )

        poll()

        assertThat(instancesOf("SlackMessageStartProcess")).isEmpty()
    }

    @Test
    fun `should continue the case that is waiting for an answer in the thread`() {
        val waiting = startReplyProcessAwaiting(threadTs = MESSAGE_TS)
        val other = startReplyProcessAwaiting(threadTs = "1735680000.000000")

        createProcessLink(
            processDefinitionKey = "SlackReplyProcess",
            activityId = "AwaitSlackReply",
            activityType = INTERMEDIATE_CATCH_EVENT_END,
            actionProperties = """{"channel": "$CHANNEL"}""",
        )
        repliesBody = historyWith(ts = REPLY_TS, text = "Ja, ga verder", threadTs = MESSAGE_TS)

        poll()

        // The reply is only for the case whose thread it names. The other one waits at the
        // catch event, which is the whole point of correlating on the thread.
        assertThat(isWaitingAt(waiting, "AwaitSlackReply")).isFalse()
        assertThat(isWaitingAt(other, "AwaitSlackReply")).isTrue()

        // And it is asked about by thread id, rather than the whole channel being trawled.
        val repliesRequest = findRequest("/api/conversations.replies")
        assertThat(repliesRequest?.path).contains("ts=$MESSAGE_TS")
    }

    @Test
    fun `should not read a channel no process link names`() {
        // The links are what put a channel in scope, so a configuration nobody links to must
        // cost nothing at all.
        poll()

        assertThat(findRequest("/api/conversations.history")).isNull()
    }

    /**
     * Runs one poll of the configuration under test.
     *
     * `pollConfiguration` rather than the scheduled `pollChannels`, because that one holds a
     * ShedLock for a second afterwards and a test that polls twice in a row would have its
     * second call skipped.
     */
    private fun poll() {
        val links =
            pluginProcessLinkRepository
                .findByPluginActionDefinitionKey(SlackMessagePollingService.RECEIVE_MESSAGE_ACTION)
                .filter { it.pluginConfigurationId == configuration.id }
        if (links.isEmpty()) return
        runWithoutAuthorization { pollingService.pollConfiguration(configuration.id, links) }
    }

    private fun startReplyProcessAwaiting(threadTs: String): String {
        val request =
            NewDocumentAndStartProcessRequest(
                "SlackReplyProcess",
                NewDocumentRequest(
                    DOCUMENT_DEFINITION_KEY,
                    MapperSingleton.get().readTree("""{"lastname": "Doe"}"""),
                ),
            ).withProcessVars(
                mapOf(
                    SlackMessage.CHANNEL_VARIABLE to CHANNEL,
                    SlackMessage.THREAD_TS_VARIABLE to threadTs,
                ),
            )
        val result = runWithoutAuthorization { processDocumentService.newDocumentAndStartProcess(request) }
        assertThat(result.errors()).isEmpty()
        return result.resultingProcessInstanceId().orElseThrow().toString()
    }

    private fun instancesOf(processDefinitionKey: String): List<String> =
        runtimeService
            .createProcessInstanceQuery()
            .processDefinitionKey(processDefinitionKey)
            .list()
            .map { it.processInstanceId }

    private fun isWaitingAt(
        processInstanceId: String,
        activityId: String,
    ): Boolean =
        runtimeService
            .createExecutionQuery()
            .processInstanceId(processInstanceId)
            .activityId(activityId)
            .list()
            .isNotEmpty()

    private fun variableOf(
        processInstanceId: String,
        name: String,
    ): Any? =
        runtimeService
            .createVariableInstanceQuery()
            .processInstanceIdIn(processInstanceId)
            .variableName(name)
            .singleResult()
            ?.value

    private fun createSlackPluginConfiguration(): PluginConfiguration {
        val properties = """
            {
                "url": "${server.url("/")}",
                "token": "test-token",
                "initialLookbackMinutes": 60
            }"""

        return runWithoutAuthorization {
            pluginService.createPluginConfiguration(
                "Slack receive configuration",
                MapperSingleton.get().readTree(properties) as ObjectNode,
                "slack",
            )
        }
    }

    private fun createProcessLink(
        processDefinitionKey: String,
        activityId: String,
        activityType: com.ritense.processlink.domain.ActivityTypeWithEventName,
        actionProperties: String,
    ) {
        val processDefinition =
            repositoryService
                .createProcessDefinitionQuery()
                .processDefinitionKey(processDefinitionKey)
                .latestVersion()
                .singleResult()

        runWithoutAuthorization {
            pluginService.createProcessLink(
                PluginProcessLinkCreateDto(
                    processDefinition.id,
                    activityId,
                    configuration.id.id,
                    "receive-message",
                    MapperSingleton.get().readTree(actionProperties) as ObjectNode,
                    activityType,
                ),
            )
        }
    }

    private fun startMockServer() {
        val dispatcher =
            object : Dispatcher() {
                override fun dispatch(request: RecordedRequest): MockResponse {
                    val body =
                        when (request.path?.substringBefore('?')) {
                            "/api/conversations.history" -> historyBody
                            "/api/conversations.replies" -> repliesBody
                            else -> return MockResponse().setResponseCode(404)
                        }
                    return MockResponse()
                        .addHeader("Content-Type", "application/json; charset=utf-8")
                        .setResponseCode(200)
                        .setBody(body)
                }
            }
        server = MockWebServer()
        server.dispatcher = dispatcher
        server.start()
    }

    private fun findRequest(path: String): RecordedRequest? {
        val requests = mutableListOf<RecordedRequest>()
        while (true) {
            val request = server.takeRequest(1, java.util.concurrent.TimeUnit.MILLISECONDS) ?: break
            requests += request
        }
        return requests.firstOrNull { it.path?.substringBefore('?') == path }
    }

    private fun historyWith(
        ts: String,
        text: String,
        threadTs: String? = null,
        extraFields: String = "",
    ): String =
        """
        {
          "ok": true,
          "messages": [
            {
              "type": "message",
              $extraFields
              "user": "U012AB3CD",
              "text": "$text",
              "ts": "$ts"
              ${threadTs?.let { ""","thread_ts": "$it"""" } ?: ""}
            }
          ],
          "has_more": false,
          "response_metadata": {"next_cursor": ""}
        }
        """.trimIndent()

    private fun emptyHistory(): String =
        """{"ok": true, "messages": [], "has_more": false, "response_metadata": {"next_cursor": ""}}"""

    private companion object {
        private const val CHANNEL = "C012AB3CD"
        private const val MESSAGE_TS = "1735689600.000100"
        private const val REPLY_TS = "1735690000.000600"
        private const val DOCUMENT_DEFINITION_KEY = "profile"
    }
}
