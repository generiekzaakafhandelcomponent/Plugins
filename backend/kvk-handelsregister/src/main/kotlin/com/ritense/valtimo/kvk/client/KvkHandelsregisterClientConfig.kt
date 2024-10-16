package com.ritense.valtimo.kvk.client

data class KvkHandelsregisterClientConfig(
    val handelsregisterBaseUrl: String,
    val apikey: String,
    val connectionTimeout: Int?,
    val responseTimeout: Int?
)
