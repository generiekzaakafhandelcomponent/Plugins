package com.ritense.valtimoplugins.httpclientauthentication.autoconfiguration

import com.ritense.openzaak.plugin.token.OpenZaakPluginTokenGeneratorService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.client.ValtimoHttpRestClientConfigurationProperties
import com.ritense.valtimoplugins.httpclientauthentication.plugin.HttpClientAuthenticationPluginFactory
import com.ritense.valtimoplugins.httpclientauthentication.tls.TlsRequestFactoryCache
import org.springframework.beans.factory.ObjectProvider
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean

@AutoConfiguration
class HttpClientAuthenticationPluginAutoconfiguration {
    @Bean
    @ConditionalOnMissingBean(HttpClientAuthenticationPluginFactory::class)
    fun httpClientAuthenticationPluginFactory(
        pluginService: PluginService,
        tokenGeneratorService: OpenZaakPluginTokenGeneratorService,
        tlsRequestFactoryCache: TlsRequestFactoryCache,
    ): HttpClientAuthenticationPluginFactory =
        HttpClientAuthenticationPluginFactory(pluginService, tokenGeneratorService, tlsRequestFactoryCache)

    @Bean
    @ConditionalOnMissingBean(TlsRequestFactoryCache::class)
    fun httpClientAuthenticationTlsRequestFactoryCache(
        restClientProperties: ObjectProvider<ValtimoHttpRestClientConfigurationProperties>,
    ): TlsRequestFactoryCache =
        TlsRequestFactoryCache(
            restClientProperties.getIfAvailable {
                ValtimoHttpRestClientConfigurationProperties()
            },
        )
}
