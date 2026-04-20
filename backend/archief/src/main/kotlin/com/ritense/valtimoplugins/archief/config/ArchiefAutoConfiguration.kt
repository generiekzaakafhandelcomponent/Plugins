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
*/

package com.ritense.valtimoplugins.archief.config

import com.ritense.valtimoplugins.archief.ArchiefPluginEventListener
import com.ritense.valtimoplugins.archief.ArchiefPluginFactory
import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentAssociationService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.zakenapi.repository.ZaakInstanceLinkRepository
import org.operaton.bpm.engine.RepositoryService
import org.operaton.bpm.engine.RuntimeService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class ArchiefAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(ArchiefPluginFactory::class)
    fun archiefPluginFactory(
        pluginService: PluginService,
        documentService: DocumentService,
        zaakInstanceLinkRepository: ZaakInstanceLinkRepository,
        processDocumentAssociationService: ProcessDocumentAssociationService,
        processDocumentService: ProcessDocumentService,
        repositoryService: RepositoryService,
        jdbcTemplate: JdbcTemplate,
    ): ArchiefPluginFactory {
        return ArchiefPluginFactory(
            pluginService,
            documentService,
            zaakInstanceLinkRepository,
            processDocumentAssociationService,
            processDocumentService,
            repositoryService,
            jdbcTemplate,
        )
    }

    @Bean
    @ConditionalOnMissingBean(ArchiefPluginEventListener::class)
    fun archiefPluginEventListener(
        pluginService: PluginService,
        runtimeService: RuntimeService,
    ): ArchiefPluginEventListener {
        return ArchiefPluginEventListener(
            pluginService,
            runtimeService,
        )
    }
}
