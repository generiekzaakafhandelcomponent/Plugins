package com.ritense.valtimoplugins.suwinetauth.plugin

import org.apache.cxf.endpoint.Client


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
