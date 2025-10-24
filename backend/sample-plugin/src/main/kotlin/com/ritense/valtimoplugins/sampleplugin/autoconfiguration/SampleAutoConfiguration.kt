package com.ritense.valtimoplugins.sampleplugin.autoconfiguration

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

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.sampleplugin.client.SampleClient
import com.ritense.valtimoplugins.sampleplugin.client.SampleService
import com.ritense.valtimoplugins.sampleplugin.plugin.SamplePluginFactory
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class SampleAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(SampleClient::class)
    fun sampleClient(
        restClientBuilder: RestClient,
    ): SampleClient {
        return SampleClient(restClientBuilder)
    }

    @Bean
    @ConditionalOnMissingBean(SamplePluginFactory::class)
    fun samplePluginFactory(
        pluginService: PluginService,
        sampleService: SampleService,
    ): SamplePluginFactory {
        return SamplePluginFactory(pluginService, sampleService)
    }

}
