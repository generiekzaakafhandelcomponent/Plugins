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

import com.rabbitmq.client.Connection
import com.rabbitmq.client.ConnectionFactory
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap

class CoworkerConnectionManager {

    private val connections = ConcurrentHashMap<UUID, Connection>()

    fun getOrCreateConnection(
        pluginConfigurationId: UUID,
        host: String,
        port: Int,
        username: String,
        password: String,
        virtualHost: String
    ): Connection {
        return connections.computeIfAbsent(pluginConfigurationId) {
            logger.info { "Creating RabbitMQ connection for plugin config $pluginConfigurationId" }
            val factory = ConnectionFactory().apply {
                this.host = host
                this.port = port
                this.username = username
                this.password = password
                this.virtualHost = virtualHost
                this.isAutomaticRecoveryEnabled = true
                this.networkRecoveryInterval = 5000
            }
            factory.newConnection("coworker-plugin-$pluginConfigurationId")
        }
    }

    fun closeConnection(pluginConfigurationId: UUID) {
        connections.remove(pluginConfigurationId)?.let { connection ->
            logger.info { "Closing RabbitMQ connection for plugin config $pluginConfigurationId" }
            try {
                connection.close(5000)
            } catch (e: Exception) {
                logger.warn(e) { "Error closing RabbitMQ connection for $pluginConfigurationId" }
            }
        }
    }

    @PreDestroy
    fun closeAll() {
        logger.info { "Shutting down all RabbitMQ connections" }
        connections.keys.toList().forEach { closeConnection(it) }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
