package com.ritense.valtimoplugins.oipklanttaak

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.service.OperatonProcessService
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oipklanttaak.listener.OipKlanttaakEventListener
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
