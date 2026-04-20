package com.ritense.valtimoplugins.httpclientauthentication.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.httpclientauthentication.plugin.HttpClientAuthenticationPluginFactory
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class HttpClientAuthenticationPluginAutoconfiguration {

    @Bean
    @ConditionalOnMissingBean(HttpClientAuthenticationPluginFactory::class)
    fun httpClientAuthenticationPluginFactory(
        pluginService: PluginService
    ): HttpClientAuthenticationPluginFactory {
        return HttpClientAuthenticationPluginFactory(pluginService)
    }
}
