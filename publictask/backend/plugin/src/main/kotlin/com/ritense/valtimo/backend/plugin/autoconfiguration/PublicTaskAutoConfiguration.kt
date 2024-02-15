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

package com.ritense.valtimo.backend.plugin.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.backend.plugin.config.PublicTaskSecurityConfigurer
import com.ritense.valtimo.backend.plugin.plugin.PublicTaskPluginFactory
import com.ritense.valtimo.backend.plugin.repository.PublicTaskRepository
import com.ritense.valtimo.backend.plugin.service.PublicTaskService
import org.camunda.bpm.engine.RuntimeService
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.annotation.Order
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@Configuration
@EnableJpaRepositories(basePackages = ["com.ritense.valtimo.backend.plugin.repository"])
@EntityScan("com.ritense.valtimo.backend.plugin.domain")
class PublicTaskAutoConfiguration {
    @Bean
    fun publicTaskService(
        publicTaskRepository: PublicTaskRepository,
        runtimeService: RuntimeService
    ): PublicTaskService = PublicTaskService(
        publicTaskRepository = publicTaskRepository,
        runtimeService: RuntimeService
    )

    @Bean
    @Order(500)
    @ConditionalOnMissingBean(PublicTaskSecurityConfigurer::class)
    fun publicTaskSecurityConfigurer(): PublicTaskSecurityConfigurer= PublicTaskSecurityConfigurer()

    @Bean
    fun publicTaskPluginFactory(
        pluginService: PluginService,
        publicTaskService: PublicTaskService
    ): PublicTaskPluginFactory = PublicTaskPluginFactory(
        pluginService = pluginService,
        publicTaskService = publicTaskService
    )
}