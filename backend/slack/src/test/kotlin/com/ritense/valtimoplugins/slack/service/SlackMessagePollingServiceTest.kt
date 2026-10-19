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

package com.ritense.valtimoplugins.slack.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.domain.PluginProcessLink
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.repository.ValtimoPluginProcessLinkRepository
import com.ritense.valtimoplugins.slack.BaseTest
import com.ritense.valtimoplugins.slack.client.SlackClient
import com.ritense.valtimoplugins.slack.domain.SlackChannelCursor
import com.ritense.valtimoplugins.slack.domain.SlackMessage
import com.ritense.valtimoplugins.slack.plugin.SlackPlugin
import com.ritense.valtimoplugins.slack.repository.ProcessedSlackMessageRepository
import com.ritense.valtimoplugins.slack.repository.SlackChannelCursorRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argThat
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.math.BigDecimal
import java.net.URI
import java.time.Instant
import java.util.Optional
import java.util.UUID

/**
 * Covers the part of the poller that has no counterpart in the mail plugin: the channel
 * cursor. A channel already contains everything ever said in it, so where a mailbox can be
 * read from the start, a channel must not be.
 */
class SlackMessagePollingServiceTest : BaseTest() {
    private val objectMapper = ObjectMapper()
    private val configurationId = PluginConfigurationId.existingId(UUID.randomUUID())

    private lateinit var pluginService: PluginService
    private lateinit var slackClient: SlackClient
    private lateinit var handler: IncomingSlackMessageHandler
    private lateinit var starter: SlackMessageProcessStarter
    private lateinit var cursorRepository: SlackChannelCursorRepository
    private lateinit var pollingService: SlackMessagePollingService

    @BeforeEach
    fun setUp() {
        pluginService = mock()
        slackClient = mock()
        handler = mock()
        starter = mock()
        cursorRepository = mock()

        whenever(pluginService.createInstance<SlackPlugin>(any<UUID>())).doReturn(plugin())
        whenever(slackClient.conversationsHistory(any(), any(), any())).thenReturn(SlackClient.PagedMessages())
        whenever(cursorRepository.save(any())).thenAnswer { it.arguments[0] }
        whenever(starter.threadsAwaitingReply(any())).thenReturn(emptyMap())
        whenever(handler.handle(any(), any(), any())).thenReturn(true)

        pollingService =
            SlackMessagePollingService(
                mock<ValtimoPluginProcessLinkRepository>(),
                pluginService,
                slackClient,
                handler,
                starter,
                mock<ProcessedSlackMessageRepository>(),
                cursorRepository,
                objectMapper,
                90L,
            )
    }

    @Test
    fun `should start reading a new channel at the configured lookback, not at its beginning`() {
        noCursorYet()
        val before = Instant.now()

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        val created = argumentCaptor<SlackChannelCursor>()
        verify(cursorRepository).save(created.capture())
        assertThat(created.firstValue.channel).isEqualTo(CHANNEL)

        // 15 minutes is the default lookback; anything posted before it is never fetched, so
        // adding an existing channel cannot turn years of chatter into cases.
        val startedAt = BigDecimal(created.firstValue.lastMessageTs)
        assertThat(startedAt).isLessThan(BigDecimal(SlackMessage.timestampOf(before.minusSeconds(14 * 60))))
        assertThat(startedAt).isGreaterThan(BigDecimal(SlackMessage.timestampOf(before.minusSeconds(16 * 60))))
    }

    @Test
    fun `should ask Slack only for what the cursor has not covered`() {
        existingCursor("1735689500.000000")

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        verify(slackClient).conversationsHistory(any(), eq(CHANNEL), eq("1735689500.000000"))
    }

    @Test
    fun `should move the cursor to the newest message it handled`() {
        val cursor = existingCursor("1735689500.000000")
        historyOf("1735689600.000100", "1735689700.000200")

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        assertThat(cursor.lastMessageTs).isEqualTo("1735689700.000200")
    }

