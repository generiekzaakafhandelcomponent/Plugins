package com.ritense.valtimo.haalcentraal.shared.autoconfigure

import com.ritense.valtimo.haalcentraal.shared.HaalCentraalWebClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class HaalCentraalAutoConfiguration {

    @Bean
    fun haalCentraalWebClient(): HaalCentraalWebClient {
        return HaalCentraalWebClient()
    }
}
