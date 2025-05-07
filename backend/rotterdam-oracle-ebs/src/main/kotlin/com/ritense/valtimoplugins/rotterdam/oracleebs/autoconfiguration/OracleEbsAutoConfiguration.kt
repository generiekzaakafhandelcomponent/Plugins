package com.ritense.valtimoplugins.rotterdam.oracleebs.autoconfiguration

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.rotterdam.oracleebs.service.EsbClient
import com.ritense.valtimoplugins.rotterdam.oracleebs.plugin.OracleEbsPluginFactory
import com.ritense.valueresolver.ValueResolverService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class OracleEbsAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(OracleEbsPluginFactory::class)
    fun journaalPostPluginFactory(
        pluginService: PluginService,
        esbClient: EsbClient,
        valueResolverService: ValueResolverService,
        objectMapper: ObjectMapper,
    ) = OracleEbsPluginFactory(
        pluginService,
        esbClient,
        valueResolverService,
        objectMapper
    )

    @Bean
    fun esbClient() = EsbClient()
}
