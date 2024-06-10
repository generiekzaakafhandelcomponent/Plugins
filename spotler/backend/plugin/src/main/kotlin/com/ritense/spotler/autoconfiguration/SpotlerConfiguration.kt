package com.ritense.spotler.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.spotler.plugin.SpotlerPluginFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SpotlerConfiguration {

    @Bean
    @ConditionalOnMissingBean(SpotlerPluginFactory::class)
    fun spotlerPluginFactory(
        pluginService: PluginService
    ) = SpotlerPluginFactory(
        pluginService
    )

}
