package com.ritense.valtimoplugins.suwinetauth.plugin

import org.apache.cxf.frontend.ClientProxy


interface SuwinetAuth {

    fun applyAuth(client: ClientProxy): ClientProxy

    enum class AuthType(
        val authType: String,
    ) {
        MTLS("MTLS"),
        BASIC("BASIC"),
        HEADER("HEADER"),
    }
}
