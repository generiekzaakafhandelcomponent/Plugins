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

package com.ritense.valtimoplugins.coworker.listener

import com.fasterxml.jackson.databind.ObjectMapper
import com.rabbitmq.client.CancelCallback
import com.rabbitmq.client.Channel
import com.rabbitmq.client.Connection
import com.rabbitmq.client.DeliverCallback
import com.ritense.valtimoplugins.coworker.domain.CloudEvent
import com.ritense.valtimoplugins.coworker.domain.CoworkerResponseData
import io.github.oshai.kotlinlogging.KotlinLogging
import org.operaton.bpm.engine.RuntimeService
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

class CoworkerResponseListener(
    private val runtimeService: RuntimeService,
    private val objectMapper: ObjectMapper
) {

    private val activeConsumers = ConcurrentHashMap<UUID, ConsumerRegistration>()

    private data class ConsumerRegistration(
        val channel: Channel,
        val consumerTag: String
    )

    fun startListening(pluginConfigurationId: UUID, connection: Connection, queueName: String) {
        if (activeConsumers.containsKey(pluginConfigurationId)) {
            logger.info { "Listener already active for config $pluginConfigurationId on queue $queueName" }
            return
        }

        val channel = connection.createChannel()
        // Declare queue (idempotent) to ensure it exists
        channel.queueDeclare(queueName, true, false, false, null)

        val deliverCallback = DeliverCallback { _, delivery ->
            try {
                val responseEvent = objectMapper.readValue(
                    delivery.body,
                    objectMapper.typeFactory.constructParametricType(
                        CloudEvent::class.java,
                        CoworkerResponseData::class.java
                    )
                ) as CloudEvent<CoworkerResponseData>

                val responseData = responseEvent.data
                logger.info {
                    "Received coworker response for correlationId=${responseData.correlationId}, " +
                        "success=${responseData.success}"
                }

                correlateToProcess(responseData)
                channel.basicAck(delivery.envelope.deliveryTag, false)
            } catch (e: Exception) {
                logger.error(e) { "Failed to process coworker response" }
                // Nack without requeue to prevent infinite retry loops
                channel.basicNack(delivery.envelope.deliveryTag, false, false)
            }
        }

        val cancelCallback = CancelCallback { consumerTag ->
            logger.warn { "Consumer $consumerTag was cancelled for config $pluginConfigurationId" }
            activeConsumers.remove(pluginConfigurationId)
        }

        // prefetch=1 for fair dispatch
        channel.basicQos(1)
        val consumerTag = channel.basicConsume(queueName, false, deliverCallback, cancelCallback)
        activeConsumers[pluginConfigurationId] = ConsumerRegistration(channel, consumerTag)
        logger.info { "Started listening on queue $queueName for config $pluginConfigurationId" }
    }

    fun stopListening(pluginConfigurationId: UUID) {
        activeConsumers.remove(pluginConfigurationId)?.let { registration ->
            try {
                registration.channel.basicCancel(registration.consumerTag)
                registration.channel.close()
            } catch (e: Exception) {
                logger.warn(e) { "Error stopping listener for $pluginConfigurationId" }
            }
            logger.info { "Stopped listening for config $pluginConfigurationId" }
        }
    }

    private fun correlateToProcess(responseData: CoworkerResponseData) {
        val variables = mutableMapOf<String, Any?>(
            "coworkerResponseSuccess" to responseData.success,
            "coworkerResponseContent" to responseData.content,
            "coworkerResponseSessionId" to responseData.sessionId
        )

        if (!responseData.success) {
            variables["coworkerResponseError"] = responseData.error
        }

        try {
            runtimeService
                .createMessageCorrelation(BPMN_MESSAGE_NAME)
                .processInstanceVariableEquals(
                    CORRELATION_VARIABLE_NAME,
                    responseData.correlationId
                )
                .setVariables(variables)
                .correlate()

            logger.info {
                "Correlated coworker response to process with " +
                    "correlationId=${responseData.correlationId}"
            }
        } catch (e: Exception) {
            logger.error(e) {
                "Failed to correlate message for correlationId=${responseData.correlationId}. " +
                    "No matching process instance found waiting for this message."
            }
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
        const val BPMN_MESSAGE_NAME = "RabbitResponseReceived"
        const val CORRELATION_VARIABLE_NAME = "coworkerCorrelationId"
    }
}
