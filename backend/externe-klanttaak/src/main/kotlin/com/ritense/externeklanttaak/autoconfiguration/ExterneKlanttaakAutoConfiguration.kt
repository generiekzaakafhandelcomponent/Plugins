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

package com.ritense.externeklanttaak.autoconfiguration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.document.service.DocumentService
import com.ritense.externeklanttaak.service.UtilityService
import com.ritense.externeklanttaak.listener.ExterneKlanttaakEventListener
import com.ritense.externeklanttaak.plugin.ExterneKlanttaakPluginFactory
import com.ritense.externeklanttaak.service.ExterneKlanttaakService
import com.ritense.externeklanttaak.service.impl.UtilService
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.service.CamundaProcessService
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.link.ZaakInstanceLinkService
import org.camunda.bpm.engine.RuntimeService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class ExterneKlanttaakAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(UtilityService::class)
    fun utilService(
        pluginService: PluginService,
        valueResolverService: ValueResolverService,
        zaakInstanceLinkService: ZaakInstanceLinkService,
    ): UtilityService {
        return UtilService(
            pluginService,
            valueResolverService,
            zaakInstanceLinkService,
        )
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
        utilService: UtilService,
    ): ExterneKlanttaakService {
        return ExterneKlanttaakService(
            objectManagementService,
            pluginService,
            valueResolverService,
            taskService,
            utilService,
        )
    }

    @Bean
    @ConditionalOnMissingBean(ExterneKlanttaakPluginFactory::class)
    fun externeKlanttaakPluginFactory(
        pluginService: PluginService,
        externeKlanttaakService: ExterneKlanttaakService
    ): ExterneKlanttaakPluginFactory {
        return ExterneKlanttaakPluginFactory(
            pluginService,
            externeKlanttaakService,
        )
    }

    @Bean
    @ConditionalOnMissingBean(ExterneKlanttaakEventListener::class)
    fun externeKlanttaakEventListener(
        pluginService: PluginService,
        objectManagementService: ObjectManagementService,
        processDocumentService: ProcessDocumentService,
        processService: CamundaProcessService,
        taskService: CamundaTaskService,
        documentService: DocumentService,
        runtimeService: RuntimeService,
        valueResolverService: ValueResolverService,
        objectMapper: ObjectMapper
    ): ExterneKlanttaakEventListener {
        return ExterneKlanttaakEventListener(
            objectManagementService,
            pluginService,
            processDocumentService,
            processService,
            taskService,
            runtimeService,
            valueResolverService,
            objectMapper
        )
    }
}