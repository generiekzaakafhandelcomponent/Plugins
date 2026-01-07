/*
* Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.documentverzoek.autoconfig

import com.ritense.case.service.CaseDefinitionService
import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.impl.OperatonProcessJsonSchemaDocumentAssociationService
import com.ritense.valtimo.service.ApplicationStateService
import com.ritense.valtimoplugins.documentverzoek.DocumentVerzoekPluginEventListener
import com.ritense.valtimoplugins.documentverzoek.DocumentVerzoekPluginFactory
import com.ritense.zakenapi.link.ZaakInstanceLinkService
import com.ritense.zakenapi.repository.ZaakTypeLinkRepository
import com.ritense.zakenapi.service.ZaakTypeLinkService
import org.operaton.bpm.engine.RuntimeService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class DocumentVerzoekAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(DocumentVerzoekPluginFactory::class)
    fun documentVerzoekPluginFactory(
        pluginService: PluginService,
        applicationStateService: ApplicationStateService,
        zaakTypeLinkRepository: ZaakTypeLinkRepository,
        caseDefinitionService: CaseDefinitionService
    ): DocumentVerzoekPluginFactory {
        return DocumentVerzoekPluginFactory(
            pluginService,
            applicationStateService,
            zaakTypeLinkRepository,
            caseDefinitionService
        )
    }

    @Bean
    @ConditionalOnMissingBean(DocumentVerzoekPluginEventListener::class)
    fun documentVerzoekPluginEventListener(
        zaakTypeLinkService: ZaakTypeLinkService,
        caseDefinitionService: CaseDefinitionService,
        zaakInstanceLinkService: ZaakInstanceLinkService,
        runtimeService: RuntimeService,
        operatonProcessJsonSchemaDocumentAssociationService: OperatonProcessJsonSchemaDocumentAssociationService,
        documentService: DocumentService,
        pluginService: PluginService
    ): DocumentVerzoekPluginEventListener {
        return DocumentVerzoekPluginEventListener(
            zaakTypeLinkService,
            caseDefinitionService,
            zaakInstanceLinkService,
            runtimeService,
            operatonProcessJsonSchemaDocumentAssociationService,
            documentService,
            pluginService
        )
    }
}
