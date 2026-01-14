package com.ritense.valtimoplugins.printstraat.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService

class PrintstraatPluginFactory(
    pluginService: PluginService
) : PluginFactory<PrintstraatPlugin>(pluginService) {
    override fun create(): PrintstraatPlugin = PrintstraatPlugin()
}
