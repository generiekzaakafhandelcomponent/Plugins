/*
 * Copyright 2025 Ritense BV, the Netherlands.
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

package com.ritense.externeklanttaak.autoconfiguration

import com.ritense.externeklanttaak.domain.IExterneKlanttaakVersion
import com.ritense.externeklanttaak.listener.ExterneKlanttaakEventListener
import com.ritense.externeklanttaak.plugin.ExterneKlanttaakPluginFactory
import com.ritense.externeklanttaak.security.ExterneKlanttaakSecurityConfigurer
import com.ritense.externeklanttaak.service.ExterneKlanttaakService
import com.ritense.externeklanttaak.web.rest.ExterneKlanttaakManagementResource
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.contract.security.config.HttpSecurityConfigurer
import com.ritense.valtimo.service.CamundaProcessService
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.link.ZaakInstanceLinkService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.core.annotation.Order

@AutoConfiguration
class ExterneKlanttaakAutoConfiguration {

    @Order(390)
    @Bean
    @ConditionalOnMissingBean(ExterneKlanttaakSecurityConfigurer::class)
    fun externeKlanttaakSecurityConfigurer(): HttpSecurityConfigurer {
        return ExterneKlanttaakSecurityConfigurer()
    }

    @Bean
    @ConditionalOnMissingBean(ExterneKlanttaakManagementResource::class)
    fun externeKlanttaakPluginManagementResource(
        externeKlanttaakVersions: List<IExterneKlanttaakVersion>
    ): ExterneKlanttaakManagementResource {
        return ExterneKlanttaakManagementResource(externeKlanttaakVersions)
    }

    @Bean
    @ConditionalOnMissingBean(ExterneKlanttaakService::class)
    fun externeKlanttaakService(
        pluginService: PluginService,
        objectManagementService: ObjectManagementService,
        valueResolverService: ValueResolverService,
        processDocumentService: ProcessDocumentService,
        zaakInstanceLinkService: ZaakInstanceLinkService,
        taskService: CamundaTaskService,
    ): ExterneKlanttaakService {
        return ExterneKlanttaakService(
            objectManagementService,
            pluginService,
            valueResolverService,
            taskService,
        )
    }

    @Bean
    @ConditionalOnMissingBean(ExterneKlanttaakPluginFactory::class)
    fun externeKlanttaakPluginFactory(
        pluginService: PluginService,
        externeKlanttaakService: ExterneKlanttaakService,
        externeKlanttaakVersions: List<IExterneKlanttaakVersion>,
    ): ExterneKlanttaakPluginFactory {
        return ExterneKlanttaakPluginFactory(
            pluginService,
            externeKlanttaakService,
            externeKlanttaakVersions,
        )
    }

    @Bean
    @ConditionalOnMissingBean(ExterneKlanttaakEventListener::class)
    fun externeKlanttaakEventListener(
        pluginService: PluginService,
        objectManagementService: ObjectManagementService,
        taskService: CamundaTaskService,
        processDocumentService: ProcessDocumentService,
        processService: CamundaProcessService,
    ): ExterneKlanttaakEventListener {
        return ExterneKlanttaakEventListener(
            objectManagementService,
            pluginService,
            taskService,
            processDocumentService,
            processService,
        )
    }
}