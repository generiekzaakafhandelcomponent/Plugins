/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.notifynl.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.notifynl.client.NotifyNlClient
import com.ritense.valtimoplugins.notifynl.plugin.NotifyNlPluginFactory
import com.ritense.valtimoplugins.notifynl.service.NotifyNlTokenGenerationService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class NotifyNlAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(NotifyNlClient::class)
    fun notifyNlClient(
        restClientBuilder: RestClient.Builder
    ): NotifyNlClient {
        return NotifyNlClient(restClientBuilder)
    }

    @Bean
    @ConditionalOnMissingBean(NotifyNlTokenGenerationService::class)
    fun notifyNlTokenGenerationService() : NotifyNlTokenGenerationService {
        return NotifyNlTokenGenerationService()
    }

    @Bean
    @ConditionalOnMissingBean(NotifyNlPluginFactory::class)
    fun notifyNlPluginFactory(
        pluginService: PluginService,
        notifyNlClient: NotifyNlClient,
        tokenGenerationService: NotifyNlTokenGenerationService,
    ): NotifyNlPluginFactory {
        return NotifyNlPluginFactory(pluginService, notifyNlClient, tokenGenerationService)
    }
}