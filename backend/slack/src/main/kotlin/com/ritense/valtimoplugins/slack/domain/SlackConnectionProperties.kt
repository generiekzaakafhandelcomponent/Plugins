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

import java.net.URI
import java.time.Duration

/**
 * A resolved plugin configuration: where Slack is, which token to present, and how much of
 * a channel one poll may read.
 *
 * Passed explicitly to every read call rather than held on the client, because the poller
 * runs on a scheduler thread while process instances are posting messages on their own
 * threads, and a shared mutable token on a singleton client would let the two overwrite each
 * other's credentials mid-request.
 */
data class SlackConnectionProperties(
    val baseUri: URI,
    val token: String,
    /**
     * Page size for `conversations.history` and `conversations.replies`. Slack accepts up to
     * 1000 but recommends staying well below it, because a large page is likelier to time out
     * than to arrive.
     */
    val messagesPerPage: Int,
    /**
     * Hard stop on how many pages one channel may consume per poll. Reaching it means the
     * oldest part of the window is left unread and the cursor moves past it, which is why
     * [com.ritense.valtimoplugins.slack.service.SlackMessagePollingService] logs a warning
     * when it happens instead of failing quietly.
     */
    val maxPagesPerPoll: Int,
    /**
     * Hard stop on how many open threads one channel may be asked about per poll.
     *
     * Slack charges a call per thread, and a token that runs out of calls stops reading the
     * channel's history too, so an unbounded number of waiting cases would take the whole
     * channel down with it.
     */
    val maxThreadsPerPoll: Int,
    /**
     * How far back the very first poll of a channel looks.
     *
     * A channel, unlike a dedicated mailbox, normally has years of history that nobody wants
     * turned into cases. So the first poll does not read the channel's past: it only sets the
     * cursor this far back, and anything older is never fetched.
     */
    val initialLookback: Duration,
) {
    fun validate() {
        require(baseUri.host != null) { "Slack URL '$baseUri' has no host" }
        require(token.isNotBlank()) { "Slack token is blank" }
        require(messagesPerPage in 1..MAX_MESSAGES_PER_PAGE) {
            "Messages per page must be between 1 and $MAX_MESSAGES_PER_PAGE, but was $messagesPerPage"
        }
        require(maxPagesPerPoll >= 1) { "Maximum pages per poll must be at least 1, but was $maxPagesPerPoll" }
        require(maxThreadsPerPoll >= 0) { "Maximum threads per poll must not be negative, but was $maxThreadsPerPoll" }
        require(!initialLookback.isNegative) { "Initial lookback must not be negative, but was $initialLookback" }
    }

    /** For log lines: never includes the token. */
    fun describe(): String = "Slack at ${baseUri.host}"

    companion object {
        /** Slack's documented ceiling for the `limit` parameter of the conversations methods. */
        const val MAX_MESSAGES_PER_PAGE = 1000
    }
}
