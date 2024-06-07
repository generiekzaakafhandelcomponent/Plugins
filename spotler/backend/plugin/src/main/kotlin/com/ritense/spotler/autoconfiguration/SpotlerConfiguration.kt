package com.ritense.spotler.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.spotler.plugin.SpotlerPluginFactory
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate

@Configuration
class SpotlerConfiguration {

    @Bean
    @ConditionalOnMissingBean(SpotlerPluginFactory::class)
    fun spotlerPluginFactory(
        pluginService: PluginService,
        restTemplate: RestTemplate
    ) = SpotlerPluginFactory(
        pluginService,
        restTemplate
    )

    @Bean
    @ConditionalOnMissingBean(RestTemplate::class)
    fun restTemplate(): RestTemplate {
        return RestTemplateBuilder().build()
    }
}
