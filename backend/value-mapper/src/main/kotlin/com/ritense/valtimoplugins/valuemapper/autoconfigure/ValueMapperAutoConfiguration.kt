package com.ritense.valtimoplugins.valuemapper.autoconfigure

import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.annotation.ProcessBean
import com.ritense.valtimoplugins.valuemapper.ValueMapper
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperDefinitionService
import com.ritense.valtimoplugins.valuemapper.plugin.ValueMapperPluginFactory
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperLoadingService
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.io.ResourceLoader

@Configuration
class ValueMapperAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(ValueMapperLoadingService::class)
    fun valueMapperLoadingService(
        resourceLoader: ResourceLoader
    ): ValueMapperLoadingService {
        return ValueMapperLoadingService(resourceLoader)
    }

    @Bean
    @ConditionalOnMissingBean(ValueMapperDefinitionService::class)
    fun valueMapperDefinitionService(
        valueMappingLoadingService: ValueMapperLoadingService
    ): ValueMapperDefinitionService {
        return ValueMapperDefinitionService(valueMappingLoadingService)
    }

    @Bean
    @ProcessBean
    @ConditionalOnMissingBean(ValueMapper::class)
    fun valueMapper(valueMapperDefinitionService: ValueMapperDefinitionService, documentService: DocumentService): ValueMapper {
        return ValueMapper(valueMapperDefinitionService,documentService)
    }

    @Bean
    @ConditionalOnMissingBean(ValueMapperPluginFactory::class)
    fun valueMapperPluginFactory(pluginService: PluginService, valueMapper: ValueMapper): ValueMapperPluginFactory {
        return ValueMapperPluginFactory(pluginService, valueMapper)
    }

}
