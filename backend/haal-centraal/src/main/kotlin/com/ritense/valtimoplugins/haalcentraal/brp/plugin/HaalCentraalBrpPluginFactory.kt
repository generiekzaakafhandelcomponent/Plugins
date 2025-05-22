package com.ritense.valtimoplugins.haalcentraal.brp.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.haalcentraal.brp.service.HaalCentraalBrpService

class HaalCentraalBrpPluginFactory(
    private val haalCentraalBrpService: HaalCentraalBrpService,
    pluginService: PluginService
) : PluginFactory<HaalCentraalBrpPlugin>(pluginService) {

    override fun create(): HaalCentraalBrpPlugin {
        return HaalCentraalBrpPlugin(
            haalCentraalBrpService
        )
    }
}
