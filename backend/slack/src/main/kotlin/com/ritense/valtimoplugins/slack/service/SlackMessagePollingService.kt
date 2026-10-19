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
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.domain.PluginProcessLink
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.repository.ValtimoPluginProcessLinkRepository
import com.ritense.valtimoplugins.slack.client.SlackClient
import com.ritense.valtimoplugins.slack.domain.ReceiveMessageProperties
import com.ritense.valtimoplugins.slack.domain.SlackChannelCursor
import com.ritense.valtimoplugins.slack.domain.SlackConnectionProperties
import com.ritense.valtimoplugins.slack.domain.SlackMessage
import com.ritense.valtimoplugins.slack.plugin.SlackPlugin
import com.ritense.valtimoplugins.slack.repository.ProcessedSlackMessageRepository
import com.ritense.valtimoplugins.slack.repository.SlackChannelCursorRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Drives the inbound side of the plugin: on a schedule, reads every channel some BPMN model
 * is waiting on and feeds the messages it finds to [IncomingSlackMessageHandler].
 *
 * Which channels those are is derived from the `receive-message` process links rather than
 * from the plugin configurations, so a configuration nobody links to costs nothing: adding
 * one for a workspace you are not ready to process yet is harmless, and removing the last
 * link stops the reading without anyone having to remember to delete the token.
 *
 * Two things a mailbox does not require, and a channel does:
 * - a per-channel cursor, because a channel is full of history nobody wants turned into
 *   cases. See [SlackChannelCursor].
 * - a second read per open conversation, because Slack keeps thread replies out of a
 *   channel's history. The engine says which threads are still unanswered, and only those
 *   are asked about. See [SlackMessageProcessStarter.threadsAwaitingReply].
 */
