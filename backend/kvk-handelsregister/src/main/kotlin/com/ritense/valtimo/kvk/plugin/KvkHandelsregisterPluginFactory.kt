package com.ritense.valtimo.kvk.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.kvk.service.KvkHandelsregisterService
import org.pf4j.Extension
import org.pf4j.ExtensionPoint
import org.springframework.stereotype.Component

@Extension(ordinal = 2)
@Component
class KvkHandelsregisterPluginFactory(
    pluginService: PluginService,
    private val kvkHandelsregisterService: KvkHandelsregisterService
) : PluginFactory<KvkHandelsregisterPlugin>(pluginService), ExtensionPoint {

    override fun create(): KvkHandelsregisterPlugin {
        return KvkHandelsregisterPlugin(
            kvkHandelsregisterService
        )
    }
}