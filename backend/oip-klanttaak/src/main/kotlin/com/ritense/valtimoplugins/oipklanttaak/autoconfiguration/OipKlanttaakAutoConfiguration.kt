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

package com.ritense.valtimoplugins.oipklanttaak.autoconfiguration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.service.OperatonProcessService
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oipklanttaak.listener.OipKlanttaakEventListener
import com.ritense.valtimoplugins.oipklanttaak.plugin.OipKlanttaakPluginFactory
import com.ritense.valtimoplugins.oipklanttaak.service.OipKlanttaakService
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class OipKlanttaakAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(OipKlanttaakPluginFactory::class)
    fun oipKlanttaakPluginFactory(
        pluginService: PluginService,
        objectManagementService: ObjectManagementService,
        oipKlanttaakService: OipKlanttaakService
    ) = OipKlanttaakPluginFactory(
        pluginService = pluginService,
        objectManagementService = objectManagementService,
        oipKlanttaakService = oipKlanttaakService
    )

    @Bean
    @ConditionalOnMissingBean(OipKlanttaakService::class)
    fun oipKlanttaakkService(
        pluginService: PluginService,
        objectManagementService: ObjectManagementService,
        objectMapper: ObjectMapper,
        taskService: OperatonTaskService,
        valueResolverService: ValueResolverService,
        zaakUrlProvider: ZaakUrlProvider
    ) = OipKlanttaakService(
        pluginService = pluginService,
        objectManagementService = objectManagementService,
        objectMapper = objectMapper,
        taskService = taskService,
        valueResolverService = valueResolverService,
        zaakUrlProvider = zaakUrlProvider
    )

    @Bean
    @ConditionalOnMissingBean(OipKlanttaakEventListener::class)
    fun oipKlanttaakEventListener(
        pluginService: PluginService,
        objectManagementService: ObjectManagementService,
        processDocumentService: ProcessDocumentService,
        processService: OperatonProcessService,
        taskService: OperatonTaskService
    ) = OipKlanttaakEventListener(
        pluginService = pluginService,
        objectManagementService = objectManagementService,
        processDocumentService = processDocumentService,
        processService = processService,
        taskService = taskService
    )
}