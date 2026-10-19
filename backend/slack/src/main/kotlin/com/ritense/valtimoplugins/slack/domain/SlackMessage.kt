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

import java.math.BigDecimal
import java.time.Instant

/**
 * One Slack message, read from a channel and reduced to what a process needs.
 *
 * The channel is carried along even though Slack does not return it inside a
 * `conversations.history` message: the same `ts` can exist in two channels, so nothing about
 * a message is unique until the channel is part of it. See [identity].
 */
data class SlackMessage(
    val channel: String,
    /**
     * Slack's message timestamp — `"1735689600.123456"`. Doubles as the message id within a
     * channel, which is why it is kept as the string Slack sent rather than parsed into an
     * [Instant]: it is passed back to the API verbatim as the `oldest` cursor, and a
     * round-trip through a floating point number would not reproduce it exactly.
     */
    val ts: String,
    /**
     * The `ts` of the message that opened the thread, present on every message in a thread —
     * including the parent, where it equals [ts]. Absent on a message that is not part of a
     * thread at all.
     */
    val threadTs: String? = null,
    val text: String? = null,
    val userId: String? = null,
    val userName: String? = null,
    val botId: String? = null,
    val appId: String? = null,
    /**
     * Slack's message subtype: absent on a plain message, and set on the dozens of variants
     * that are really channel events (`channel_join`, `message_changed`, `bot_message`, ...).
     */
    val subtype: String? = null,
    val fileNames: List<String> = emptyList(),
) {
    /** Unique across the workspace, and the basis of the claim key. */
    val identity: String get() = "$channel/$ts"

    /**
     * The thread this message belongs to, which for a message outside any thread is the
     * message itself.
     *
     * This is what correlation runs on: a case remembers the conversation it is part of, and
     * every later message in that thread reports the same value here. See
     * [com.ritense.valtimoplugins.slack.service.SlackMessageProcessStarter].
     */
    val conversationTs: String get() = threadTs ?: ts

    val isThreadReply: Boolean get() = threadTs != null && threadTs != ts

    /**
     * Whether Slack attributes this message to an app rather than a person.
     *
     * Load-bearing: the message this plugin's own `post-message` action writes comes back on
     * the next poll of that channel, and treating it as incoming would start a case for
     * every message the case itself sent. See [ReceiveMessageProperties.includeBotMessages].
     */
    val isFromBot: Boolean get() = botId != null || appId != null || subtype == BOT_MESSAGE_SUBTYPE

    /** Derived from [ts], which Slack defines as epoch seconds with microsecond precision. */
    val sentAt: Instant?
        get() =
            runCatching {
                val seconds = BigDecimal(ts)
                Instant.ofEpochSecond(
                    seconds.toLong(),
                    seconds.remainder(BigDecimal.ONE).movePointRight(NANOS_SCALE).toLong(),
                )
            }.getOrNull()

    /**
     * Process variables handed to the started or resumed instance.
     *
     * Prefixed with `slack` so they cannot collide with variables the case process already
     * uses, and flat rather than nested because BPMN expressions and FormIO both deal poorly
     * with nested maps.
     */
    fun toProcessVariables(): Map<String, Any> =
        buildMap {
            put(CHANNEL_VARIABLE, channel)
            put(MESSAGE_TS_VARIABLE, ts)
            put(THREAD_TS_VARIABLE, conversationTs)
            put("slackMessageIsThreadReply", isThreadReply)
            put("slackMessageIsFromBot", isFromBot)
            put("slackMessageFileNames", fileNames)
            text?.let { put("slackMessageText", it) }
            userId?.let { put("slackUserId", it) }
            userName?.let { put("slackUserName", it) }
            botId?.let { put("slackBotId", it) }
            subtype?.let { put("slackMessageSubtype", it) }
            sentAt?.let { put("slackMessageSentAt", it.toString()) }
        }

    companion object {
        /**
         * The variable a case is correlated on. Written by [toProcessVariables] and by the
         * `post-message` action, and read back when a reply arrives — a rename in one place
         * only would silently stop every reply from finding its case.
         */
        const val THREAD_TS_VARIABLE = "slackThreadTs"

        /** The channel a case is conversing in, so a reply can be posted back to it. */
        const val CHANNEL_VARIABLE = "slackChannel"

        /** The `ts` of the single message that started or resumed the case. */
        const val MESSAGE_TS_VARIABLE = "slackMessageTs"

        private const val BOT_MESSAGE_SUBTYPE = "bot_message"

        /** Scale of the fractional part of an epoch-seconds value, in nanoseconds. */
        private const val NANOS_SCALE = 9

        /**
         * Orders two Slack timestamps.
         *
         * Numeric rather than lexicographic: `"1735689600.1"` and `"1735689600.123456"` are
         * the same instant to within a rounding error, but sort apart as strings, and Slack
         * trims trailing zeroes on some payloads. Comparing the strings would eventually
         * move a cursor backwards.
         */
        fun compareTimestamps(
            left: String,
            right: String,
        ): Int =
            runCatching { BigDecimal(left).compareTo(BigDecimal(right)) }
                .getOrElse { left.compareTo(right) }

        /** The later of two timestamps, treating a missing one as "no timestamp yet". */
        fun latestTimestamp(
            left: String?,
            right: String?,
        ): String? =
            when {
                left == null -> right
                right == null -> left
                compareTimestamps(left, right) >= 0 -> left
                else -> right
            }

        /**
         * The earlier of two read positions, where a missing one means "from the beginning"
         * and therefore wins.
         *
         * The opposite convention to [latestTimestamp] on purpose: this one combines the
         * positions of several readers of the same conversation, and reading from anywhere
         * later than the one furthest behind would skip what it has not seen.
         */
        fun earliestPosition(
            left: String?,
            right: String?,
        ): String? =
            when {
                left == null || right == null -> null
                compareTimestamps(left, right) <= 0 -> left
                else -> right
            }

        /** Formats an instant the way Slack's `oldest` parameter expects it. */
        fun timestampOf(instant: Instant): String = "%d.%06d".format(instant.epochSecond, instant.nano / 1_000)
    }
}
