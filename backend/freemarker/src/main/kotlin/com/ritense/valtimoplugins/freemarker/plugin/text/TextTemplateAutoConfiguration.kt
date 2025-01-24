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

package com.ritense.valtimoplugins.freemarker.plugin.text

import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class TextTemplateAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(TextTemplatePluginFactory::class)
    fun textTemplatePluginFactory(
        pluginService: PluginService,
        templateService: TemplateService,
        processDocumentService: ProcessDocumentService,
        storageService: TemporaryResourceStorageService,
    ): TextTemplatePluginFactory {
        return TextTemplatePluginFactory(
            pluginService,
            templateService,
            processDocumentService,
            storageService,
        )
    }

    @Bean
    @ConditionalOnMissingBean(TextTemplateValueResolver::class)
    fun textTemplateValueResolver(
        templateService: TemplateService,
        processDocumentService: ProcessDocumentService,
        documentService: DocumentService,
    ): TextTemplateValueResolver {
        return TextTemplateValueResolver(
            templateService,
            processDocumentService,
            documentService,
        )
    }

}
