/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-document-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimoplugins.freemarker.plugin.documentgenerator

import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.freemarker.plugin.web.rest.DocumentGeneratorResource
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class DocumentGeneratorAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(DocumentGeneratorPluginFactory::class)
    fun documentGeneratorPluginFactory(
        pluginService: PluginService,
        templateService: TemplateService,
        processDocumentService: ProcessDocumentService,
        storageService: TemporaryResourceStorageService,
    ): DocumentGeneratorPluginFactory {
        return DocumentGeneratorPluginFactory(
            pluginService,
            templateService,
            processDocumentService,
            storageService,
        )
    }

    @Bean
    @ConditionalOnMissingBean(DocumentGeneratorResource::class)
    fun documentGeneratorResource(
        templateService: TemplateService,
        pluginService: PluginService,
    ): DocumentGeneratorResource {
        return DocumentGeneratorResource(
            templateService,
            pluginService,
        )
    }

}
