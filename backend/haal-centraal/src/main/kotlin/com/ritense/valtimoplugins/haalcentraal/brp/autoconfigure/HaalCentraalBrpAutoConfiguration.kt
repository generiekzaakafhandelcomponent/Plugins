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
 *
 */

package com.ritense.valtimoplugins.haalcentraal.brp.autoconfigure

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraal.brp.client.HaalCentraalBrpRestClient
import com.ritense.valtimoplugins.haalcentraal.brp.client.HcBrpClient
import com.ritense.valtimoplugins.haalcentraal.brp.plugin.HaalCentraalBrpPluginFactory
import com.ritense.valtimoplugins.haalcentraal.brp.service.HaalCentraalBrpService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class HaalCentraalBrpAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(HaalCentraalBrpRestClient::class)
    fun haalCentraalBrpRestClient(
        restClientBuilder: RestClient.Builder,
    ): HaalCentraalBrpRestClient {
        return HaalCentraalBrpRestClient(restClientBuilder)
    }

    @Bean
    @ConditionalOnMissingBean(HcBrpClient::class)
    fun hcBrpClient(
        haalCentraalBrpRestClient: HaalCentraalBrpRestClient
    ): HcBrpClient {
        return HcBrpClient(haalCentraalBrpRestClient)
    }

    @Bean
    @ConditionalOnMissingBean(HaalCentraalBrpService::class)
    fun haalCentraalBrpService(
        hcBrpClient: HcBrpClient
    ): HaalCentraalBrpService {
        return HaalCentraalBrpService(hcBrpClient)
    }

    @Bean
    @ConditionalOnMissingBean(HaalCentraalBrpPluginFactory::class)
    fun haalCentraalBrpPluginFactory(
        haalCentraalBrpService: HaalCentraalBrpService,
        pluginService: PluginService
    ): HaalCentraalBrpPluginFactory {
        return HaalCentraalBrpPluginFactory(
            haalCentraalBrpService,
            pluginService
        )
    }
}
