/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.ritense.valtimo.berkelybridge.plugin

import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.berkelybridge.client.BerkelyBridgeClient
import com.ritense.valueresolver.ValueResolverService
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient
import org.apache.hc.client5.http.impl.classic.HttpClients
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.web.client.RestTemplate

@Configuration
class BerkelyBridgeAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(BerkelyBridgePluginFactory::class)
    fun createBerkelyBridgePluginFactory(
        pluginService: PluginService,
        bbClient: BerkelyBridgeClient,
        valueResolver: ValueResolverService,
    ): BerkelyBridgePluginFactory {
        return BerkelyBridgePluginFactory(pluginService, bbClient, valueResolver)
    }

    @Bean
    @ConditionalOnMissingBean(BerkelyBridgeClient::class)
    fun createBerkelyBridgeClient(
        restTemplate: RestTemplate,
        publisher: ApplicationEventPublisher
    ): BerkelyBridgeClient {
        return BerkelyBridgeClient(restTemplate, publisher)
    }

    @Bean
    @ConditionalOnMissingBean(RestTemplate::class)
    fun createRestTemplate(): RestTemplate {
        val httpClient: CloseableHttpClient =
            HttpClients.custom()
                // for internal network use only
                //.setSSLHostnameVerifier(NoopHostnameVerifier())
                .build()

        val requestFactory = HttpComponentsClientHttpRequestFactory()
        requestFactory.httpClient = httpClient

        return RestTemplate(requestFactory)
    }
}
