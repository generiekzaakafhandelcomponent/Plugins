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

package com.ritense.valtimoplugins.docsys.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.docsys.client.DocsysClient
import com.ritense.valtimoplugins.docsys.plugin.DocsysPluginFactory
import com.ritense.valueresolver.ValueResolverService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class DocsysAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(DocsysClient::class)
    fun createDocsysClient(
        restClientBuilder: RestClient.Builder,
    ): DocsysClient {
        return DocsysClient(restClientBuilder)
    }

    @Bean
    @ConditionalOnMissingBean(DocsysPluginFactory::class)
    fun createDocsysPluginFactory(
        pluginService: PluginService,
        DocsysClient: DocsysClient,
        valueResolver: ValueResolverService,
        storageService: TemporaryResourceStorageService,
    ): DocsysPluginFactory {
        return DocsysPluginFactory(pluginService, DocsysClient, valueResolver, storageService)
    }

}
