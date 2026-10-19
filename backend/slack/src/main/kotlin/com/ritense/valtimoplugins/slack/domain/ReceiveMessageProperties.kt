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

package com.ritense.valtimoplugins.slack.domain

import com.fasterxml.jackson.annotation.JsonIgnoreProperties

/**
 * Action properties of the `receive-message` process link: which channel to read, and which
 * of its messages this particular link should start a process for.
 *
 * [channel] is the only one that is not a filter — it is what tells the poller there is a
 * channel to read at all. The rest are optional and AND-ed, so a link with only a channel
 * picks up every message posted in it, which is the common single-process setup.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
data class ReceiveMessageProperties(
    /**
     * The channel id, like `C012AB3CD`.
     *
     * An id rather than a `#name`, because `conversations.history` only accepts ids: a name
     * would have to be looked up first, and would silently stop resolving the day somebody
     * renames the channel.
     */
    val channel: String? = null,
    val messageContains: String? = null,
    /** Filters on the Slack user id of the author, like `U012AB3CD`. */
    val userId: String? = null,
    /**
     * Whether messages Slack attributes to an app should be handled too. Off unless set,
     * because the case's own outgoing messages are app messages: a link that accepts them and
     * a process that answers them form a loop that posts until the rate limit stops it.
     */
    val includeBotMessages: Boolean? = null,
    /**
     * Whether to consider only replies inside a thread, or only messages that start one.
     *
     * Unset means both. Useful when one channel drives two links: a message start event that
     * should only fire on new conversations ([THREAD_STARTS_ONLY]), and a catch event that
     * should only see the replies to them ([THREAD_REPLIES_ONLY]).
     */
    val threadScope: String? = null,
) {
    fun matches(message: SlackMessage): Boolean =
        matchesChannel(message) &&
            matchesBotOrigin(message) &&
            matchesThreadScope(message) &&
            (userId.isNullOrBlank() || userId.equals(message.userId, ignoreCase = true)) &&
            (messageContains.isNullOrBlank() || message.text?.contains(messageContains, ignoreCase = true) == true)

    /**
     * A link with no channel matches nothing.
     *
     * It cannot be polled, so a message can only reach it via another link on the same
     * configuration — and letting it match then would hand it messages from a channel its
     * author never named.
     */
    private fun matchesChannel(message: SlackMessage): Boolean =
        !channel.isNullOrBlank() && channel.equals(message.channel, ignoreCase = true)

    private fun matchesBotOrigin(message: SlackMessage): Boolean = includeBotMessages == true || !message.isFromBot

    private fun matchesThreadScope(message: SlackMessage): Boolean =
        when (threadScope?.takeIf { it.isNotBlank() }) {
            null, ANY_MESSAGE -> true
            THREAD_REPLIES_ONLY -> message.isThreadReply
            THREAD_STARTS_ONLY -> !message.isThreadReply
            else -> true
        }

    companion object {
        const val ANY_MESSAGE = "ANY"
        const val THREAD_STARTS_ONLY = "THREAD_STARTS_ONLY"
        const val THREAD_REPLIES_ONLY = "THREAD_REPLIES_ONLY"
    }
}
