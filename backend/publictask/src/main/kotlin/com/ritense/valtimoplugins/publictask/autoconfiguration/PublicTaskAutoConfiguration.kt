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

package com.ritense.valtimoplugins.publictask.autoconfiguration

import com.ritense.form.service.impl.DefaultFormSubmissionService
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.service.ProcessLinkActivityService
import com.ritense.valtimoplugins.publictask.config.PublicTaskSecurityConfigurer
import com.ritense.valtimoplugins.publictask.htmlrenderer.config.FreemarkerConfig
import com.ritense.valtimoplugins.publictask.htmlrenderer.service.HtmlRenderService
import com.ritense.valtimoplugins.publictask.plugin.PublicTaskPluginFactory
import com.ritense.valtimoplugins.publictask.repository.PublicTaskRepository
import com.ritense.valtimoplugins.publictask.service.PublicTaskService
import com.ritense.valtimo.contract.annotation.ProcessBean
import org.operaton.bpm.engine.RuntimeService
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@Configuration
@EnableJpaRepositories(basePackages = ["com.ritense.valtimoplugins.publictask.repository"])
@EntityScan("com.ritense.valtimoplugins.publictask.domain")
class PublicTaskAutoConfiguration {

    @Bean
    fun freemarkerConfig() = FreemarkerConfig()

    @Bean
    fun htmlRenderService(
        freemarkerConfig: FreemarkerConfig
    ): HtmlRenderService = HtmlRenderService(
        freemarkerConfig = freemarkerConfig
    )

    @Bean
    @ProcessBean
    fun publicTaskService(
        publicTaskRepository: PublicTaskRepository,
        runtimeService: RuntimeService,
        processLinkActivityService: ProcessLinkActivityService,
        htmlRenderService: HtmlRenderService,
        defaultFormSubmissionService: DefaultFormSubmissionService,
        @Value("\${valtimo.url}") baseUrl: String,
    ): PublicTaskService = PublicTaskService(
        publicTaskRepository = publicTaskRepository,
        runtimeService = runtimeService,
        processLinkActivityService = processLinkActivityService,
        htmlRenderService = htmlRenderService,
        defaultFormSubmissionService = defaultFormSubmissionService,
        baseUrl = baseUrl
    )

    @Bean
    @Order(270)
    @ConditionalOnMissingBean(PublicTaskSecurityConfigurer::class)
    fun publicTaskSecurityConfigurer(): PublicTaskSecurityConfigurer = PublicTaskSecurityConfigurer()

    @Bean
    fun publicTaskPluginFactory(
        pluginService: PluginService,
        publicTaskService: PublicTaskService
    ): PublicTaskPluginFactory = PublicTaskPluginFactory(
        pluginService = pluginService,
        publicTaskService = publicTaskService
    )
}
