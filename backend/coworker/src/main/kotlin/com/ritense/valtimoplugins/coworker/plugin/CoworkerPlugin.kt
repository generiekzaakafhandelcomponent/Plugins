/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.coworker.plugin

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.coworker.client.CoworkerConnectionManager
import com.ritense.valtimoplugins.coworker.client.CoworkerRabbitClient
import com.ritense.valtimoplugins.coworker.domain.CloudEvent
import com.ritense.valtimoplugins.coworker.domain.CoworkerRequestData
import com.ritense.valtimoplugins.coworker.listener.CoworkerResponseListener
import io.github.oshai.kotlinlogging.KotlinLogging
import org.operaton.bpm.engine.delegate.DelegateExecution
import java.util.UUID

@Plugin(
    key = "coworker",
    title = "Coworker Plugin",
    description = "Send messages to a Coworker Service via RabbitMQ using CloudEvents NL GOV 1.1"
)
open class CoworkerPlugin(
    private val rabbitClient: CoworkerRabbitClient,
    private val connectionManager: CoworkerConnectionManager,
    private val responseListener: CoworkerResponseListener,
    private val objectMapper: ObjectMapper,
) {

    @PluginProperty(key = "rabbitHost", secret = false)
    lateinit var rabbitHost: String

    @PluginProperty(key = "rabbitPort", secret = false)
    var rabbitPort: Int = 5672

    @PluginProperty(key = "rabbitUsername", secret = false)
    lateinit var rabbitUsername: String

    @PluginProperty(key = "rabbitPassword", secret = true)
    lateinit var rabbitPassword: String

    @PluginProperty(key = "rabbitVirtualHost", secret = false)
    var rabbitVirtualHost: String = "/"

    @PluginProperty(key = "sourceUrn", secret = false)
    lateinit var sourceUrn: String

    @PluginProperty(key = "exchange", secret = false)
    var exchange: String = ""

    @PluginProperty(key = "routingKey", secret = false)
    lateinit var routingKey: String

    @PluginProperty(key = "replyToQueue", secret = false)
    lateinit var replyToQueue: String

    @PluginAction(
        key = "send-message",
        title = "Send message to Coworker",
        description = "Sends a CloudEvent message to a Coworker Service via RabbitMQ",
        activityTypes = [ActivityTypeWithEventName.INTERMEDIATE_MESSAGE_THROW_EVENT_START]
    )
    open fun sendMessage(
        execution: DelegateExecution,
        @PluginActionProperty coworkerId: String,
        @PluginActionProperty userPrompt: String,
        @PluginActionProperty expertiseId: String?,
        @PluginActionProperty expertiseInput: String?,
        @PluginActionProperty sessionId: String?,
        @PluginActionProperty callbackUrl: String?,
    ) {
        val correlationId = UUID.randomUUID().toString()

        // Store correlationId as process variable so the catch event can match
        execution.setVariable(CoworkerResponseListener.CORRELATION_VARIABLE_NAME, correlationId)

        val caseId = execution.processBusinessKey
            ?: execution.getVariable("caseId")?.toString()
            ?: throw IllegalStateException("No business key or caseId variable found")

        // Parse expertiseInput JSON string to Map if provided
        @Suppress("UNCHECKED_CAST")
        val parsedExpertiseInput: Map<String, Any>? = expertiseInput?.takeIf { it.isNotBlank() }?.let {
            objectMapper.readValue(it, Map::class.java) as Map<String, Any>
        }

        val requestData = CoworkerRequestData(
            coworkerId = coworkerId,
            caseId = caseId,
            userPrompt = userPrompt,
            replyTo = replyToQueue,
            expertiseId = expertiseId?.takeIf { it.isNotBlank() },
            expertiseInput = parsedExpertiseInput,
            sessionId = sessionId?.takeIf { it.isNotBlank() },
            callbackUrl = callbackUrl?.takeIf { it.isNotBlank() }
        )

        val cloudEvent = CloudEvent(
            id = correlationId,
            source = sourceUrn,
            type = CLOUD_EVENT_TYPE_REQUEST,
            data = requestData
        )

        // Ensure connection and listener are active
        val configId = resolveConfigurationId()
        val connection = connectionManager.getOrCreateConnection(
            configId, rabbitHost, rabbitPort, rabbitUsername, rabbitPassword, rabbitVirtualHost
        )
        responseListener.startListening(configId, connection, replyToQueue)

        rabbitClient.publish(connection, exchange, routingKey, cloudEvent)

        logger.info {
            "Sent coworker message correlationId=$correlationId, " +
                "coworkerId=$coworkerId, caseId=$caseId"
        }
    }

    /**
     * Resolve a stable configuration ID based on connection properties.
     * Since the plugin framework creates new instances per action execution,
     * we derive a deterministic ID from the connection configuration.
     */
    private fun resolveConfigurationId(): UUID {
        val key = "$rabbitHost:$rabbitPort:$rabbitVirtualHost:$replyToQueue"
        return UUID.nameUUIDFromBytes(key.toByteArray())
    }

    companion object {
        private val logger = KotlinLogging.logger {}
        const val CLOUD_EVENT_TYPE_REQUEST = "nl.valtimo.coworker.chat-request"
    }
}
