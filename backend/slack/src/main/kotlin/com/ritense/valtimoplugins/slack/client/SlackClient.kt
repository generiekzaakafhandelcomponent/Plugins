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

package com.ritense.valtimoplugins.slack.client

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.slack.domain.SlackConnectionProperties
import com.ritense.valtimoplugins.slack.domain.SlackMessage
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.core.io.InputStreamResource
import org.springframework.http.MediaType
import org.springframework.http.MediaType.MULTIPART_FORM_DATA
import org.springframework.stereotype.Component
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.io.InputStream

/**
 * Talks to the Slack Web API.
 *
 * One instance serves every plugin configuration, and the workspace to address is therefore a
 * parameter of each call rather than state on the client. It used to be the latter, which was
 * a real hazard rather than a stylistic one: this is a singleton, two process instances
 * configured against two workspaces post on two threads, and between one thread setting the
 * token and using it the other could replace it — sending one workspace's message to the
 * other, with its credentials.
 */
@Component
@SkipComponentScan
class SlackClient(
    private val restClientBuilder: RestClient.Builder,
) {
    /**
     * https://api.slack.com/methods/chat.postMessage
     *
     * The returned `ts` is the id of the posted message, and the thread a reply to it will
     * carry. A case that wants an answer has to keep it.
     */
    fun chatPostMessage(
        connection: SlackConnectionProperties,
        channel: String,
        message: String,
        threadTs: String? = null,
    ): ChatPostMessageResponse {
        logger.debug { "Post message in slack ('$message')" }

        val multipartFormData =
            mutableMapOf<String, Any>(
                "channel" to channel,
                "text" to message,
            )

        threadTs?.takeIf { it.isNotBlank() }?.let { multipartFormData["thread_ts"] = it }

        return post(connection, "/api/chat.postMessage", multipartFormData)
    }

    /**
     * https://api.slack.com/methods/files.upload
     */
    fun filesUpload(
        connection: SlackConnectionProperties,
        channels: String,
        message: String?,
        fileName: String,
        file: InputStream,
    ) {
        logger.debug { "Post message with file in slack ('$message', '$fileName')" }

        // Split on the last dot rather than the first, and tolerate there being none at all:
        // "verslag.2026.pdf" is a pdf, and "LICENSE" is a file Slack is happy to take without
        // being told its type. Indexing into a split on '.' threw on both.
        val extension = fileName.substringAfterLast('.', "")

        val multipartFormData =
            mutableMapOf(
                "channels" to channels,
                "filename" to fileName,
                "title" to fileName.substringBeforeLast('.'),
                "content" to InputStreamResource(file),
            )

        extension.takeIf { it.isNotBlank() }?.let { multipartFormData["filetype"] = it }
        message?.let { multipartFormData["initial_message"] = it }

        post(connection, "/api/files.upload", multipartFormData)
    }

    /**
     * https://api.slack.com/methods/conversations.history
     *
     * Reads the messages posted in [channel] after [oldest], oldest first, following Slack's
     * pagination until the channel is exhausted or [SlackConnectionProperties.maxPagesPerPoll]
     * pages have been read.
     *
     * Slack answers newest first, so the pages walk backwards in time towards [oldest] and
     * the result is reversed before it is returned. Handling them in the order they were
     * posted is what lets a channel cursor advance safely: a run that dies halfway has read a
     * contiguous stretch, not the newest few with holes behind them.
     *
     * Note that only top-level messages come back. Replies inside a thread are reachable
     * through [conversationsReplies] alone, which is why the poller asks for both.
     */
    fun conversationsHistory(
        connection: SlackConnectionProperties,
        channel: String,
        oldest: String?,
    ): PagedMessages =
        readConversation(
            path = "/api/conversations.history",
            connection = connection,
            channel = channel,
            oldest = oldest,
            threadTs = null,
            newestFirst = true,
        )

    /**
     * https://api.slack.com/methods/conversations.replies
     *
     * Reads the replies in the thread opened by [threadTs] that were posted after [oldest],
     * oldest first. The thread parent itself is part of Slack's answer and is filtered out:
     * it was already handled by [conversationsHistory] when it was posted.
     */
    fun conversationsReplies(
        connection: SlackConnectionProperties,
        channel: String,
        threadTs: String,
        oldest: String?,
    ): PagedMessages =
        readConversation(
            path = "/api/conversations.replies",
            connection = connection,
            channel = channel,
            oldest = oldest,
            threadTs = threadTs,
            // Unlike conversations.history, this method answers oldest first - "the earliest
            // messages in the time range are returned first" - and pages forward in time.
            newestFirst = false,
        ).let { paged -> paged.copy(messages = paged.messages.filterNot { it.ts == threadTs }) }

    private fun readConversation(
        path: String,
        connection: SlackConnectionProperties,
        channel: String,
        oldest: String?,
        threadTs: String?,
        newestFirst: Boolean,
    ): PagedMessages {
        connection.validate()

        val messages = mutableListOf<SlackMessage>()
        var cursor: String? = null
        var page = 0

        do {
            val response =
                get(
                    connection = connection,
                    path = path,
                    queryParameters =
                        buildMap {
                            put("channel", channel)
                            put("limit", connection.messagesPerPage.toString())
                            threadTs?.let { put("ts", it) }
                            // Exclusive, so a cursor sitting exactly on the newest handled
                            // message does not hand that message back on every poll.
                            oldest?.let {
                                put("oldest", it)
                                put("inclusive", "false")
                            }
                            cursor?.let { put("cursor", it) }
                        },
                )

            messages += response.messages.mapNotNull { it.toSlackMessage(channel) }
            cursor = response.nextCursor.takeIf { response.hasMore }
            page++
        } while (cursor != null && page < connection.maxPagesPerPoll)

        return PagedMessages(
            // Always oldest first, whichever way Slack served it.
            //
            // Reversed rather than sorted: Slack's ordering within a page is authoritative,
            // and sorting on ts would impose a total order on values that are only
            // approximately comparable across pages.
            //
            // Reversing a reply page too would be a silent loss rather than a cosmetic one:
            // the poller signals the waiting execution with each message in turn, so handing
            // it the newest reply first moves the case past its catch event, and the earlier
            // reply - the answer the case was actually waiting for - then matches no waiting
            // execution and is thrown away with its claim already written.
            messages = if (newestFirst) messages.reversed() else messages,
            truncated = cursor != null,
        )
    }

    private fun get(
        connection: SlackConnectionProperties,
        path: String,
        queryParameters: Map<String, String>,
    ): ConversationsResponse {
        val response =
            restClientBuilder
                .clone()
                .build()
                .get()
                .uri { builder ->
                    builder
                        .scheme(connection.baseUri.scheme)
                        .host(connection.baseUri.host)
                        .port(connection.baseUri.port)
                        .path(connection.baseUri.path)
                        .path(path)
                        .also { queryParameters.forEach { (key, value) -> it.queryParam(key, value) } }
                        .build()
                }.headers {
                    it.setBearerAuth(connection.token)
                }.accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body<ConversationsResponse>()

        if (response?.ok != true) {
            throw SlackException(response?.error)
        }
        return response
    }

    private fun post(
        connection: SlackConnectionProperties,
        path: String,
        multipartFormData: Map<String, Any>,
    ): ChatPostMessageResponse {
        val body = LinkedMultiValueMap<String, Any>()
        multipartFormData.forEach { body.add(it.key, it.value) }

        val response =
            restClientBuilder
                .clone()
                .build()
                .post()
                .uri {
                    it
                        .scheme(connection.baseUri.scheme)
                        .host(connection.baseUri.host)
                        .path(connection.baseUri.path)
                        .path(path)
                        .port(connection.baseUri.port)
                        .build()
                }.headers {
                    it.contentType = MULTIPART_FORM_DATA
                    it.setBearerAuth(connection.token)
                }.accept(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body<ChatPostMessageResponse>()

        if (response?.ok != true) {
            throw SlackException(response?.error)
        }
        return response
    }

    /**
     * The messages of one read, and whether the page budget ran out before the channel did.
     *
     * [truncated] exists so the caller can say so out loud: moving the cursor past a
     * truncated read skips the messages that were never fetched, and a skipped message is a
     * case that never starts. See `SlackMessagePollingService`.
     */
    data class PagedMessages(
        val messages: List<SlackMessage> = emptyList(),
        val truncated: Boolean = false,
    ) {
        /** The newest timestamp read, or `null` when nothing came back. */
        fun latestTimestamp(): String? =
            messages.fold(null as String?) { latest, message -> SlackMessage.latestTimestamp(latest, message.ts) }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
