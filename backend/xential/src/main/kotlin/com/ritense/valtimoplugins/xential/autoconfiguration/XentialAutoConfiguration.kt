/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.xential.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.config.LiquibaseMasterChangeLogLocation
import com.ritense.valtimoplugins.xential.domain.XentialToken
import com.ritense.valtimoplugins.xential.plugin.XentialPluginFactory
import com.ritense.valtimoplugins.xential.repository.XentialTokenRepository
import com.ritense.valtimoplugins.xential.security.config.XentialApiHttpSecurityConfigurer
import com.ritense.valtimoplugins.xential.service.DocumentGenerationService
import com.ritense.valtimoplugins.xential.service.HttpClientConfig
import com.ritense.valtimoplugins.xential.web.rest.DocumentResource
import com.ritense.valueresolver.ValueResolverService
import org.camunda.bpm.engine.RuntimeService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.core.annotation.Order
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@AutoConfiguration
@EnableJpaRepositories(basePackageClasses = [XentialTokenRepository::class])
@EntityScan(basePackageClasses = [XentialToken::class])

class XentialAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(XentialPluginFactory::class)
    fun xentialPluginFactory(
        pluginService: PluginService,
        documentGenerationService: DocumentGenerationService
    ) = XentialPluginFactory(
            pluginService,
            documentGenerationService,
        )

    @Bean
    @ConditionalOnMissingBean(name = ["xentialLiquibaseMasterChangeLogLocation"])
    fun xentialLiquibaseMasterChangeLogLocation() =
        LiquibaseMasterChangeLogLocation("config/liquibase/xential-plugin-master.xml")

    @Bean
    fun xentialHttpClientConfig() = HttpClientConfig()


    @Bean
    @ConditionalOnMissingBean
    fun documentGenerationService(
        xentialTokenRepository: XentialTokenRepository,
        temporaryResourceStorageService: TemporaryResourceStorageService,
        runtimeService: RuntimeService,
        valueResolverService: ValueResolverService,
        httpClientConfig: HttpClientConfig
    ) = DocumentGenerationService(
        xentialTokenRepository,
        temporaryResourceStorageService,
        runtimeService,
        valueResolverService,
        httpClientConfig
    )

    @Bean
    @ConditionalOnMissingBean(DocumentResource::class)
    fun xentialDocumentResource(documentGenerationService: DocumentGenerationService) =
        DocumentResource(documentGenerationService)


    @Bean
    @Order(270)
    @ConditionalOnMissingBean
    fun xentialApiHttpSecurityConfigurer() = XentialApiHttpSecurityConfigurer()
}
