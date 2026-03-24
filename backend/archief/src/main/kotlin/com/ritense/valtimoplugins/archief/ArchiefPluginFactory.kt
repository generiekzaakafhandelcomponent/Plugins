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

package com.ritense.valtimoplugins.archief

import com.ritense.document.service.DocumentService
import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentAssociationService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.zakenapi.repository.ZaakInstanceLinkRepository
import org.operaton.bpm.engine.RepositoryService
import org.springframework.jdbc.core.JdbcTemplate

class ArchiefPluginFactory(
    pluginService: PluginService,
    private val documentService: DocumentService,
    private val zaakInstanceLinkRepository: ZaakInstanceLinkRepository,
    private val processDocumentAssociationService: ProcessDocumentAssociationService,
    private val processDocumentService: ProcessDocumentService,
    private val repositoryService: RepositoryService,
    private val jdbcTemplate: JdbcTemplate,
) : PluginFactory<ArchiefPlugin>(pluginService) {

    override fun create(): ArchiefPlugin {
        return ArchiefPlugin(
            documentService,
            zaakInstanceLinkRepository,
            processDocumentAssociationService,
            processDocumentService,
            repositoryService,
            jdbcTemplate,
        )
    }
}
