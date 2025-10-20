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

package com.ritense.valtimoplugins.`valtimo-llm`.autoconfiguration

import com.ritense.document.service.impl.JsonSchemaDocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.`valtimo-llm`.client.ValtimoLlmSummaryModel
import com.ritense.valtimoplugins.`valtimo-llm`.client.ValtimoLlmTextGenerationModel
import com.ritense.valtimoplugins.`valtimo-llm`.plugin.ValtimoLlmPluginFactory
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class ValtimoLlmAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(ValtimoLlmSummaryModel::class)
    fun MistralSummaryModel(
        restClientBuilder: RestClient.Builder
    ) = ValtimoLlmSummaryModel(
        restClientBuilder, null, null
    )

    @Bean
    @ConditionalOnMissingBean(ValtimoLlmTextGenerationModel::class)
    fun MistralTextGenerationModel(
        restClientBuilder: RestClient.Builder
    ) = ValtimoLlmTextGenerationModel(
        restClientBuilder, null, null
    )


    @Bean
    @ConditionalOnMissingBean(ValtimoLlmPluginFactory::class)
    fun mistralPluginFactory(
        pluginService: PluginService,
        valtimoLlmSummaryModel: ValtimoLlmSummaryModel,
        valtimoLlmTextGenerationModel: ValtimoLlmTextGenerationModel,
        documentService: JsonSchemaDocumentService,
    ) = ValtimoLlmPluginFactory(
        pluginService,
        valtimoLlmSummaryModel,
        valtimoLlmTextGenerationModel,
        documentService,
    )

}
