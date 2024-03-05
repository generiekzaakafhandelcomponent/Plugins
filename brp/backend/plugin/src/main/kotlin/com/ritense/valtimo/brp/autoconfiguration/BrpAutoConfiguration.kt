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

package com.ritense.valtimo.brp.autoconfiguration

import com.ritense.plugin.service.PluginService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.context.annotation.Bean
import com.ritense.valtimo.brp.plugin.BrpPluginFactory
import com.ritense.valtimo.brp.service.BrpService
import com.ritense.valtimo.brp.client.HaalCentraalBrpClient

@AutoConfiguration
class BrpAutoConfiguration {
    @Bean
    fun haalCentraalBrpClient(
    ): HaalCentraalBrpClient = HaalCentraalBrpClient(

    )

    @Bean
    fun brpService(
    ): BrpService = BrpService(
    )

    @Bean
    fun smtpMailPluginFactory(
        pluginService: PluginService,
    ): BrpPluginFactory = BrpPluginFactory(
        pluginService = pluginService,
    )
}
