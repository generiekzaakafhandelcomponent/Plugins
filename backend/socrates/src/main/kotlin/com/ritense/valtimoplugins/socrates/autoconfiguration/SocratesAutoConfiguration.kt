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

package com.ritense.valtimoplugins.socrates.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.socrates.client.SocratesClient
import com.ritense.valtimoplugins.socrates.client.socratesClient
import com.ritense.valtimoplugins.socrates.plugin.SocratesPluginFactory
import com.ritense.valtimoplugins.socrates.plugin.socratesPluginFactory
import com.ritense.valueresolver.ValueResolverService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class socratesAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(SocratesClient::class)
    fun createSocratesClient(
        restClientBuilder: RestClient.Builder,
    ): SocratesClient {
        return SocratesClient(restClientBuilder)
    }

    @Bean
    @ConditionalOnMissingBean(SocratesPluginFactory::class)
    fun createsocratesPluginFactory(
        pluginService: PluginService,
        socratesClient: SocratesClient,
        valueResolver: ValueResolverService,
    ): SocratesPluginFactory {
        return SocratesPluginFactory(pluginService, socratesClient, valueResolver)
    }

}
