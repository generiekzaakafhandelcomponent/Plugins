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

package com.ritense.valtimo.backend.plugin.autoconfiguration

import com.ritense.audit.service.AuditService
import com.ritense.authorization.AuthorizationService
import com.ritense.document.service.impl.JsonSchemaDocumentService
import com.ritense.valtimo.backend.plugin.audit.PublicTaskCamundaProcessJsonSchemaDocumentAuditService
import com.ritense.valtimo.backend.plugin.audit.PublicTaskCompletedListener
import com.ritense.valtimo.backend.plugin.repository.PublicTaskRepository
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary

@Configuration
class PublicTaskAuditAutoConfiguration {

    @Bean
    @Primary
    fun taskCompletedListener(
        applicationEventPublisher: ApplicationEventPublisher,
        publicTaskRepository: PublicTaskRepository
    ) = PublicTaskCompletedListener(
        applicationEventPublisher = applicationEventPublisher,
        publicTaskRepository = publicTaskRepository
    )

    @Bean
    @Primary
    fun processDocumentAuditService(
        auditService: AuditService,
        documentService: JsonSchemaDocumentService,
        authorizationService: AuthorizationService
    ) = PublicTaskCamundaProcessJsonSchemaDocumentAuditService(
        auditService = auditService,
        documentService = documentService,
        authorizationService = authorizationService
    )
}