package com.ritense.valtimoplugins.haalcentraalauth.autoconfigure

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraalauth.plugin.HaalCentraalAuthPluginFactory
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties
class HaalCentraalAuthPluginAutoconfiguration {

    @Bean
    fun haalCentraalAuthPluginFactory(
        pluginService: PluginService
    ): HaalCentraalAuthPluginFactory {
        return HaalCentraalAuthPluginFactory(pluginService)
    }
}
