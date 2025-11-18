package com.ritense.valtimoplugins.suwinet.client

import com.ritense.valtimoplugins.suwinetauth.plugin.SuwinetAuth

data class SuwinetSOAPClientConfig(
    val baseUrl: String,
    val connectionTimeout: Int?,
    val receiveTimeout: Int?,
    val authConfig: SuwinetAuth
)
