package com.ritense.valtimoplugins.socrates.error

data class SocratesError(val exception: Exception, val errorCode: String): Exception(exception)
