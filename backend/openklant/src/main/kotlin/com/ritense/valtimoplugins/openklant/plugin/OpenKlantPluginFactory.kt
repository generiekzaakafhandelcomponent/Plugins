package com.ritense.valtimo.openklant.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.openklant.service.OpenKlantService
import com.ritense.valtimo.openklant.util.ReflectionUtil

class OpenKlantPluginFactory(
    pluginService: PluginService,
    private val openKlantPluginService: OpenKlantService,
    private val reflectionUtil: ReflectionUtil,
) : PluginFactory<OpenKlantPlugin>(pluginService) {
    override fun create() = OpenKlantPlugin(openKlantPluginService, reflectionUtil)
}