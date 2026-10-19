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

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.Instant

/**
 * How far one configuration has read one channel.
 *
 * A channel is not a mailbox: it is a shared, long-lived room that already contains
 * everything ever said in it. Without a remembered position the first poll would read that
 * history and start a case per message, and every later poll would re-read it and lean on
 * the claim table to throw the results away.
 *
 * The row is created — and immediately committed — the first time a channel is seen, holding
 * a timestamp derived from `initialLookback` rather than from the channel's contents. That is
 * the deliberate asymmetry with the mail plugin: past messages are skipped, not queued.
 */
@Entity
@Table(name = "slack_channel_cursor")
class SlackChannelCursor(
    /** `"<plugin configuration id>|<channel>"`; see [idOf]. */
    @Id
    @Column(name = "cursor_id")
    val cursorId: String,
    @Column(name = "plugin_configuration_id", nullable = false)
    val pluginConfigurationId: String,
    @Column(name = "channel", nullable = false)
    val channel: String,
    /**
     * The `ts` of the newest message read so far, passed back to Slack as `oldest`.
     *
     * Only ever moves forward: [advanceTo] ignores an older value, so a page that arrives out
     * of order, or a thread reply fetched alongside a newer top-level message, cannot rewind
     * the channel and replay what has already been handled.
     */
    @Column(name = "last_message_ts", nullable = false)
    var lastMessageTs: String,
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant = Instant.now(),
) {
    /** Returns `true` when the cursor actually moved, so the caller can skip a pointless write. */
    fun advanceTo(ts: String?): Boolean {
        if (ts == null || SlackMessage.compareTimestamps(ts, lastMessageTs) <= 0) {
            return false
        }
        lastMessageTs = ts
        updatedAt = Instant.now()
        return true
    }

    companion object {
        fun idOf(
            pluginConfigurationId: String,
            channel: String,
        ): String = "$pluginConfigurationId|$channel"
    }
}
