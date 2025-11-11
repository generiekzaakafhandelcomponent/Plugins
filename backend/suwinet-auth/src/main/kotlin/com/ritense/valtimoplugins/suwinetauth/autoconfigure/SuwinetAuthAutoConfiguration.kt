package com.ritense.valtimoplugins.suwinetauth.autoconfigure


import SuwinetAuthPluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.suwinetauth.plugin.SuwinetAuthPlugin

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SuwinetAuthAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(SuwinetAuthPluginFactory::class)
    fun createSuwinetAuthPluginFactory(pluginService: PluginService): SuwinetAuthPluginFactory {
        return SuwinetAuthPluginFactory(pluginService)
    }
}