open class SlackMessagePollingService(
    private val pluginProcessLinkRepository: ValtimoPluginProcessLinkRepository,
    private val pluginService: PluginService,
    private val slackClient: SlackClient,
    private val incomingSlackMessageHandler: IncomingSlackMessageHandler,
    private val slackMessageProcessStarter: SlackMessageProcessStarter,
    private val processedSlackMessageRepository: ProcessedSlackMessageRepository,
    private val slackChannelCursorRepository: SlackChannelCursorRepository,
    private val objectMapper: ObjectMapper,
    private val retentionDays: Long,
) {
    /**
     * Guards against overlapping runs *within this JVM*.
     *
     * Spring's default scheduler is single-threaded, so today this cannot happen — but a
     * workspace with many channels can easily outlast a five-minute interval, especially on
     * a token that is being rate limited, and the day someone configures a pool the overlap
     * would double-fetch every message and rely entirely on the claim table to sort it out.
     *
     * The `@SchedulerLock` below is the other half: this flag says nothing about the other
     * nodes of a cluster, all of which run the same cron against the same channels.
     */
    private val running = AtomicBoolean(false)

    /**
     * `lockAtMostFor` is the deadline for a node that dies mid-poll: until it passes, no
     * other node takes over. Generous relative to the default five-minute interval, because
     * the cost of releasing early — two nodes in the same channel — is worse than the cost of
     * a late release, which is a few skipped polls.
     */
    @Scheduled(cron = "\${valtimo.slack.poll-cron:0 */5 * * * *}")
    @SchedulerLock(name = "slackPollChannels", lockAtLeastFor = "PT1S", lockAtMostFor = "PT10M")
    open fun pollChannels() {
        if (!running.compareAndSet(false, true)) {
            logger.info { "Skipping this Slack poll: the previous one is still running" }
            return
        }
        try {
            pollAllConfigurations()
        } finally {
            running.set(false)
        }
    }

    private fun pollAllConfigurations() {
        val links = pluginProcessLinkRepository.findByPluginActionDefinitionKey(RECEIVE_MESSAGE_ACTION)

        // A process link may name its plugin configuration indirectly, through a reference
        // resolved at execution time from process variables. That cannot work here: there is
        // no execution to resolve against until a message has already been read, which is the
        // very thing the configuration is needed for. Skip those loudly.
        val (bound, unbound) = links.partition { it.pluginConfigurationId != null }
        unbound.forEach {
            logger.warn {
                "Ignoring the receive-message link on activity '${it.activityId}' of process definition " +
                    "'${it.processDefinitionId}': it has no fixed plugin configuration, and a workspace cannot be " +
                    "resolved from process variables before the message is read."
            }
        }

        val linksByConfiguration = bound.groupBy { requireNotNull(it.pluginConfigurationId) }

        if (linksByConfiguration.isEmpty()) {
            logger.debug { "No '$RECEIVE_MESSAGE_ACTION' process links configured; nothing to poll" }
            return
        }

        logger.debug { "Polling ${linksByConfiguration.size} Slack configuration(s)" }
        linksByConfiguration.forEach { (configurationId, processLinks) ->
            // One workspace failing must not stop the others: a single revoked token would
            // otherwise silently stall every other workspace in the installation.
            try {
                pollConfiguration(configurationId, processLinks)
            } catch (e: Exception) {
                logger.error(e) { "Polling Slack configuration '$configurationId' failed" }
            }
        }
    }

    /**
     * `open` on purpose, even though nothing overrides it: the bean is proxied for
     * `@Scheduled` and `@SchedulerLock`, and a final method cannot be intercepted — a call
     * arriving through the proxy would then run against the proxy's own uninitialised fields
     * and fail with a null collaborator.
     */
    internal open fun pollConfiguration(
        configurationId: PluginConfigurationId,
        processLinks: List<PluginProcessLink>,
    ) {
        val plugin =
            runCatching { pluginService.createInstance<SlackPlugin>(configurationId.id) }
                .getOrElse { e ->
                    logger.warn(e) { "Plugin configuration '$configurationId' could not be instantiated; skipping" }
                    return
                }

        val connection = plugin.connectionProperties()
        val configurationKey = configurationId.id.toString()

        // A link names its channel in its own action properties, so one configuration can
        // feed several channels and one channel several processes. Grouping by channel is
        // what keeps that from turning into one Slack call per link.
        val linksByChannel =
            processLinks
                .groupBy { channelOf(it) }
                .filterKeys { it != null }
                .mapKeys { requireNotNull(it.key) }

        if (linksByChannel.isEmpty()) {
            logger.debug { "No readable channel on any receive-message link of configuration '$configurationId'" }
            return
        }

        linksByChannel.forEach { (channel, channelLinks) ->
            try {
                pollChannel(connection, configurationKey, channel, channelLinks)
            } catch (e: Exception) {
                logger.error(e) { "Polling channel '$channel' of configuration '$configurationId' failed" }
            }
        }
    }

    private fun pollChannel(
        connection: SlackConnectionProperties,
        configurationKey: String,
        channel: String,
        processLinks: List<PluginProcessLink>,
    ) {
        val cursor = cursorFor(connection, configurationKey, channel)
        val readFrom = cursor.lastMessageTs

        val history = slackClient.conversationsHistory(connection, channel, readFrom)
        if (history.truncated) {
            logger.warn {
                "Read ${connection.maxPagesPerPoll} page(s) of channel '$channel' and Slack still had more to " +
                    "give. The cursor moves to the newest message read, so anything between '$readFrom' and " +
                    "'${history.messages.firstOrNull()?.ts}' that did not fit is not handled. Raise the page " +
                    "budget on the plugin configuration if this repeats."
            }
        }

        // The cursor moves over the channel's own messages and nothing else.
        //
        // Letting a thread reply move it would lose messages: the two reads are separate HTTP
        // calls, and a message posted to the channel between them can carry a timestamp older
        // than a reply fetched by the second call. Advancing to the newest of both would put
        // the cursor past a message that was never read, and the next poll would not ask for
        // it again. Replies need no cursor of their own — each waiting case says where it got
        // to. See [pollAwaitedThreads].
        val handledHistory = handleInOrder(history.messages, configurationKey, processLinks)
        advance(cursor, handledHistory.resumeFrom)

        // After the history, so that a case which started and parked earlier in this very poll
        // is already counted among the conversations worth asking about.
        val replies = pollAwaitedThreads(connection, channel, processLinks)
        val handledReplies = handleInOrder(replies, configurationKey, processLinks)

        val read = history.messages.size + replies.size
        // A quiet channel is the normal case, and logging it every five minutes for every
        // channel would bury the polls that did something.
        if (read == 0) {
            return
        }

        logger.info {
            "Polled channel '$channel': $read read (${replies.size} from threads), " +
                "${handledHistory.handled + handledReplies.handled} started, " +
                "${handledHistory.skipped + handledReplies.skipped} skipped, " +
                "${handledHistory.failed + handledReplies.failed} failed"
        }
    }

    /**
     * Reads the threads that cases are waiting for an answer in.
     *
     * Bounded by the number of open conversations rather than by the size of the channel,
     * because Slack charges one call per thread and a workspace on a modern app token is
     * allowed very few calls per minute. The cap is a backstop for the case where a process
     * leaks waiting instances; hitting it is reported rather than absorbed.
     */
    private fun pollAwaitedThreads(
        connection: SlackConnectionProperties,
        channel: String,
        processLinks: List<PluginProcessLink>,
    ): List<SlackMessage> {
        // Each thread is read from the position of the case that is furthest behind in it, so
        // two cases waiting in one thread cost one call and neither misses its answer.
        val threads = mutableMapOf<String, String?>()
        processLinks.forEach { processLink ->
            slackMessageProcessStarter.threadsAwaitingReply(processLink).forEach { (thread, seen) ->
                threads[thread] =
                    if (threads.containsKey(thread)) {
                        SlackMessage.earliestPosition(threads[thread], seen)
                    } else {
                        seen
                    }
            }
        }

        if (threads.isEmpty()) {
            return emptyList()
        }

        // Furthest behind first, so the budget is a queue rather than a cliff. Taking them in
        // map order instead would drop the same threads every poll, and a case whose thread
        // never gets read is a case that never continues — quietly, and for good.
        val budgeted =
            threads.entries
                .sortedWith(
                    compareBy(nullsFirst(Comparator(SlackMessage::compareTimestamps))) { it.value },
                ).take(connection.maxThreadsPerPoll)

        if (budgeted.size < threads.size) {
            logger.warn {
                "${threads.size} open conversation(s) in channel '$channel' are waiting for a reply, which is more " +
                    "than the configured ${connection.maxThreadsPerPoll} per poll. The remaining " +
                    "${threads.size - budgeted.size} are read on a later round, the ones furthest behind first."
            }
        }

        return budgeted.flatMap { (threadTs, seen) ->
            try {
                slackClient.conversationsReplies(connection, channel, threadTs, seen).messages
            } catch (e: Exception) {
                // A thread whose parent was deleted answers with an error forever. Losing it
                // must not cost the other threads, nor the channel's own history.
                logger.warn(e) { "Could not read thread '$threadTs' of channel '$channel'" }
                emptyList()
            }
        }
    }

    private fun handleInOrder(
        messages: List<SlackMessage>,
        configurationKey: String,
        processLinks: List<PluginProcessLink>,
    ): PollOutcome {
        var handled = 0
        var skipped = 0
        var failed = 0
        var resumeFrom: String? = null

        // Once something has failed the cursor may not move any further, even over messages
        // after it that succeed: it is a single position, and moving it past the failure is
        // what would drop that message for good.
        var blocked = false

        for (message in messages) {
            try {
                // Established here, outside the handler's transaction, even though
                // IncomingSlackMessageHandler.handle is already @RunWithoutAuthorization.
                //
                // That annotation is not enough on its own: its aspect declares no order, so
                // it runs inside the transaction advice and resets its thread-local before
                // the commit. Valtimo's task listeners fire on AFTER_COMMIT, and they read
                // the document to push an SSE update - a permission check that a scheduler
                // thread, having no authenticated user, cannot pass. Wrapping the call keeps
                // the context open across the commit. The thread-local is nesting-safe, so
                // the inner annotation stays harmless.
                val started =
                    runWithoutAuthorization {
                        incomingSlackMessageHandler.handle(message, configurationKey, processLinks)
                    }
                if (started) handled++ else skipped++
            } catch (e: DataIntegrityViolationException) {
                // Another node claimed this message first. Not an error, and not a reason to
                // hold the cursor back - the node that won the race is handling it.
                logger.debug(e) { "Message '${message.identity}' was claimed concurrently; skipping" }
                skipped++
            } catch (e: Exception) {
                failed++
                blocked = true
                logger.error(e) {
                    "Failed to handle Slack message '${message.identity}'; it will be offered again on the next poll"
                }
                // Deliberately no `break`: the rest of this round is still attempted, so one
                // message the process engine chokes on does not hold up the messages behind
                // it. They keep their claim, so being offered again next poll costs a lookup
                // and nothing more.
                continue
            }
            if (!blocked) {
                resumeFrom = SlackMessage.latestTimestamp(resumeFrom, message.ts)
            }
        }

        return PollOutcome(handled = handled, skipped = skipped, failed = failed, resumeFrom = resumeFrom)
    }

    /**
     * Loads the channel's cursor, creating it on first sight.
     *
     * The new cursor is committed before anything is read, so a poll that dies immediately
     * afterwards still cannot mistake the channel's history for new messages on the next run.
     */
    private fun cursorFor(
        connection: SlackConnectionProperties,
        configurationKey: String,
        channel: String,
    ): SlackChannelCursor {
        val cursorId = SlackChannelCursor.idOf(configurationKey, channel)
        slackChannelCursorRepository.findById(cursorId).orElse(null)?.let { return it }

        val startingPoint = Instant.now().minus(connection.initialLookback)
        logger.info {
            "First poll of channel '$channel' for configuration '$configurationKey'; starting at $startingPoint " +
                "and leaving everything posted before that alone"
        }
        return slackChannelCursorRepository.save(
            SlackChannelCursor(
                cursorId = cursorId,
                pluginConfigurationId = configurationKey,
                channel = channel,
                lastMessageTs = SlackMessage.timestampOf(startingPoint),
            ),
        )
    }

    private fun advance(
        cursor: SlackChannelCursor,
        ts: String?,
    ) {
        if (cursor.advanceTo(ts)) {
            slackChannelCursorRepository.save(cursor)
        }
    }

    private fun channelOf(processLink: PluginProcessLink): String? {
        val properties = processLink.actionProperties ?: return null
        val channel =
            try {
                objectMapper.treeToValue(properties, ReceiveMessageProperties::class.java).channel
            } catch (e: Exception) {
                logger.warn(e) {
                    "Could not read the properties of the receive-message link on activity " +
                        "'${processLink.activityId}' of process definition '${processLink.processDefinitionId}'"
                }
                null
            }

        if (channel.isNullOrBlank()) {
            logger.warn {
                "Ignoring the receive-message link on activity '${processLink.activityId}' of process definition " +
                    "'${processLink.processDefinitionId}': it names no channel, and there is nothing to read " +
                    "without one."
            }
            return null
        }
        return channel
    }

    /**
     * Prunes claim rows no channel can still produce.
     *
     * Without this the table grows for the lifetime of the installation. The channel cursors
     * are left alone: they are one row per channel, and deleting one would send that channel
     * back to reading from `initialLookback` — which, unlike a stale claim row, is a
     * behaviour change rather than a cleanup.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Scheduled(cron = "\${valtimo.slack.retention-cron:0 30 3 * * *}")
    @SchedulerLock(name = "slackPruneProcessedMessages", lockAtLeastFor = "PT5S", lockAtMostFor = "PT60M")
    open fun pruneProcessedMessages() {
        val before = Instant.now().minus(retentionDays, ChronoUnit.DAYS)
        val deleted = processedSlackMessageRepository.deleteProcessedBefore(before)
        if (deleted > 0) {
            logger.info { "Pruned $deleted processed Slack message row(s) older than $retentionDays day(s)" }
        }
    }

    private data class PollOutcome(
        val handled: Int,
        val skipped: Int,
        val failed: Int,
        /** How far the cursor may safely move: the newest message before the first failure. */
        val resumeFrom: String?,
    )

    companion object {
        private val logger = KotlinLogging.logger {}

        const val RECEIVE_MESSAGE_ACTION = "receive-message"
    }
}
