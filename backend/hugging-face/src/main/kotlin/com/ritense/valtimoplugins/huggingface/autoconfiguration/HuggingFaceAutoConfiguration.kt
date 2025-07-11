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

package com.ritense.valtimoplugins.huggingface.autoconfiguration

import com.ritense.document.service.impl.JsonSchemaDocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.huggingface.client.HuggingFaceSummaryModel
import com.ritense.valtimoplugins.huggingface.client.HuggingFaceTextGenerationModel
import com.ritense.valtimoplugins.huggingface.plugin.HuggingFacePluginFactory
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class HuggingFaceAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(HuggingFaceSummaryModel::class)
    fun HuggingFaceSummaryModel(
        restClientBuilder: RestClient.Builder
    ) = HuggingFaceSummaryModel(
        restClientBuilder, null, null
    )

    @Bean
    @ConditionalOnMissingBean(HuggingFaceTextGenerationModel::class)
    fun HuggingFaceTextGenerationModel(
        restClientBuilder: RestClient.Builder
    ) = HuggingFaceTextGenerationModel(
        restClientBuilder, null, null
    )


    @Bean
    @ConditionalOnMissingBean(HuggingFacePluginFactory::class)
    fun huggingFacePluginFactory(
        pluginService: PluginService,
        huggingFaceSummaryModel: HuggingFaceSummaryModel,
        huggingFaceTextGenerationModel: HuggingFaceTextGenerationModel,
        documentService: JsonSchemaDocumentService,
    ) = HuggingFacePluginFactory(
        pluginService,
        huggingFaceSummaryModel,
        huggingFaceTextGenerationModel,
        documentService,
    )

}
