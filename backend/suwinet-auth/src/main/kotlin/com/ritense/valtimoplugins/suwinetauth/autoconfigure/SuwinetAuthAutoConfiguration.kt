package com.ritense.valtimoplugins.suwinetauth.autoconfigure


import com.ritense.valtimoplugins.suwinetauth.plugin.SuwinetAuthPlugin

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.cache.annotation.EnableCaching
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@EnableCaching
@Configuration
class SuwinetAuthAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(SuwinetAuthPlugin::class)
    fun createSuwinetAuthPlugin(): SuwinetAuthPlugin {
        return SuwinetAuthPlugin()
    }
}
