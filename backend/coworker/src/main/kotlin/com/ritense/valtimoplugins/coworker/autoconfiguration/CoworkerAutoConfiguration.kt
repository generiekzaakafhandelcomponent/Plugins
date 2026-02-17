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

package com.ritense.valtimoplugins.coworker.autoconfiguration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.plugin.service.PluginConfigurationSearchParameters
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.coworker.client.CoworkerConnectionManager
import com.ritense.valtimoplugins.coworker.client.CoworkerRabbitClient
import com.ritense.valtimoplugins.coworker.listener.CoworkerResponseListener
import com.ritense.valtimoplugins.coworker.plugin.CoworkerPlugin
import com.ritense.valtimoplugins.coworker.plugin.CoworkerPluginFactory
import io.github.oshai.kotlinlogging.KotlinLogging
import org.operaton.bpm.engine.RuntimeService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.ApplicationListener
import org.springframework.context.annotation.Bean
import java.util.UUID

@AutoConfiguration
class CoworkerAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(CoworkerConnectionManager::class)
    fun coworkerConnectionManager(): CoworkerConnectionManager {
        return CoworkerConnectionManager()
    }

    @Bean
    @ConditionalOnMissingBean(CoworkerRabbitClient::class)
    fun coworkerRabbitClient(
        objectMapper: ObjectMapper
    ): CoworkerRabbitClient {
        return CoworkerRabbitClient(objectMapper)
    }

    @Bean
    @ConditionalOnMissingBean(CoworkerResponseListener::class)
    fun coworkerResponseListener(
        runtimeService: RuntimeService,
        objectMapper: ObjectMapper
    ): CoworkerResponseListener {
        return CoworkerResponseListener(runtimeService, objectMapper)
    }

    @Bean
    @ConditionalOnMissingBean(CoworkerPluginFactory::class)
    fun coworkerPluginFactory(
        pluginService: PluginService,
        rabbitClient: CoworkerRabbitClient,
        connectionManager: CoworkerConnectionManager,
        responseListener: CoworkerResponseListener,
        objectMapper: ObjectMapper,
    ): CoworkerPluginFactory {
        return CoworkerPluginFactory(
            pluginService, rabbitClient, connectionManager, responseListener, objectMapper
        )
    }

    /**
     * On application startup, restore RabbitMQ listeners for all existing
     * Coworker plugin configurations. This ensures responses are received
     * even after an application restart while processes are waiting.
     */
    @Bean
    fun coworkerStartupListener(
        pluginService: PluginService,
        connectionManager: CoworkerConnectionManager,
        responseListener: CoworkerResponseListener
    ): ApplicationListener<ApplicationReadyEvent> {
        return ApplicationListener {
            try {
                val searchParams = PluginConfigurationSearchParameters(
                    pluginDefinitionKey = "coworker"
                )
                val configs = pluginService.getPluginConfigurations(searchParams)

                configs.forEach { config ->
                    try {
                        // Use createInstance to get properly decrypted properties
                        val plugin = pluginService.createInstance(config) as? CoworkerPlugin
                        if (plugin != null) {
                            val configId = UUID.nameUUIDFromBytes(
                                "${plugin.rabbitHost}:${plugin.rabbitPort}:${plugin.rabbitVirtualHost}:${plugin.replyToQueue}".toByteArray()
                            )
                            val connection = connectionManager.getOrCreateConnection(
                                configId,
                                plugin.rabbitHost,
                                plugin.rabbitPort,
                                plugin.rabbitUsername,
                                plugin.rabbitPassword,
                                plugin.rabbitVirtualHost
                            )
                            responseListener.startListening(configId, connection, plugin.replyToQueue)
                            logger.info { "Restored listener for coworker plugin config ${config.id}" }
                        }
                    } catch (e: Exception) {
                        logger.error(e) { "Failed to restore listener for coworker plugin config ${config.id}" }
                    }
                }
            } catch (e: Exception) {
                logger.warn(e) { "Failed to restore coworker plugin listeners on startup" }
            }
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
