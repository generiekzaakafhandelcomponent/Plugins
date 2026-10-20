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

package com.ritense.valtimoplugins.slack.client

import com.ritense.valtimoplugins.slack.BaseTest
import com.ritense.valtimoplugins.slack.domain.SlackConnectionProperties
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.web.client.RestClient
import java.time.Duration

class SlackClientTest : BaseTest() {
    private lateinit var server: MockWebServer
    private lateinit var client: SlackClient

    @BeforeEach
    fun setUp() {
        server = MockWebServer()
        server.start()
        client = SlackClient(RestClient.builder())
    }

    @AfterEach
    fun tearDown() {
        server.shutdown()
    }

    @Test
    fun `should read a channel oldest message first`() {
        enqueueFile("/data/conversations-history-response.json")

        val result = client.conversationsHistory(connection(), CHANNEL, null)

        // Slack answers newest first; a cursor may only advance over a stretch that was
        // handled in the order it was posted.
        assertThat(result.messages.map { it.ts })
            .containsExactly("1735689600.000100", "1735689650.000200", "1735689900.000500")
        assertThat(result.truncated).isFalse()
    }

    @Test
    fun `should drop the channel bookkeeping a real channel history is full of`() {
        enqueueFile("/data/conversations-history-response.json")

        val result = client.conversationsHistory(connection(), CHANNEL, null)

        // channel_join carries no meaning for a process, and message_changed is an edit of an
        // older message - resuming a case on one would let anybody re-trigger a process by
        // editing a message from last year.
        assertThat(result.messages.map { it.subtype }).doesNotContain("channel_join", "message_changed")
    }

    @Test
    fun `should carry over the fields a process needs`() {
        enqueueFile("/data/conversations-history-response.json")

        val message = client.conversationsHistory(connection(), CHANNEL, null).messages.first()

        assertThat(message.channel).isEqualTo(CHANNEL)
        assertThat(message.ts).isEqualTo("1735689600.000100")
        assertThat(message.text).isEqualTo("Ik wil bezwaar maken")
        assertThat(message.userId).isEqualTo("U012AB3CD")
        assertThat(message.fileNames).containsExactly("bezwaarschrift.pdf")
        assertThat(message.isFromBot).isFalse()
    }

    @Test
    fun `should recognise the plugin's own message as coming from an app`() {
        enqueueFile("/data/conversations-history-response.json")

        val botMessage =
            client
                .conversationsHistory(connection(), CHANNEL, null)
                .messages
                .single { it.ts == "1735689650.000200" }

        assertThat(botMessage.isFromBot).isTrue()
        assertThat(botMessage.botId).isEqualTo("B012AB3CD")
    }

    @Test
    fun `should ask Slack only for what it has not read yet`() {
        enqueueFile("/data/conversations-history-response.json")

        client.conversationsHistory(connection(), CHANNEL, "1735689500.000000")

        val request = server.takeRequest()
        assertThat(request.method).isEqualTo("GET")
        assertThat(request.path).startsWith("/api/conversations.history")
        assertThat(request.path).contains("channel=$CHANNEL")
        assertThat(request.path).contains("oldest=1735689500.000000")
        // Exclusive, so the newest handled message is not handed back on every poll.
        assertThat(request.path).contains("inclusive=false")
        assertThat(request.getHeader("Authorization")).isEqualTo("Bearer $TOKEN")
    }

    @Test
    fun `should leave the thread parent to the channel history`() {
        enqueueFile("/data/conversations-replies-response.json")

        val result = client.conversationsReplies(connection(), CHANNEL, "1735689600.000100", null)

        // The parent is part of Slack's answer, but it was already handled when it was
        // posted; handling it again here would start a second case for it.
        assertThat(result.messages.map { it.ts }).containsExactly("1735690000.000600")
        assertThat(result.messages.single().isThreadReply).isTrue()
    }

    @Test
    fun `should hand back the replies of a thread in the order they were posted`() {
        // conversations.replies answers oldest first, where conversations.history answers
        // newest first. Reversing this one too would cost a case its answer: the poller
        // signals the waiting execution per message, so the newest reply would move the case
        // past its catch event and the earlier one - the answer it was waiting for - would
        // then match no waiting execution and be dropped with its claim already written.
        enqueueBody(
            """
            {
              "ok": true,
              "messages": [
                {"type": "message", "user": "U1", "text": "vraag", "ts": "1735689600.000100",
                 "thread_ts": "1735689600.000100"},
                {"type": "message", "user": "U2", "text": "eerst", "ts": "1735690000.000600",
                 "thread_ts": "1735689600.000100"},
                {"type": "message", "user": "U2", "text": "daarna", "ts": "1735690100.000700",
                 "thread_ts": "1735689600.000100"}
              ],
              "has_more": false,
              "response_metadata": {"next_cursor": ""}
            }
            """.trimIndent(),
        )

        val result = client.conversationsReplies(connection(), CHANNEL, "1735689600.000100", null)

        assertThat(result.messages.map { it.ts })
            .containsExactly("1735690000.000600", "1735690100.000700")
    }

