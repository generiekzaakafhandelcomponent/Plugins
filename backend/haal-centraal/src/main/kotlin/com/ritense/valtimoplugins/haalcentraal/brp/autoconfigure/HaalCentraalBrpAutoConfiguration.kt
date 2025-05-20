package com.ritense.valtimoplugins.haalcentraal.brp.autoconfigure

import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraal.brp.client.HcBrpClient
import com.ritense.valtimoplugins.haalcentraal.brp.plugin.HaalCentraalBrpPluginFactory
import com.ritense.valtimoplugins.haalcentraal.brp.service.HaalCentraalBrpService
import com.ritense.valtimoplugins.haalcentraal.shared.HaalCentraalWebClient
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@EnableConfigurationProperties
class HaalCentraalBrpAutoConfiguration {

    @Bean
    fun hcBrpClient(
        haalCentraalWebClient: HaalCentraalWebClient
    ): HcBrpClient {
        return HcBrpClient(haalCentraalWebClient)
    }

    @Bean
    fun haalCentraalBrpService(
        hcBrpClient: HcBrpClient
    ): HaalCentraalBrpService {
        return HaalCentraalBrpService(hcBrpClient)
    }

    @Bean
    fun haalCentraalBrpPluginFactory(
        haalCentraalBrpService: HaalCentraalBrpService,
        pluginService: PluginService
    ): HaalCentraalBrpPluginFactory {
        return HaalCentraalBrpPluginFactory(
            haalCentraalBrpService,
            pluginService
        )
    }
}
