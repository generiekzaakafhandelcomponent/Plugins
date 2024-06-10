package com.ritense.spotler.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import org.springframework.web.client.RestTemplate

class SpotlerPluginFactory(
    pluginService: PluginService,
    val restTemplate: RestTemplate
) : PluginFactory<SpotlerPlugin>(pluginService) {

    override fun create(): SpotlerPlugin {
        return SpotlerPlugin(restTemplate)
    }

}