    @Test
    fun `should upload a file whose name carries no extension`() {
        // Indexing into a split on '.' threw here, and on "verslag.2026.pdf" it called the
        // file a "2026".
        enqueueBody("""{"ok": true}""")

        client.filesUpload(connection(), CHANNEL, "Zie bijlage", "LICENSE", "text".byteInputStream())

        val body = server.takeRequest().body.readUtf8()
        assertThat(body).contains("LICENSE")
        assertThat(body).doesNotContain("filetype")
    }

    @Test
    fun `should read the file type from the last dot of the name`() {
        enqueueBody("""{"ok": true}""")

        client.filesUpload(connection(), CHANNEL, null, "verslag.2026.pdf", "content".byteInputStream())

        // Splitting on the first dot made this a file of type "2026" titled "verslag".
        val body = server.takeRequest().body.readUtf8()
        assertThat(partOf(body, "filetype")).isEqualTo("pdf")
        assertThat(partOf(body, "title")).isEqualTo("verslag.2026")
    }

    @Test
    fun `should follow Slack's pagination and report when the page budget ran out`() {
        enqueueBody(pageWith(ts = "1735689600.000100", nextCursor = "cursor-1"))
        enqueueBody(pageWith(ts = "1735689700.000200", nextCursor = "cursor-2"))

        val result = client.conversationsHistory(connection(maxPagesPerPoll = 2), CHANNEL, null)

        assertThat(result.messages).hasSize(2)
        // The caller has to know: moving a cursor past a truncated read skips messages that
        // were never fetched, and a skipped message is a case that never starts.
        assertThat(result.truncated).isTrue()

        server.takeRequest()
        assertThat(server.takeRequest().path).contains("cursor=cursor-1")
    }

    @Test
    fun `should stop paging once Slack says there is no more`() {
        enqueueBody(pageWith(ts = "1735689600.000100", nextCursor = null))

        val result = client.conversationsHistory(connection(maxPagesPerPoll = 5), CHANNEL, null)

        assertThat(result.messages).hasSize(1)
        assertThat(result.truncated).isFalse()
        assertThat(server.requestCount).isEqualTo(1)
    }

    @Test
    fun `should post with the credentials it was handed`() {
        // One client serves every configuration, so the workspace has to travel with the call.
        // When it lived on the client instead, two process instances posting on two threads
        // could overwrite each other's token between it being set and being used - sending one
        // workspace's message to the other, signed with the other's credentials.
        enqueueBody("""{"ok": true, "channel": "$CHANNEL", "ts": "1735689600.000100"}""")
        enqueueBody("""{"ok": true, "channel": "$CHANNEL", "ts": "1735689600.000200"}""")

        client.chatPostMessage(connection(token = "token-workspace-a"), CHANNEL, "for A")
        client.chatPostMessage(connection(token = "token-workspace-b"), CHANNEL, "for B")

        assertThat(server.takeRequest().getHeader("Authorization")).isEqualTo("Bearer token-workspace-a")
        assertThat(server.takeRequest().getHeader("Authorization")).isEqualTo("Bearer token-workspace-b")
    }

    @Test
    fun `should return the timestamp of the message it posted`() {
        // The case has to keep it: it is the thread the answers to this message will carry.
        enqueueBody("""{"ok": true, "channel": "$CHANNEL", "ts": "1735689600.000100"}""")

        val response = client.chatPostMessage(connection(), CHANNEL, "Hello", threadTs = "1735689000.000001")

        assertThat(response.ts).isEqualTo("1735689600.000100")
        assertThat(server.takeRequest().body.readUtf8()).contains("thread_ts", "1735689000.000001")
    }

    @Test
    fun `should fail on a Slack error even though Slack answers with 200`() {
        server.enqueue(
            MockResponse()
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .setResponseCode(200)
                .setBody("""{"ok": false, "error": "not_in_channel"}"""),
        )

        assertThatThrownBy { client.conversationsHistory(connection(), CHANNEL, null) }
            .isInstanceOf(SlackException::class.java)
            .hasMessage("not_in_channel")
    }

    private fun connection(
        maxPagesPerPoll: Int = 10,
        token: String = TOKEN,
    ) = SlackConnectionProperties(
        baseUri = server.url("/").toUri(),
        token = token,
        messagesPerPage = 100,
        maxPagesPerPoll = maxPagesPerPoll,
        maxThreadsPerPoll = 50,
        initialLookback = Duration.ofMinutes(15),
    )

    /** The value of one part of a multipart body, with the part's own headers stripped off. */
    private fun partOf(
        body: String,
        name: String,
    ): String =
        body
            .substringAfter("name=\"$name\"")
            .substringAfter("\r\n\r\n")
            .substringBefore("\r\n--")

    private fun enqueueFile(fileName: String) = enqueueBody(readFileAsString(fileName))

    private fun enqueueBody(body: String) {
        server.enqueue(
            MockResponse()
                .addHeader("Content-Type", "application/json; charset=utf-8")
                .setResponseCode(200)
                .setBody(body),
        )
    }

    private fun pageWith(
        ts: String,
        nextCursor: String?,
    ): String =
        """
        {
          "ok": true,
          "messages": [{"type": "message", "user": "U012AB3CD", "text": "Hallo", "ts": "$ts"}],
          "has_more": ${nextCursor != null},
          "response_metadata": {"next_cursor": "${nextCursor ?: ""}"}
        }
        """.trimIndent()

    private companion object {
        private const val CHANNEL = "C012AB3CD"
        private const val TOKEN = "test-token"
    }
}
