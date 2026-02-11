package com.ritense.valtimoplugins.socrates.error

data class SocratesError(
    val exception: Exception,
    val messages: String? = null,
    val error: Any?,
    val errorCode: String
): Exception(exception)
