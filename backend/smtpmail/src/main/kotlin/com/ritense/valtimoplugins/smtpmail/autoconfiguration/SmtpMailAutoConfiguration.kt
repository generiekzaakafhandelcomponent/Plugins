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

package com.ritense.valtimoplugins.smtpmail.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.smtpmail.client.SmtpMailClient
import com.ritense.valtimoplugins.smtpmail.plugin.SmtpMailPluginFactory
import com.ritense.valtimoplugins.smtpmail.service.SmtpMailService
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SmtpMailAutoConfiguration {
    @Bean
    fun smtpMailClient(storageService: TemporaryResourceStorageService): SmtpMailClient =
        SmtpMailClient(
            storageService = storageService,
        )

    @Bean
    fun smtpMailService(
        smtpMailClient: SmtpMailClient,
        storageService: TemporaryResourceStorageService,
    ): SmtpMailService =
        SmtpMailService(
            smtpMailClient = smtpMailClient,
            storageService = storageService,
        )

    @Bean
    fun smtpMailPluginFactory(
        pluginService: PluginService,
        smtpMailService: SmtpMailService,
    ): SmtpMailPluginFactory =
        SmtpMailPluginFactory(
            pluginService = pluginService,
            smtpMailService = smtpMailService,
        )
}
