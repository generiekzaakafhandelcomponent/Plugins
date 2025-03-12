package com.ritense.valtimoplugins.mtlssslcontext

import com.ritense.plugin.annotation.PluginCategory
import javax.net.ssl.SSLContext

@PluginCategory("mtls-sslcontext-plugin")
interface MTlsSslContext {

    fun createSslContext(): SSLContext
}
