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

package com.ritense.valtimoplugins.freemarker.listener

import com.ritense.authorization.annotation.RunWithoutAuthorization
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimo.contract.event.CaseDefinitionCreatedEvent
import com.ritense.valtimo.contract.event.CaseDefinitionPreDeleteEvent
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.repository.TemplateRepository
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Transactional
@Component
@SkipComponentScan
class TemplateCaseEventListener(
    private val service: TemplateService,
    private val repository: TemplateRepository,
) {

    @RunWithoutAuthorization
    @EventListener(CaseDefinitionCreatedEvent::class)
    fun handleCaseDefinitionCreatedEvent(event: CaseDefinitionCreatedEvent) {
        if (event.duplicate) {
            service.findTemplates(caseDefinitionId = event.basedOnCaseDefinitionId!!).forEach { oldTemplate ->
                repository.save(
                    ValtimoTemplate(
                        key = oldTemplate.key,
                        caseDefinitionId = event.caseDefinitionId,
                        type = oldTemplate.type,
                        metadata = oldTemplate.metadata,
                        content = oldTemplate.content,
                    )
                )
            }
        }
    }

    @RunWithoutAuthorization
    @EventListener(CaseDefinitionPreDeleteEvent::class)
    fun handleCaseDefinitionPreDeleteEvent(event: CaseDefinitionPreDeleteEvent) {
        service.deleteTemplatesByCaseDefinitionId(
            caseDefinitionId = event.caseDefinitionId,
        )
    }
}
