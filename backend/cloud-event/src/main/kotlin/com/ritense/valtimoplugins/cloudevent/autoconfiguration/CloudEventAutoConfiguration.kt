/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.cloudevent.autoconfiguration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.case.service.CaseDefinitionService
import com.ritense.inbox.ValtimoEventHandler
import com.ritense.outbox.OutboxService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDefinitionCaseDefinitionService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.repository.ValtimoPluginProcessLinkRepository
import com.ritense.valtimo.contract.config.LiquibaseMasterChangeLogLocation
import com.ritense.valtimo.service.ProcessPropertyService
import com.ritense.valtimoplugins.cloudevent.domain.ProcessedCloudEvent
import com.ritense.valtimoplugins.cloudevent.listener.CloudEventProcessLinkListener
import com.ritense.valtimoplugins.cloudevent.plugin.CloudEventPluginFactory
import com.ritense.valtimoplugins.cloudevent.repository.ProcessedCloudEventRepository
import org.operaton.bpm.engine.RepositoryService
import org.operaton.bpm.engine.RuntimeService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.core.Ordered.HIGHEST_PRECEDENCE
import org.springframework.core.annotation.Order
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@AutoConfiguration
@EnableJpaRepositories(basePackageClasses = [ProcessedCloudEventRepository::class])
@EntityScan(basePackageClasses = [ProcessedCloudEvent::class])
class CloudEventAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(CloudEventPluginFactory::class)
    fun cloudEventPluginFactory(
        pluginService: PluginService,
        outboxService: OutboxService,
        objectMapper: ObjectMapper,
    ): CloudEventPluginFactory {
        return CloudEventPluginFactory(
            pluginService,
            outboxService,
            objectMapper,
        )
    }

    @Bean
    @ConditionalOnMissingBean(CloudEventProcessLinkListener::class)
    fun cloudEventProcessLinkListener(
        pluginProcessLinkRepository: ValtimoPluginProcessLinkRepository,
        runtimeService: RuntimeService,
        repositoryService: RepositoryService,
        processPropertyService: ProcessPropertyService,
        processDefinitionCaseDefinitionService: ProcessDefinitionCaseDefinitionService,
        processDocumentService: ProcessDocumentService,
        caseDefinitionService: CaseDefinitionService,
        objectMapper: ObjectMapper,
        processedCloudEventRepository: ProcessedCloudEventRepository,
    ): ValtimoEventHandler {
        return CloudEventProcessLinkListener(
            pluginProcessLinkRepository,
            runtimeService,
            repositoryService,
            processPropertyService,
            processDefinitionCaseDefinitionService,
            processDocumentService,
            caseDefinitionService,
            objectMapper,
            processedCloudEventRepository,
        )
    }

    @Order(HIGHEST_PRECEDENCE + 34)
    @Bean
    @ConditionalOnMissingBean(name = ["cloudEventLiquibaseMasterChangeLogLocation"])
    fun cloudEventLiquibaseMasterChangeLogLocation(): LiquibaseMasterChangeLogLocation =
        LiquibaseMasterChangeLogLocation("config/liquibase/cloud-event-master.xml")
}
