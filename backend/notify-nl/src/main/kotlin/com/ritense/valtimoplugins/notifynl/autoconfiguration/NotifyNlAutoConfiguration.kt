package com.ritense.valtimoplugins.notifynl.autoconfiguration

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.notifynl.client.NotifyNlClient
import com.ritense.valtimoplugins.notifynl.plugin.NotifyNlPluginFactory
import com.ritense.valtimoplugins.notifynl.service.NotifyNlTokenGenerationService
import org.springframework.boot.autoconfigure.AutoConfiguration
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.context.annotation.Bean
import org.springframework.web.client.RestClient

@AutoConfiguration
class NotifyNlAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean(NotifyNlClient::class)
    fun notifyNlClient(
        restClientBuilder: RestClient.Builder
    ): NotifyNlClient {
        return NotifyNlClient(restClientBuilder)
    }

    @Bean
    @ConditionalOnMissingBean(NotifyNlTokenGenerationService::class)
    fun notifyNlTokenGenerationService() : NotifyNlTokenGenerationService {
        return NotifyNlTokenGenerationService()
    }

    @Bean
    @ConditionalOnMissingBean(NotifyNlPluginFactory::class)
    fun notifyNlPluginFactory(
        pluginService: PluginService,
        notifyNlClient: NotifyNlClient,
        tokenGenerationService: NotifyNlTokenGenerationService,
    ): NotifyNlPluginFactory {
        return NotifyNlPluginFactory(pluginService, notifyNlClient, tokenGenerationService)
    }
}