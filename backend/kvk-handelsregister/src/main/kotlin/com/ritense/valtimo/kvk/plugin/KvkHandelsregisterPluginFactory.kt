package com.ritense.valtimo.kvk.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.kvk.service.KvkHandelsregisterService

class KvkHandelsregisterPluginFactory(
    pluginService: PluginService,
    private val kvkHandelsregisterService: KvkHandelsregisterService
) : PluginFactory<KvkHandelsregisterPlugin>(pluginService) {

    override fun create(): KvkHandelsregisterPlugin {
        return KvkHandelsregisterPlugin(
            kvkHandelsregisterService
        )
    }
}