package com.ritense.valtimoplugins.sampleplugin.plugin

import com.ritense.plugin.PluginFactory
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.sampleplugin.client.SampleService
import org.springframework.stereotype.Component

/**
 * Factory class to create instances of the SamplePlugin.
 * This is required for the plugin framework to instantiate the plugin.
 */
@Component
class SamplePluginFactory(
    pluginService: PluginService,
    val sampleService: SampleService
) : PluginFactory<SamplePlugin>(pluginService) {
    override fun create(): SamplePlugin {
        return SamplePlugin(sampleService)
    }
}