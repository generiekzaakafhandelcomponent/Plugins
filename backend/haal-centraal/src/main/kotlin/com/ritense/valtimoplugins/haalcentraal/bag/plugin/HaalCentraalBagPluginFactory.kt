package com.ritense.valtimoplugins.haalcentraal.bag.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraal.bag.service.HaalCentraalBagService

class HaalCentraalBagPluginFactory(
    private val haalCentraalBagService: HaalCentraalBagService,
    pluginService: PluginService
) : PluginFactory<HaalCentraalBagPlugin>(pluginService) {
    override fun create(): HaalCentraalBagPlugin {
        return HaalCentraalBagPlugin(
            haalCentraalBagService
        )
    }
}
