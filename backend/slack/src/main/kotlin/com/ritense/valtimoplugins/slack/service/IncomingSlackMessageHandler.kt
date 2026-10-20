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
import com.ritense.authorization.annotation.RunWithoutAuthorization
import com.ritense.plugin.domain.PluginProcessLink
import com.ritense.valtimoplugins.slack.domain.ProcessedSlackMessage
import com.ritense.valtimoplugins.slack.domain.ReceiveMessageProperties
import com.ritense.valtimoplugins.slack.domain.SlackMessage
import com.ritense.valtimoplugins.slack.repository.ProcessedSlackMessageRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional
import java.nio.charset.StandardCharsets
import java.security.MessageDigest

/**
 * Handles one incoming Slack message in one transaction: claim it, then start the process.
 *
 * A separate bean from [SlackMessagePollingService] rather than a method on it, because the
 * transaction and authorization advice are applied by a proxy — a call from the polling loop
 * to a method on its own instance would silently bypass both, and every message would be
 * claimed and started outside a transaction.
 *
 * Both steps share one transaction, so a process that fails to start also releases the claim
 * and the message is retried on the next poll. Committing the claim first would be the other
 * trade-off: no retry, and a message lost to a transient failure stays lost.
 */
open class IncomingSlackMessageHandler(
    private val processedSlackMessageRepository: ProcessedSlackMessageRepository,
    private val slackMessageProcessStarter: SlackMessageProcessStarter,
    private val objectMapper: ObjectMapper,
) {
    /**
     * Returns `true` when a process was started or resumed, `false` when nothing matched.
     *
     * Throws when the message has already been handled — the primary key on
     * `slack_processed_message` is what makes two nodes polling the same channel safe, and
     * the violation has to escape this method for the transaction to roll back cleanly. The
     * caller is expected to treat it as a duplicate rather than a failure.
     */
    @RunWithoutAuthorization
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    open fun handle(
        message: SlackMessage,
        pluginConfigurationId: String,
        processLinks: List<PluginProcessLink>,
    ): Boolean {
        val key = claimKey(pluginConfigurationId, message.identity)

        if (processedSlackMessageRepository.existsById(key)) {
            logger.debug {
                "Message '${message.identity}' was already handled for configuration '$pluginConfigurationId'; skipping"
            }
            return false
        }

        // Flushed rather than left to commit so that a concurrent claim from another node
        // fails here, before a case is created.
        processedSlackMessageRepository.saveAndFlush(
            ProcessedSlackMessage(
                messageIdentity = key,
                pluginConfigurationId = pluginConfigurationId,
                channel = message.channel,
                messageTs = message.ts,
            ),
        )

        val matching = processLinks.filter { matches(it, message) }

        if (matching.isEmpty()) {
            logger.debug {
                "Message '${message.identity}' from '${message.userId ?: message.botId}' matched no " +
                    "receive-message process link"
            }
            return false
        }

        // A started instance for any link is enough to call the message handled. The links
        // are independent: one may be a message start event that always fires, another a
        // catch event that only fires when something is waiting for it.
        val started = matching.map { slackMessageProcessStarter.start(it, message) }.any { it }

        if (started) {
            logger.info {
                "Started ${matching.size} process link(s) for Slack message '${message.identity}' " +
                    "from '${message.userId ?: message.botId}'"
            }
        } else {
            logger.debug {
                "Message '${message.identity}' matched ${matching.size} process link(s), none of which had " +
                    "anything to start"
            }
        }
        return started
    }

    private fun matches(
        processLink: PluginProcessLink,
        message: SlackMessage,
    ): Boolean {
        // Unlike the mail plugin, a link without properties matches nothing: the channel to
        // read lives in those properties, so their absence means the link names no channel.
        val properties = processLink.actionProperties ?: return false
        val filter =
            try {
                objectMapper.treeToValue(properties, ReceiveMessageProperties::class.java)
            } catch (e: Exception) {
                logger.warn(e) {
                    "Could not read the filter of the receive-message link on activity '${processLink.activityId}' " +
                        "of process definition '${processLink.processDefinitionId}'; ignoring the link"
                }
                return false
            }
        return filter.matches(message)
    }

    private fun claimKey(
        pluginConfigurationId: String,
        identity: String,
    ): String {
        // Scoped per configuration: two configurations may legitimately watch the same
        // channel on behalf of different processes, and each should get its own case.
        val key = "$pluginConfigurationId|$identity"
        if (key.length <= MAX_IDENTITY_LENGTH) return key

        // Truncating would map two long, distinct identities onto one key and silently drop
        // the second message as a duplicate. A digest keeps them distinct.
        val digest =
            MessageDigest
                .getInstance("SHA-256")
                .digest(key.toByteArray(StandardCharsets.UTF_8))
                .joinToString("") { "%02x".format(it) }
        return "$pluginConfigurationId|sha256:$digest"
    }

    private companion object {
        private val logger = KotlinLogging.logger {}

        /** Matches the `message_identity` column width. */
        private const val MAX_IDENTITY_LENGTH = 512
    }
}
