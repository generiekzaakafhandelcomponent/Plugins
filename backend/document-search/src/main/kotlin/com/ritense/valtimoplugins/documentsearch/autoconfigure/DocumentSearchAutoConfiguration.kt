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


package com.ritense.valtimoplugins.documentsearch.autoconfigure

import com.ritense.document.service.DocumentSearchService
import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.documentsearch.plugin.DocumentSearchPluginFactory
import com.ritense.valtimoplugins.documentsearch.service.DocumentSearchPluginService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class DocumentSearchAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(DocumentSearchPluginService::class)
    fun documentSearchPluginService(
        documentSearchService: DocumentSearchService,
    ): DocumentSearchPluginService {
        return DocumentSearchPluginService(
            documentSearchService
        )
    }

    @Bean
    @ConditionalOnMissingBean(DocumentSearchPluginFactory::class)
    fun documentSearchPluginFactory(
        pluginService: PluginService,
        documentService: DocumentService,
        documentSearchPluginService: DocumentSearchPluginService,
    ): DocumentSearchPluginFactory {
        return DocumentSearchPluginFactory(
            pluginService,
            documentService,
            documentSearchPluginService,
        )
    }
}
