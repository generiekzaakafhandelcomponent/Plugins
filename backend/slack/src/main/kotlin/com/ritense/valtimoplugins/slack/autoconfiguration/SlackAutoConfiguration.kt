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

package com.ritense.valtimoplugins.slack.autoconfiguration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentAssociationService
import com.ritense.processlink.repository.ValtimoPluginProcessLinkRepository
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.config.LiquibaseMasterChangeLogLocation
import com.ritense.valtimo.service.ProcessPropertyService
import com.ritense.valtimoplugins.slack.client.SlackClient
import com.ritense.valtimoplugins.slack.domain.ProcessedSlackMessage
import com.ritense.valtimoplugins.slack.plugin.SlackPluginFactory
import com.ritense.valtimoplugins.slack.repository.ProcessedSlackMessageRepository
import com.ritense.valtimoplugins.slack.repository.SlackChannelCursorRepository
import com.ritense.valtimoplugins.slack.service.IncomingSlackMessageHandler
import com.ritense.valtimoplugins.slack.service.SlackMessagePollingService
import com.ritense.valtimoplugins.slack.service.SlackMessageProcessStarter
import org.camunda.bpm.engine.RepositoryService
import org.camunda.bpm.engine.RuntimeService
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.core.Ordered.HIGHEST_PRECEDENCE
import org.springframework.core.annotation.Order
import org.springframework.data.jpa.repository.config.EnableJpaRepositories
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.client.RestClient

@AutoConfiguration
@EnableScheduling
@EnableJpaRepositories(basePackageClasses = [ProcessedSlackMessageRepository::class])
@EntityScan(basePackageClasses = [ProcessedSlackMessage::class])
class SlackAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(SlackClient::class)
    fun slackClient(restClientBuilder: RestClient.Builder): SlackClient = SlackClient(restClientBuilder)

    @Bean
    @ConditionalOnMissingBean(SlackPluginFactory::class)
    fun slackPluginFactory(
        pluginService: PluginService,
        slackClient: SlackClient,
        storageService: TemporaryResourceStorageService,
    ): SlackPluginFactory = SlackPluginFactory(pluginService, slackClient, storageService)

    @Bean
    @ConditionalOnMissingBean(SlackMessageProcessStarter::class)
    fun slackMessageProcessStarter(
        runtimeService: RuntimeService,
        repositoryService: RepositoryService,
        processPropertyService: ProcessPropertyService,
        documentService: DocumentService,
        processDocumentAssociationService: ProcessDocumentAssociationService,
    ): SlackMessageProcessStarter =
        SlackMessageProcessStarter(
            runtimeService,
            repositoryService,
            processPropertyService,
            documentService,
            processDocumentAssociationService,
        )

    @Bean
    @ConditionalOnMissingBean(IncomingSlackMessageHandler::class)
    fun incomingSlackMessageHandler(
        processedSlackMessageRepository: ProcessedSlackMessageRepository,
        slackMessageProcessStarter: SlackMessageProcessStarter,
        objectMapper: ObjectMapper,
    ): IncomingSlackMessageHandler =
        IncomingSlackMessageHandler(
            processedSlackMessageRepository,
            slackMessageProcessStarter,
            objectMapper,
        )

    /**
     * The poller is the only bean behind a switch.
     *
     * Turning it off leaves the plugin fully installed and configurable, and posting still
     * works — it only stops this node from reading any channel. That is what you want on a
     * node that should not compete for messages (a migration runner, a local machine pointed
     * at a shared test workspace) and what makes the plugin safe to deploy before the Slack
     * app exists.
     */
    @Bean
    @ConditionalOnMissingBean(SlackMessagePollingService::class)
    @ConditionalOnProperty(value = ["valtimo.slack.polling-enabled"], matchIfMissing = true)
    fun slackMessagePollingService(
        pluginProcessLinkRepository: ValtimoPluginProcessLinkRepository,
        pluginService: PluginService,
        slackClient: SlackClient,
        incomingSlackMessageHandler: IncomingSlackMessageHandler,
        slackMessageProcessStarter: SlackMessageProcessStarter,
        processedSlackMessageRepository: ProcessedSlackMessageRepository,
        slackChannelCursorRepository: SlackChannelCursorRepository,
        objectMapper: ObjectMapper,
        @Value("\${valtimo.slack.retention-days:90}") retentionDays: Long,
    ): SlackMessagePollingService =
        SlackMessagePollingService(
            pluginProcessLinkRepository,
            pluginService,
            slackClient,
            incomingSlackMessageHandler,
            slackMessageProcessStarter,
            processedSlackMessageRepository,
            slackChannelCursorRepository,
            objectMapper,
            retentionDays,
        )

    @Order(HIGHEST_PRECEDENCE + 36)
    @Bean
    @ConditionalOnMissingBean(name = ["slackLiquibaseMasterChangeLogLocation"])
    fun slackLiquibaseMasterChangeLogLocation(): LiquibaseMasterChangeLogLocation =
        LiquibaseMasterChangeLogLocation("config/liquibase/slack-master.xml")
}
