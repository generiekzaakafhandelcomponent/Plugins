package com.ritense.valtimoplugins.haalcentraalauth.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraalauth.plugin.HaalCentraalAuthPlugin

class HaalCentraalAuthPluginFactory(
    pluginService: PluginService
) : PluginFactory<HaalCentraalAuthPlugin>(pluginService) {

    override fun create(): HaalCentraalAuthPlugin {
        return HaalCentraalAuthPlugin()
    }
}
