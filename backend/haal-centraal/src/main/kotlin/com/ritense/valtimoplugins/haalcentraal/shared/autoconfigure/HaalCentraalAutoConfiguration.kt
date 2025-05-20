package com.ritense.valtimoplugins.haalcentraal.shared.autoconfigure

import com.ritense.valtimoplugins.haalcentraal.shared.HaalCentraalWebClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class HaalCentraalAutoConfiguration {

    @Bean
    fun haalCentraalWebClient(): HaalCentraalWebClient {
        return HaalCentraalWebClient()
    }
}
