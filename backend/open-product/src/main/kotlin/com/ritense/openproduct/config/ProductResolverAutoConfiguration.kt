package com.ritense.openproduct.config

import com.ritense.openproduct.client.OpenProductClient
import com.ritense.openproduct.plugin.OpenProductPluginFactory
import com.ritense.plugin.service.PluginService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.domain.EntityScan
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.ComponentScan

@AutoConfiguration
@EntityScan("com.ritense.openproduct")
@ComponentScan("com.ritense.openproduct")
class ProductResolverAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(OpenProductPluginFactory::class)
    fun openProductPluginFactory(
        pluginService: PluginService,
        openProductClient: OpenProductClient,
    ): OpenProductPluginFactory {
        return OpenProductPluginFactory(pluginService, openProductClient)
    }
}
