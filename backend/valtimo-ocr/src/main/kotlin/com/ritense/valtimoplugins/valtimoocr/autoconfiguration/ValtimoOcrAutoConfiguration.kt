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

package com.ritense.valtimoplugins.valtimoocr.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.valtimoocr.client.MistralOCRModel
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient
import com.ritense.valtimoplugins.valtimoocr.plugin.ValtimoOcrPluginFactory

@AutoConfiguration
class ValtimoOcrAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(MistralOCRModel::class)
    fun mistralOCRModel(
        restClientBuilder: RestClient.Builder
    ) = MistralOCRModel(
        restClientBuilder, null, null
    )


    @Bean
    @ConditionalOnMissingBean(ValtimoOcrPluginFactory::class)
    fun docScannerPluginFactory(
        pluginService: PluginService,
        mistralOCRModel: MistralOCRModel,
    ) = ValtimoOcrPluginFactory(
        pluginService,
        mistralOCRModel
    )

}
