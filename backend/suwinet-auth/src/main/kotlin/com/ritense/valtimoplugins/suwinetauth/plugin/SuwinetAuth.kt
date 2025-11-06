package com.ritense.valtimoplugins.suwinetauth.plugin

import org.apache.cxf.transport.http.HTTPConduit

interface SuwinetAuth {

    fun applyAuth(conduit: HTTPConduit): HTTPConduit

    enum class AuthType(
        val authType: String,
    ) {
        MTLS("MTLS"),
        BASIC("BASIC"),
    }
}
