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

package com.ritense.valtimoplugins.valuemapper.autoconfigure

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.config.LiquibaseMasterChangeLogLocation
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperTemplate
import com.ritense.valtimoplugins.valuemapper.plugin.ValueMapper
import com.ritense.valtimoplugins.valuemapper.plugin.ValueMapperPluginFactory
import com.ritense.valtimoplugins.valuemapper.repository.ValueMapperTemplateRepository
import com.ritense.valtimoplugins.valuemapper.security.ValueMapperHttpSecurityConfigurer
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperLoadingService
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperTemplateService
import com.ritense.valtimoplugins.valuemapper.web.ValueMapperResource
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered.HIGHEST_PRECEDENCE
import org.springframework.core.annotation.Order
import org.springframework.core.io.ResourceLoader
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@EnableJpaRepositories(basePackageClasses = [ValueMapperTemplateRepository::class])
@EntityScan(basePackageClasses = [ValueMapperTemplate::class])
@EnableCaching
@Configuration
class ValueMapperAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(ValueMapperLoadingService::class)
    fun valueMapperLoadingService(
        resourceLoader: ResourceLoader,
        valueMapperTemplateService: ValueMapperTemplateService,
    ): ValueMapperLoadingService = ValueMapperLoadingService(resourceLoader, valueMapperTemplateService)

    @Bean
    @ConditionalOnMissingBean(ValueMapperTemplateService::class)
    fun valueMapperTemplateService(
        repository: ValueMapperTemplateRepository,
        mapper: ObjectMapper,
    ): ValueMapperTemplateService = ValueMapperTemplateService(repository, mapper)

    @Bean
    @ConditionalOnMissingBean(ValueMapper::class)
    fun valueMapper(
        templateService: ValueMapperTemplateService,
        documentService: DocumentService,
    ): ValueMapper = ValueMapper(templateService, documentService)

    @Bean
    @ConditionalOnMissingBean(ValueMapperPluginFactory::class)
    fun valueMapperPluginFactory(
        pluginService: PluginService,
        valueMapper: ValueMapper,
    ): ValueMapperPluginFactory = ValueMapperPluginFactory(pluginService, valueMapper)

    @Bean
    @ConditionalOnMissingBean(ValueMapperResource::class)
    fun valueMapperResource(
        loadingService: ValueMapperLoadingService,
        valueMapperTemplateService: ValueMapperTemplateService,
    ): ValueMapperResource =
        ValueMapperResource(
            loadingService,
            valueMapperTemplateService,
        )

    @Order(269)
    @Bean
    @ConditionalOnMissingBean(ValueMapperHttpSecurityConfigurer::class)
    fun valueMapperSecurityConfig(): ValueMapperHttpSecurityConfigurer = ValueMapperHttpSecurityConfigurer()

    @Order(HIGHEST_PRECEDENCE + 34)
    @Bean
    @ConditionalOnMissingBean(name = ["valueMapperLiquibaseMasterChangeLogLocation"])
    fun valueMapperTemplateLiquibaseMasterChangeLogLocation(): LiquibaseMasterChangeLogLocation =
        LiquibaseMasterChangeLogLocation("config/liquibase/valuemapper-master.xml")
}
