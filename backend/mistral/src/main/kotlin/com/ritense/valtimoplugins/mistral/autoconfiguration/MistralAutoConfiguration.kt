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
 */

package com.ritense.valtimoplugins.mistral.autoconfiguration

import com.ritense.document.service.impl.JsonSchemaDocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.mistral.client.MistralSummaryModel
import com.ritense.valtimoplugins.mistral.client.MistralTextGenerationModel
import com.ritense.valtimoplugins.mistral.plugin.MistralPluginFactory
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class MistralAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(MistralSummaryModel::class)
    fun MistralSummaryModel(
        restClientBuilder: RestClient.Builder
    ) = MistralSummaryModel(
        restClientBuilder, null, null
    )

    @Bean
    @ConditionalOnMissingBean(MistralTextGenerationModel::class)
    fun MistralTextGenerationModel(
        restClientBuilder: RestClient.Builder
    ) = MistralTextGenerationModel(
        restClientBuilder, null, null
    )


    @Bean
    @ConditionalOnMissingBean(MistralPluginFactory::class)
    fun mistralPluginFactory(
        pluginService: PluginService,
        mistralSummaryModel: MistralSummaryModel,
        mistralTextGenerationModel: MistralTextGenerationModel,
        documentService: JsonSchemaDocumentService,
    ) = MistralPluginFactory(
        pluginService,
        mistralSummaryModel,
        mistralTextGenerationModel,
        documentService,
    )

}
