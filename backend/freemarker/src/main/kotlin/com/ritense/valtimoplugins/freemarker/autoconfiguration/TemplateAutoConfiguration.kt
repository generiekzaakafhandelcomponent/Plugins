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

package com.ritense.valtimoplugins.freemarker.autoconfiguration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.valtimo.contract.case_.CaseDefinitionChecker
import com.ritense.valtimo.contract.config.LiquibaseMasterChangeLogLocation
import com.ritense.valtimoplugins.freemarker.config.TemplateHttpSecurityConfigurer
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.listener.TemplateCaseEventListener
import com.ritense.valtimoplugins.freemarker.repository.JsonSchemaDocumentRepositoryStreaming
import com.ritense.valtimoplugins.freemarker.repository.TemplateRepository
import com.ritense.valtimoplugins.freemarker.service.TemplateExporter
import com.ritense.valtimoplugins.freemarker.service.TemplateImporter
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import com.ritense.valtimoplugins.freemarker.web.rest.TemplateManagementResource
import com.ritense.valueresolver.ValueResolverService
import freemarker.template.Configuration
import freemarker.template.Configuration.VERSION_2_3_34
import freemarker.template.DefaultObjectWrapperBuilder
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.core.Ordered.HIGHEST_PRECEDENCE
import org.springframework.core.annotation.Order
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@AutoConfiguration
@EnableJpaRepositories(basePackageClasses = [TemplateRepository::class, JsonSchemaDocumentRepositoryStreaming::class])
@EntityScan(basePackageClasses = [ValtimoTemplate::class])
class TemplateAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(Configuration::class)
    fun freemarkerConfiguration(): Configuration {
        val configuration = Configuration(VERSION_2_3_34)
        configuration.logTemplateExceptions = false

        val objectWrapper = DefaultObjectWrapperBuilder(configuration.incompatibleImprovements).apply {
            iterableSupport = true
        }.build()
        configuration.objectWrapper = objectWrapper

        return configuration
    }

    @Bean
    @ConditionalOnMissingBean(TemplateService::class)
    fun templateService(
        templateRepository: TemplateRepository,
        objectMapper: ObjectMapper,
        valueResolverService: ValueResolverService,
        freemarkerConfiguration: Configuration,
        caseDefinitionChecker: CaseDefinitionChecker,
        jsonSchemaDocumentRepositoryStreaming: JsonSchemaDocumentRepositoryStreaming,
    ): TemplateService {
        return TemplateService(
            templateRepository,
            objectMapper,
            valueResolverService,
            freemarkerConfiguration,
            caseDefinitionChecker,
            jsonSchemaDocumentRepositoryStreaming,
        )
    }

    @Bean
    @ConditionalOnMissingBean(TemplateExporter::class)
    fun templateExporter(
        objectMapper: ObjectMapper,
        templateService: TemplateService
    ): TemplateExporter {
        return TemplateExporter(
            objectMapper,
            templateService,
        )
    }

    @Bean
    @ConditionalOnMissingBean(TemplateImporter::class)
    fun templateImporter(
        templateService: TemplateService,
        objectMapper: ObjectMapper,
    ): TemplateImporter {
        return TemplateImporter(
            templateService,
            objectMapper,
        )
    }

    @Bean
    @ConditionalOnMissingBean(TemplateCaseEventListener::class)
    fun templateCaseEventListener(
        templateService: TemplateService,
        templateRepository: TemplateRepository,
    ): TemplateCaseEventListener {
        return TemplateCaseEventListener(
            templateService,
            templateRepository,
        )
    }

    @Bean
    @ConditionalOnMissingBean(TemplateManagementResource::class)
    fun templateManagementResource(
        templateService: TemplateService,
    ): TemplateManagementResource {
        return TemplateManagementResource(
            templateService,
        )
    }

    @Order(301)
    @Bean
    @ConditionalOnMissingBean(TemplateHttpSecurityConfigurer::class)
    fun templateHttpSecurityConfigurer(): TemplateHttpSecurityConfigurer {
        return TemplateHttpSecurityConfigurer()
    }

    @Order(HIGHEST_PRECEDENCE + 32)
    @Bean
    @ConditionalOnMissingBean(name = ["templateLiquibaseMasterChangeLogLocation"])
    fun templateLiquibaseMasterChangeLogLocation(): LiquibaseMasterChangeLogLocation {
        return LiquibaseMasterChangeLogLocation("config/liquibase/template-master.xml")
    }
}
