package com.ritense.valtimoplugins.socrates.error

import java.io.Serializable

data class ProcessErrorPayload(
    val errorCode: String,
    val message: String,
    val cause: String? = null,
    val body: Any? = null
) : Serializable
