package com.ritense.spotler.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService

class SpotlerPluginFactory(
    pluginService: PluginService
) : PluginFactory<SpotlerPlugin>(pluginService) {

    override fun create() = SpotlerPlugin()

}
