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

package com.ritense.valtimoplugins.coworker.client

import com.fasterxml.jackson.databind.ObjectMapper
import com.rabbitmq.client.AMQP
import com.rabbitmq.client.Connection
import com.ritense.valtimoplugins.coworker.domain.CloudEvent
import io.github.oshai.kotlinlogging.KotlinLogging

class CoworkerRabbitClient(
    private val objectMapper: ObjectMapper
) {

    fun publish(
        connection: Connection,
        exchange: String,
        routingKey: String,
        cloudEvent: CloudEvent<*>
    ) {
        val channel = connection.createChannel()
        try {
            val body = objectMapper.writeValueAsBytes(cloudEvent)
            val properties = AMQP.BasicProperties.Builder()
                .contentType("application/cloudevents+json")
                .messageId(cloudEvent.id)
                .build()

            channel.basicPublish(exchange, routingKey, properties, body)
            logger.debug { "Published CloudEvent ${cloudEvent.id} to exchange='$exchange', routingKey='$routingKey'" }
        } finally {
            channel.close()
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
