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

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonProperty
import com.ritense.valtimoplugins.slack.domain.SlackMessage

/**
 * The envelope every Slack Web API method answers with. Note that a failure is reported in
 * `ok`, with HTTP 200 — so the status code says nothing about whether the call worked.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class SlackResponse(
    val ok: Boolean,
    val error: String? = null,
)

/**
 * https://api.slack.com/methods/chat.postMessage
 *
 * [ts] is the reason this response is read rather than discarded: it is the id of the message
 * just posted, and a case that wants an answer has to remember it to recognise the replies.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class ChatPostMessageResponse(
    val ok: Boolean,
    val error: String? = null,
    val channel: String? = null,
    val ts: String? = null,
)

/**
 * https://api.slack.com/methods/conversations.history
 * https://api.slack.com/methods/conversations.replies
 *
 * Both methods return the same shape, newest message first.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class ConversationsResponse(
    val ok: Boolean,
    val error: String? = null,
    val messages: List<SlackMessageResponse> = emptyList(),
    @JsonProperty("has_more")
    val hasMore: Boolean = false,
    @JsonProperty("response_metadata")
    val responseMetadata: ResponseMetadata? = null,
) {
    /** Absent once the last page has been served, which is the signal to stop paging. */
    val nextCursor: String? get() = responseMetadata?.nextCursor?.takeIf { it.isNotBlank() }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class ResponseMetadata(
    @JsonProperty("next_cursor")
    val nextCursor: String? = null,
)

/**
 * A message as Slack serialises it.
 *
 * Deliberately a separate type from [SlackMessage]: the wire format is Slack's to change, and
 * only the channel-plus-`ts` pair and a handful of fields matter to a process. The channel is
 * not part of it because Slack does not repeat it per message — the caller knows which
 * channel it asked about, and supplies it in [toSlackMessage].
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class SlackMessageResponse(
    val type: String? = null,
    val subtype: String? = null,
    val ts: String? = null,
    @JsonProperty("thread_ts")
    val threadTs: String? = null,
    val text: String? = null,
    val user: String? = null,
    val username: String? = null,
    @JsonProperty("bot_id")
    val botId: String? = null,
    @JsonProperty("app_id")
    val appId: String? = null,
    val files: List<SlackFileResponse> = emptyList(),
) {
    /**
     * Returns `null` for anything that cannot be treated as a message, which the history of
     * a real channel is full of: tombstones left by a deletion, and the `message_changed`
     * events Slack emits when somebody edits an old message. Neither carries a usable `ts` of
     * its own, and an edit is not a new message — resuming a case on one would let anybody
     * re-trigger a process by editing a message from last year.
     */
    fun toSlackMessage(channel: String): SlackMessage? {
        if (ts.isNullOrBlank()) return null
        if (type != null && type != MESSAGE_TYPE) return null
        if (subtype in IGNORED_SUBTYPES) return null

        return SlackMessage(
            channel = channel,
            ts = ts,
            threadTs = threadTs?.takeIf { it.isNotBlank() },
            text = text,
            userId = user,
            userName = username,
            botId = botId,
            appId = appId,
            subtype = subtype,
            fileNames = files.mapNotNull { it.name },
        )
    }

    private companion object {
        private const val MESSAGE_TYPE = "message"

        /**
         * Channel bookkeeping that is technically a message but is never a process trigger.
         *
         * `thread_broadcast` is deliberately absent: a reply sent with "also send to channel"
         * carries that subtype and is otherwise an ordinary reply from a person, so dropping
         * it would lose exactly the answer a case was waiting for.
         */
        private val IGNORED_SUBTYPES =
            setOf(
                "message_changed",
                "message_deleted",
                "message_replied",
                "channel_join",
                "channel_leave",
                "channel_topic",
                "channel_purpose",
                "channel_name",
                "channel_archive",
                "channel_unarchive",
                "tombstone",
            )
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class SlackFileResponse(
    val id: String? = null,
    val name: String? = null,
    val mimetype: String? = null,
)
