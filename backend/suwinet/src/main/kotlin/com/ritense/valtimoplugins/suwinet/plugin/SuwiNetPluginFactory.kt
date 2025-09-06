package com.ritense.valtimoplugins.suwinet.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoPersoonsInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetRdwService

class SuwiNetPluginFactory(
    pluginService: PluginService,
    private val suwinetBrpInfoService: SuwinetBrpInfoService,
    private val suwinetRdwService: SuwinetRdwService,
    private val suwinetDuoPersoonsInfoService: SuwinetDuoPersoonsInfoService
) : PluginFactory<SuwiNetPlugin>(pluginService) {

    override fun create(): SuwiNetPlugin {
        return SuwiNetPlugin(
            suwinetBrpInfoService,
            suwinetRdwService,
            suwinetDuoPersoonsInfoService
        )
    }
}
