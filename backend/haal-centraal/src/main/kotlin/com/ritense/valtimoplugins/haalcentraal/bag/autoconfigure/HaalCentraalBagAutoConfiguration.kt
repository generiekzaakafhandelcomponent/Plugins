package com.ritense.valtimoplugins.haalcentraal.bag.autoconfigure

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraal.bag.client.HaalCentraalBagClient
import com.ritense.valtimoplugins.haalcentraal.bag.plugin.HaalCentraalBagPluginFactory
import com.ritense.valtimoplugins.haalcentraal.bag.service.HaalCentraalBagService
import com.ritense.valtimoplugins.haalcentraal.shared.HaalCentraalWebClient
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties
class HaalCentraalBagAutoConfiguration {

    @Bean
    fun haalCentraalBagPluginFactory(
        haalCentraalBagService: HaalCentraalBagService,
        pluginService: PluginService
    ): HaalCentraalBagPluginFactory {
        return HaalCentraalBagPluginFactory(
            haalCentraalBagService,
            pluginService
        )
    }

    @Bean
    fun haalCentraalBagService(
        haalCentraalBagClient: HaalCentraalBagClient
    ): HaalCentraalBagService {
        return HaalCentraalBagService(haalCentraalBagClient)
    }

    @Bean
    fun haalCentraalBagClient(
        haalCentraalWebClient: HaalCentraalWebClient
    ): HaalCentraalBagClient = HaalCentraalBagClient(haalCentraalWebClient)
}
