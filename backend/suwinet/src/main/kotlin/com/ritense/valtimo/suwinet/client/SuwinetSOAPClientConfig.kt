package com.ritense.valtimo.suwinet.client

data class SuwinetSOAPClientConfig(
    val baseUrl: String,
    val keystoreCertificatePath: String?,
    val keystoreKey: String?,
    val truststoreCertificatePath: String?,
    val truststoreKey: String?,
    val basicAuthName: String?,
    val basicAuthSecret: String?,
    val connectionTimeout: Int?,
    val receiveTimeout: Int?
)