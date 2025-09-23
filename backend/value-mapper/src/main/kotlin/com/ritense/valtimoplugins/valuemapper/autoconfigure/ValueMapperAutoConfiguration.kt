package com.ritense.valtimoplugins.valuemapper.autoconfigure

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.document.service.DocumentService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.annotation.ProcessBean
import com.ritense.valtimo.contract.config.LiquibaseMasterChangeLogLocation
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperTemplate
import com.ritense.valtimoplugins.valuemapper.plugin.ValueMapper
import com.ritense.valtimoplugins.valuemapper.plugin.ValueMapperPluginFactory
import com.ritense.valtimoplugins.valuemapper.repository.ValueMapperTemplateRepository
import com.ritense.valtimoplugins.valuemapper.security.ValueMapperHttpSecurityConfigurer
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperLoadingService
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperTemplateService
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
    ): ValueMapperLoadingService {
        return ValueMapperLoadingService(resourceLoader, valueMapperTemplateService)
    }

    @Bean
    @ConditionalOnMissingBean(ValueMapperTemplateService::class)
    fun valueMapperTemplateService(repository: ValueMapperTemplateRepository, mapper: ObjectMapper): ValueMapperTemplateService{
        return ValueMapperTemplateService(repository, mapper)
    }

    @Bean
    @ConditionalOnMissingBean(ValueMapper::class)
    fun valueMapper(templateService: ValueMapperTemplateService, documentService: DocumentService ): ValueMapper {
        return ValueMapper(templateService, documentService)
    }

    @Bean
    @ConditionalOnMissingBean(ValueMapperPluginFactory::class)
    fun valueMapperPluginFactory(pluginService: PluginService, valueMapper: ValueMapper): ValueMapperPluginFactory {
        return ValueMapperPluginFactory(pluginService, valueMapper)
    }



    @Order(401)
    @Bean
    @ConditionalOnMissingBean(ValueMapperHttpSecurityConfigurer::class)
    fun valueMapperSecurityConfig(): ValueMapperHttpSecurityConfigurer {
        return ValueMapperHttpSecurityConfigurer()
    }

    @Order(HIGHEST_PRECEDENCE + 34)
    @Bean
    @ConditionalOnMissingBean(name = ["valueMapperLiquibaseMasterChangeLogLocation"])
    fun valueMapperTemplateLiquibaseMasterChangeLogLocation(): LiquibaseMasterChangeLogLocation {
        return LiquibaseMasterChangeLogLocation("config/liquibase/valuemapper-master.xml")
    }

}