    @Test
    fun `should hold the cursor at the last message before a failure`() {
        // The failed message is offered again on the next poll. Moving past it would drop it
        // silently, which for an incoming request means a case that never gets created.
        val cursor = existingCursor("1735689500.000000")
        historyOf("1735689600.000100", "1735689700.000200", "1735689800.000300")
        whenever(handler.handle(argThatHasTs("1735689700.000200"), any(), any()))
            .thenThrow(IllegalStateException("boom"))

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        assertThat(cursor.lastMessageTs).isEqualTo("1735689600.000100")
    }

    @Test
    fun `should keep handling the messages behind one that fails`() {
        // The cursor stops, but the round does not: a message the engine chokes on must not
        // hold up the ones behind it for as long as it keeps failing. They keep their claim,
        // so being offered again next poll costs a lookup and nothing more.
        val cursor = existingCursor("1735689500.000000")
        historyOf("1735689600.000100", "1735689700.000200", "1735689800.000300")
        whenever(handler.handle(argThatHasTs("1735689700.000200"), any(), any()))
            .thenThrow(IllegalStateException("boom"))

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        verify(handler).handle(argThatHasTs("1735689800.000300"), any(), any())
        assertThat(cursor.lastMessageTs).isEqualTo("1735689600.000100")
    }

    @Test
    fun `should not let a thread reply carry the cursor past an unread channel message`() {
        // The two reads are separate calls. A message posted to the channel between them can
        // be older than a reply the second call returns, so advancing the cursor to the newest
        // of both would put it past a message that was never read - and the next poll would
        // not ask for it again.
        val cursor = existingCursor("1735689500.000000")
        historyOf("1735689600.000100")
        whenever(starter.threadsAwaitingReply(any())).thenReturn(mapOf("1735689600.000100" to null))
        whenever(slackClient.conversationsReplies(any(), any(), any(), anyOrNull()))
            .thenReturn(SlackClient.PagedMessages(listOf(message("1735699999.000900"))))

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        assertThat(cursor.lastMessageTs).isEqualTo("1735689600.000100")
    }

    @Test
    fun `should never move the cursor backwards`() {
        // Thread replies and channel history are read separately, and an out-of-order value
        // rewinding the channel would replay everything after it.
        val cursor = existingCursor("1735689700.000200")

        assertThat(cursor.advanceTo("1735689600.000100")).isFalse()
        assertThat(cursor.lastMessageTs).isEqualTo("1735689700.000200")
    }

    @Test
    fun `should read a thread from where the case waiting in it got to`() {
        // Not from the channel's read position: a case that parks late - an asynchronous
        // continuation is enough - would otherwise have its answer skipped, because the
        // channel cursor has moved on past it in the meantime.
        existingCursor("1735689500.000000")
        whenever(starter.threadsAwaitingReply(any())).thenReturn(mapOf("1735689600.000100" to "1735689650.000150"))
        whenever(slackClient.conversationsReplies(any(), any(), any(), anyOrNull()))
            .thenReturn(SlackClient.PagedMessages(listOf(message("1735690000.000600"))))

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        verify(slackClient)
            .conversationsReplies(any(), eq(CHANNEL), eq("1735689600.000100"), eq("1735689650.000150"))
        verify(handler).handle(argThatHasTs("1735690000.000600"), any(), any())
    }

    @Test
    fun `should read a thread from its start when the case has no recorded position`() {
        existingCursor("1735689500.000000")
        whenever(starter.threadsAwaitingReply(any())).thenReturn(mapOf("1735689600.000100" to null))
        whenever(slackClient.conversationsReplies(any(), any(), any(), anyOrNull()))
            .thenReturn(SlackClient.PagedMessages())

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        verify(slackClient).conversationsReplies(any(), eq(CHANNEL), eq("1735689600.000100"), eq(null))
    }

    @Test
    fun `should read a thread once, from the position of whichever case is furthest behind`() {
        // Two links, both waiting in the same thread, one of them further behind. Reading from
        // the later position would cost the other one its answer.
        existingCursor("1735689500.000000")
        val linkA = processLink()
        val linkB = processLink()
        whenever(starter.threadsAwaitingReply(eq(linkA)))
            .thenReturn(mapOf("1735689600.000100" to "1735689900.000500"))
        whenever(starter.threadsAwaitingReply(eq(linkB)))
            .thenReturn(mapOf("1735689600.000100" to "1735689650.000150"))
        whenever(slackClient.conversationsReplies(any(), any(), any(), anyOrNull()))
            .thenReturn(SlackClient.PagedMessages())

        pollingService.pollConfiguration(configurationId, listOf(linkA, linkB))

        verify(slackClient, times(1))
            .conversationsReplies(any(), eq(CHANNEL), eq("1735689600.000100"), eq("1735689650.000150"))
    }

