package com.ritense.valtimoplugins.printstraat.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginProperty
import java.net.URI

@Plugin(
    key = "printstraat",
    title = "Printstraat",
    description = "Connects to the Printstraat"
)
class PrintstraatPlugin {

    @PluginProperty("url", secret = false)
    lateinit var url: URI

    @PluginProperty("token", secret = true)
    lateinit var token: String
}
