package com.ritense.valtimoplugins.suwinetauth.plugin

import com.ritense.plugin.annotation.PluginCategory
import org.apache.cxf.endpoint.Client

@PluginCategory("suwinet-authentication")
interface SuwinetAuth {

    fun applyAuth(client: Client)

    enum class AuthType(
        val authType: String,
    ) {
        MTLS("MTLS"),
        BASIC("BASIC"),
        HEADER("HEADER"),
    }
}
