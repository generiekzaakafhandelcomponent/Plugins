/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.haalcentraal.brp.personen.autoconfigure

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraal.brp.personen.client.HcBrpPersonenClient
import com.ritense.valtimoplugins.haalcentraal.brp.personen.plugin.HaalCentraalBrpPersonenPluginFactory
import com.ritense.valtimoplugins.haalcentraal.brp.personen.service.HaalCentraalBrpPersonenService
import com.ritense.valtimoplugins.haalcentraal.shared.client.HaalCentraalRestClient
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class HaalCentraalBrpPersonenAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(HaalCentraalRestClient::class)
    fun haalCentraalRestClient(restClientBuilder: RestClient.Builder): HaalCentraalRestClient =
        HaalCentraalRestClient(restClientBuilder)

    @Bean
    @ConditionalOnMissingBean(HcBrpPersonenClient::class)
    fun hcBrpPersonenClient(haalCentraalRestClient: HaalCentraalRestClient): HcBrpPersonenClient =
        HcBrpPersonenClient(haalCentraalRestClient)

    @Bean
    @ConditionalOnMissingBean(HaalCentraalBrpPersonenService::class)
    fun haalCentraalBrpPersonenService(hcBrpPersonenClient: HcBrpPersonenClient): HaalCentraalBrpPersonenService =
        HaalCentraalBrpPersonenService(hcBrpPersonenClient)

    @Bean
    @ConditionalOnMissingBean(HaalCentraalBrpPersonenPluginFactory::class)
    fun haalCentraalBrpPersonenPluginFactory(
        haalCentraalBrpPersonenService: HaalCentraalBrpPersonenService,
        pluginService: PluginService,
    ): HaalCentraalBrpPersonenPluginFactory =
        HaalCentraalBrpPersonenPluginFactory(
            haalCentraalBrpPersonenService,
            pluginService,
        )
}
