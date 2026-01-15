package com.ritense.valtimoplugins.printstraat.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.printstraat.service.PrintstraatService

class PrintstraatPluginFactory(
    pluginService: PluginService,
    private val printstraatService: PrintstraatService
) : PluginFactory<PrintstraatPlugin>(pluginService) {
    override fun create(): PrintstraatPlugin = PrintstraatPlugin(printstraatService)
}
