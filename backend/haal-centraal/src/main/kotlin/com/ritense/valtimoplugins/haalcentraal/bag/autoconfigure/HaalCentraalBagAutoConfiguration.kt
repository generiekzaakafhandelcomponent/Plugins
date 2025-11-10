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

package com.ritense.valtimoplugins.haalcentraal.bag.autoconfigure

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraal.bag.client.HaalCentraalBagClient
import com.ritense.valtimoplugins.haalcentraal.bag.plugin.HaalCentraalBagPluginFactory
import com.ritense.valtimoplugins.haalcentraal.bag.service.HaalCentraalBagService
import com.ritense.valtimoplugins.haalcentraal.shared.HaalCentraalWebClient
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class HaalCentraalBagAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(HaalCentraalBagClient::class)
    fun haalCentraalBagClient(
        haalCentraalWebClient: HaalCentraalWebClient
    ): HaalCentraalBagClient = HaalCentraalBagClient(haalCentraalWebClient)

    @Bean
    @ConditionalOnMissingBean(HaalCentraalBagService::class)
    fun haalCentraalBagService(
        haalCentraalBagClient: HaalCentraalBagClient
    ): HaalCentraalBagService {
        return HaalCentraalBagService(haalCentraalBagClient)
    }

    @Bean
    @ConditionalOnMissingBean(HaalCentraalBagPluginFactory::class)
    fun haalCentraalBagPluginFactory(
        haalCentraalBagService: HaalCentraalBagService,
        pluginService: PluginService
    ): HaalCentraalBagPluginFactory {
        return HaalCentraalBagPluginFactory(
            haalCentraalBagService,
            pluginService
        )
    }
}
