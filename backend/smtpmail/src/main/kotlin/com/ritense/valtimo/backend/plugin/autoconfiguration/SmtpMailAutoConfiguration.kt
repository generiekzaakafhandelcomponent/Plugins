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

package com.ritense.valtimo.backend.plugin.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.backend.plugin.client.SmtpMailClient
import com.ritense.valtimo.backend.plugin.plugin.SmtpMailPluginFactory
import com.ritense.valtimo.backend.plugin.service.SmtpMailService
import com.ritense.valueresolver.ValueResolverService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SmtpMailAutoConfiguration {

    @Bean
    fun smtpMailClient(
        pluginService: PluginService,
        storageService: TemporaryResourceStorageService,
    ): SmtpMailClient = SmtpMailClient(
        pluginService = pluginService,
        storageService = storageService
    )

    @Bean
    fun smtpMailService(
        smtpMailClient: SmtpMailClient,
        storageService: TemporaryResourceStorageService
    ): SmtpMailService = SmtpMailService(
        smtpMailClient = smtpMailClient,
        storageService = storageService
    )

    @Bean
    fun smtpMailPluginFactory(
        pluginService: PluginService,
        smtpMailService: SmtpMailService,
        valueResolverService: ValueResolverService
    ): SmtpMailPluginFactory = SmtpMailPluginFactory(
        pluginService = pluginService,
        smtpMailService = smtpMailService,
        valueResolverService = valueResolverService
    )
}