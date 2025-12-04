package com.ritense.valtimoplugins.suwinet.error

data class SuwinetError(val exception: Exception, val errorCode: String): Exception(exception)
