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
import com.ritense.plugin.domain.PluginProcessLink
import com.ritense.valtimoplugins.slack.BaseTest
import com.ritense.valtimoplugins.slack.domain.ProcessedSlackMessage
import com.ritense.valtimoplugins.slack.domain.SlackMessage
import com.ritense.valtimoplugins.slack.repository.ProcessedSlackMessageRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever

class IncomingSlackMessageHandlerTest : BaseTest() {
    private val objectMapper = ObjectMapper()

    private lateinit var processedSlackMessageRepository: ProcessedSlackMessageRepository
    private lateinit var starter: SlackMessageProcessStarter
    private lateinit var handler: IncomingSlackMessageHandler

    @BeforeEach
    fun setUp() {
        processedSlackMessageRepository = mock()
        starter = mock()

        whenever(processedSlackMessageRepository.existsById(any())).thenReturn(false)
        whenever(starter.start(any(), any())).thenReturn(true)

        handler = IncomingSlackMessageHandler(processedSlackMessageRepository, starter, objectMapper)
    }

    @Test
    fun `should claim and start for a new message`() {
        val link = processLink("""{"channel": "$CHANNEL"}""")

        val handled = handler.handle(message(), CONFIGURATION_ID, listOf(link))

        assertThat(handled).isTrue()
        verify(starter).start(eq(link), any())

        val claim = argumentCaptor<ProcessedSlackMessage>()
        verify(processedSlackMessageRepository).saveAndFlush(claim.capture())
        assertThat(claim.firstValue.messageIdentity).isEqualTo("$CONFIGURATION_ID|$CHANNEL/$TS")
        assertThat(claim.firstValue.channel).isEqualTo(CHANNEL)
        assertThat(claim.firstValue.messageTs).isEqualTo(TS)
    }

    @Test
    fun `should scope the claim to the plugin configuration`() {
        // Two configurations may watch the same channel for different processes, so the claim
        // key cannot be the message identity on its own.
        handler.handle(message(), "configuration-a", listOf(processLink("""{"channel": "$CHANNEL"}""")))
        handler.handle(message(), "configuration-b", listOf(processLink("""{"channel": "$CHANNEL"}""")))

        val claims = argumentCaptor<ProcessedSlackMessage>()
        verify(processedSlackMessageRepository, times(2)).saveAndFlush(claims.capture())
        assertThat(claims.allValues.map { it.messageIdentity })
            .containsExactly("configuration-a|$CHANNEL/$TS", "configuration-b|$CHANNEL/$TS")
    }

    @Test
    fun `should not start anything for a message it has already handled`() {
        whenever(processedSlackMessageRepository.existsById(any())).thenReturn(true)

        val handled = handler.handle(message(), CONFIGURATION_ID, listOf(processLink("""{"channel": "$CHANNEL"}""")))

        assertThat(handled).isFalse()
        verify(processedSlackMessageRepository, never()).saveAndFlush(any())
        verify(starter, never()).start(any(), any())
    }

    @Test
    fun `should ignore a message from another channel than the link names`() {
        val link = processLink("""{"channel": "C999OTHER"}""")

        val handled = handler.handle(message(), CONFIGURATION_ID, listOf(link))

        assertThat(handled).isFalse()
        verify(starter, never()).start(any(), any())
    }

    @Test
    fun `should ignore a link that names no channel`() {
        // Nothing can be read for it, so a message reaching it came from a channel its author
        // never named.
        val handled =
            handler.handle(message(), CONFIGURATION_ID, listOf(processLink("""{"messageContains": "hello"}""")))

        assertThat(handled).isFalse()
        verify(starter, never()).start(any(), any())
    }

    @Test
    fun `should apply the text and user filters together`() {
        val matching =
            processLink("""{"channel": "$CHANNEL", "messageContains": "bezwaar", "userId": "U012AB3CD"}""")
        val wrongUser = processLink("""{"channel": "$CHANNEL", "userId": "U999OTHER"}""")
        val wrongText = processLink("""{"channel": "$CHANNEL", "messageContains": "vakantie"}""")

        handler.handle(message(), CONFIGURATION_ID, listOf(matching, wrongUser, wrongText))

        verify(starter).start(eq(matching), any())
        verify(starter, never()).start(eq(wrongUser), any())
        verify(starter, never()).start(eq(wrongText), any())
    }

    @Test
    fun `should ignore a message from an app unless the link asks for them`() {
        // The plugin's own outgoing messages come back on the next poll. A link that accepts
        // them and a process that answers them form a loop.
        val ownMessage = message().copy(botId = "B012AB3CD", subtype = "bot_message")

        assertThat(handler.handle(ownMessage, CONFIGURATION_ID, listOf(processLink("""{"channel": "$CHANNEL"}"""))))
            .isFalse()

        val opensUp = processLink("""{"channel": "$CHANNEL", "includeBotMessages": true}""")
        assertThat(handler.handle(ownMessage, CONFIGURATION_ID, listOf(opensUp))).isTrue()
    }

    @Test
    fun `should separate the messages that open a conversation from the replies to them`() {
        val startsOnly = processLink("""{"channel": "$CHANNEL", "threadScope": "THREAD_STARTS_ONLY"}""")
        val repliesOnly = processLink("""{"channel": "$CHANNEL", "threadScope": "THREAD_REPLIES_ONLY"}""")

        handler.handle(message(), CONFIGURATION_ID, listOf(startsOnly, repliesOnly))
        verify(starter).start(eq(startsOnly), any())
        verify(starter, never()).start(eq(repliesOnly), any())

        val reply = message().copy(ts = "1735689900.000500", threadTs = TS)
        handler.handle(reply, CONFIGURATION_ID, listOf(startsOnly, repliesOnly))
        verify(starter).start(eq(repliesOnly), any())
    }

    @Test
    fun `should report a message handled when any of the matching links started something`() {
        val startEvent = processLink("""{"channel": "$CHANNEL"}""")
        val catchEvent = processLink("""{"channel": "$CHANNEL"}""")
        whenever(starter.start(eq(startEvent), any())).thenReturn(true)
        whenever(starter.start(eq(catchEvent), any())).thenReturn(false)

        assertThat(handler.handle(message(), CONFIGURATION_ID, listOf(startEvent, catchEvent))).isTrue()
    }

    @Test
    fun `should report a message not handled when every matching link had nothing to start`() {
        whenever(starter.start(any(), any())).thenReturn(false)

        assertThat(handler.handle(message(), CONFIGURATION_ID, listOf(processLink("""{"channel": "$CHANNEL"}"""))))
            .isFalse()
    }

    private fun message() =
        SlackMessage(
            channel = CHANNEL,
            ts = TS,
            text = "Ik wil bezwaar maken",
            userId = "U012AB3CD",
            userName = "jan",
        )

    private fun processLink(actionProperties: String): PluginProcessLink =
        mock<PluginProcessLink>().also {
            whenever(it.actionProperties).thenReturn(objectMapper.readTree(actionProperties) as ObjectNode)
            whenever(it.activityId).thenReturn("start-event")
            whenever(it.processDefinitionId).thenReturn("slack-intake-process:1:abc")
        }

    private companion object {
        private const val CHANNEL = "C012AB3CD"
        private const val TS = "1735689600.000100"
        private const val CONFIGURATION_ID = "3f6a0f4c-0b6a-4f8c-9b9b-1f2a3b4c5d6e"
    }
}