    @Test
    fun `should serve the threads furthest behind first when there are more than the budget`() {
        // Otherwise the same threads are dropped every poll, and the cases waiting in them
        // never continue - quietly, and for good.
        existingCursor("1735689500.000000")
        whenever(pluginService.createInstance<SlackPlugin>(any<UUID>()))
            .doReturn(plugin().also { it.maxThreadsPerPoll = 2 })
        whenever(starter.threadsAwaitingReply(any())).thenReturn(
            mapOf(
                "thread-newest" to "1735689900.000500",
                "thread-oldest" to "1735689600.000100",
                "thread-middle" to "1735689700.000200",
            ),
        )
        whenever(slackClient.conversationsReplies(any(), any(), any(), anyOrNull()))
            .thenReturn(SlackClient.PagedMessages())

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        verify(slackClient).conversationsReplies(any(), any(), eq("thread-oldest"), anyOrNull())
        verify(slackClient).conversationsReplies(any(), any(), eq("thread-middle"), anyOrNull())
        verify(slackClient, never()).conversationsReplies(any(), any(), eq("thread-newest"), anyOrNull())
    }

    @Test
    fun `should keep reading the channel when one thread cannot be read`() {
        // A thread whose parent was deleted answers with an error forever.
        existingCursor("1735689500.000000")
        whenever(starter.threadsAwaitingReply(any())).thenReturn(mapOf("1735689600.000100" to "1735689650.000150"))
        whenever(slackClient.conversationsReplies(any(), any(), any(), anyOrNull()))
            .thenThrow(IllegalStateException("thread_not_found"))
        historyOf("1735689900.000500")

        pollingService.pollConfiguration(configurationId, listOf(processLink()))

        verify(handler).handle(argThatHasTs("1735689900.000500"), any(), any())
    }

    @Test
    fun `should skip a link that names no channel`() {
        noCursorYet()

        pollingService.pollConfiguration(configurationId, listOf(processLink(actionProperties = "{}")))

        verify(slackClient, never()).conversationsHistory(any(), any(), any())
    }

    private fun noCursorYet() {
        whenever(cursorRepository.findById(any())).thenReturn(Optional.empty())
    }

    private fun existingCursor(lastMessageTs: String): SlackChannelCursor {
        val cursor =
            SlackChannelCursor(
                cursorId = SlackChannelCursor.idOf(configurationId.id.toString(), CHANNEL),
                pluginConfigurationId = configurationId.id.toString(),
                channel = CHANNEL,
                lastMessageTs = lastMessageTs,
            )
        whenever(cursorRepository.findById(any())).thenReturn(Optional.of(cursor))
        return cursor
    }

    private fun historyOf(vararg timestamps: String) {
        whenever(slackClient.conversationsHistory(any(), any(), any()))
            .thenReturn(SlackClient.PagedMessages(timestamps.map { message(it) }))
    }

    private fun message(ts: String) = SlackMessage(channel = CHANNEL, ts = ts, text = "Hallo", userId = "U012AB3CD")

    private fun argThatHasTs(ts: String): SlackMessage = argThat { this.ts == ts }

    private fun processLink(actionProperties: String = """{"channel": "$CHANNEL"}"""): PluginProcessLink =
        mock<PluginProcessLink>().also {
            whenever(it.actionProperties).thenReturn(objectMapper.readTree(actionProperties) as ObjectNode)
            whenever(it.activityId).thenReturn("start-event")
            whenever(it.processDefinitionId).thenReturn("slack-intake-process:1:abc")
        }

    private fun plugin(): SlackPlugin =
        SlackPlugin(slackClient, mock()).also {
            it.url = URI.create("https://slack.example.com/")
            it.token = "test-token"
        }

    private companion object {
        private const val CHANNEL = "C012AB3CD"
    }
}
