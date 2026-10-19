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

package com.ritense.valtimoplugins.slack.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.processlink.domain.ActivityTypeWithEventName.INTERMEDIATE_CATCH_EVENT_END
import com.ritense.processlink.domain.ActivityTypeWithEventName.MESSAGE_START_EVENT_START
import com.ritense.processlink.domain.ActivityTypeWithEventName.RECEIVE_TASK_END
import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.slack.client.SlackClient
import com.ritense.valtimoplugins.slack.domain.SlackConnectionProperties
import com.ritense.valtimoplugins.slack.domain.SlackMessage
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI
import java.time.Duration

@Plugin(
    key = "slack",
    title = "Slack Plugin",
    description = "Post messages to Slack, and start or continue a process when Slack is posted to",
)
open class SlackPlugin(
    private val slackClient: SlackClient,
    private val storageService: TemporaryResourceStorageService,
) {
    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "token", secret = true)
    lateinit var token: String

    /** Page size for reading a channel. Defaults to [DEFAULT_MESSAGES_PER_PAGE]. */
    @PluginProperty(key = "messagesPerPage", secret = false, required = false)
    var messagesPerPage: Int? = null

    @PluginProperty(key = "maxPagesPerPoll", secret = false, required = false)
    var maxPagesPerPoll: Int? = null

    @PluginProperty(key = "maxThreadsPerPoll", secret = false, required = false)
    var maxThreadsPerPoll: Int? = null

    /**
     * How many minutes of a channel's past the first poll considers. Everything older is
     * never read — see [com.ritense.valtimoplugins.slack.domain.SlackChannelCursor].
     */
    @PluginProperty(key = "initialLookbackMinutes", secret = false, required = false)
    var initialLookbackMinutes: Long? = null

    @PluginAction(
        key = "post-message",
        title = "Post message",
        description = "Sends a message to a Slack channel",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    open fun postMessage(
        execution: DelegateExecution,
        @PluginActionProperty channel: String,
        @PluginActionProperty message: String,
        @PluginActionProperty threadTs: String?,
    ) {
        val response =
            slackClient.chatPostMessage(
                connection = connectionProperties(),
                channel = channel,
                message = message,
                threadTs = threadTs?.takeIf { it.isNotBlank() },
            )

        // Recorded so the process can be continued by the answers to this message: a reply
        // reports the thread it belongs to, and `receive-message` matches that against these
        // variables to find the one case that is waiting for it. Without this the case would
        // have to be told its own thread by hand, and every reply would be a broadcast.
        response.ts?.let { ts ->
            execution.setVariable(SlackMessage.CHANNEL_VARIABLE, response.channel ?: channel)
            execution.setVariable(SlackMessage.MESSAGE_TS_VARIABLE, ts)
            // The thread of a reply is the message it answers; of a new message, itself.
            execution.setVariable(SlackMessage.THREAD_TS_VARIABLE, threadTs?.takeIf { it.isNotBlank() } ?: ts)
        }
    }

    @PluginAction(
        key = "post-message-with-file",
        title = "Post message with file",
        description = "Sends a message to a channel with a file",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    open fun postMessageWithFile(
        execution: DelegateExecution,
        @PluginActionProperty channels: String,
        @PluginActionProperty message: String?,
        @PluginActionProperty fileName: String?,
    ) {
        val resourceId =
            execution.getVariable(RESOURCE_ID_PROCESS_VAR) as String?
                ?: throw IllegalStateException(
                    "Failed to post slack message. No process variable '$RESOURCE_ID_PROCESS_VAR' found.",
                )
        val contentAsInputStream = storageService.getResourceContentAsInputStream(resourceId)
        val metadata = storageService.getResourceMetadata(resourceId)

        slackClient.filesUpload(
            connection = connectionProperties(),
            channels = channels,
            message = message,
            fileName = fileName ?: metadata[MetadataType.FILE_NAME.key] as String,
            file = contentAsInputStream,
        )
    }

    /**
     * Marks a BPMN element as the entry point for messages from a Slack channel.
     *
     * The action does no work of its own: it is a marker, recording that this channel should
     * start (or continue) that process, and
     * [com.ritense.valtimoplugins.slack.service.SlackMessagePollingService] finds those
     * markers when it polls. There is nothing to invoke synchronously, because a message
     * arrives when somebody types it, not when the process engine asks.
     *
     * Supported on a message start event (starts a new case per message) and on a receive
     * task or intermediate catch event (continues a case waiting for an answer in its
     * thread). The optional properties are a filter, which is what lets one channel feed
     * several processes: link each with a different filter and each sees only its own
     * messages.
     *
     * The token needs `channels:history` — plus `groups:history`, `im:history` or
     * `mpim:history` for the conversation types those cover — and the app has to be a member
     * of the channel.
     */
    @PluginAction(
        key = "receive-message",
        title = "Receive message",
        description = "Start or continue a process for each message posted in a Slack channel",
        activityTypes = [MESSAGE_START_EVENT_START, RECEIVE_TASK_END, INTERMEDIATE_CATCH_EVENT_END],
    )
    fun receiveMessage(
        @PluginActionProperty channel: String,
        @PluginActionProperty messageContains: String?,
        @PluginActionProperty userId: String?,
        @PluginActionProperty includeBotMessages: Boolean?,
        @PluginActionProperty threadScope: String?,
    ) {
        // Never invoked by the engine - see the documentation above. Logged rather than left
        // empty so that a call, which would mean the marker is wired up as something the
        // engine executes, is visible instead of silent.
        logger.debug {
            "receive-message marker reached for channel '$channel' (text='$messageContains', user='$userId', " +
                "bots=$includeBotMessages, threads='$threadScope')"
        }
    }

    /**
     * Resolves the configuration into the value object the client and poller work with,
     * applying defaults.
     *
     * Defaults live here rather than in the frontend so that a configuration created through
     * the API behaves identically to one created in the admin UI.
     */
    fun connectionProperties(): SlackConnectionProperties =
        SlackConnectionProperties(
            baseUri = url,
            token = token,
            messagesPerPage = messagesPerPage ?: DEFAULT_MESSAGES_PER_PAGE,
            maxPagesPerPoll = maxPagesPerPoll ?: DEFAULT_MAX_PAGES_PER_POLL,
            maxThreadsPerPoll = maxThreadsPerPoll ?: DEFAULT_MAX_THREADS_PER_POLL,
            initialLookback = Duration.ofMinutes(initialLookbackMinutes ?: DEFAULT_INITIAL_LOOKBACK_MINUTES),
        ).also { it.validate() }

    companion object {
        private val logger = KotlinLogging.logger {}

        const val PLUGIN_KEY = "slack"
        const val RESOURCE_ID_PROCESS_VAR = "resourceId"

        private const val DEFAULT_MESSAGES_PER_PAGE = 100
        private const val DEFAULT_MAX_PAGES_PER_POLL = 10
        private const val DEFAULT_MAX_THREADS_PER_POLL = 50

        /**
         * Long enough that a channel configured just after a message was posted still picks
         * it up, short enough that it cannot drag in a working day of unrelated chatter.
         */
        private const val DEFAULT_INITIAL_LOOKBACK_MINUTES = 15L
    }
}
