package com.ritense.valtimoplugins.suwinet.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpInfoService
import org.pf4j.Extension
import org.pf4j.ExtensionPoint
import org.springframework.stereotype.Component

@Extension(ordinal = 2)
@Component
class SuwiNetPluginFactory(
    pluginService: PluginService,
    private val suwinetBrpInfoService: SuwinetBrpInfoService
) : PluginFactory<SuwiNetPlugin>(pluginService), ExtensionPoint {

    override fun create(): SuwiNetPlugin {
        return SuwiNetPlugin(
            suwinetBrpInfoService
        )
    }
}