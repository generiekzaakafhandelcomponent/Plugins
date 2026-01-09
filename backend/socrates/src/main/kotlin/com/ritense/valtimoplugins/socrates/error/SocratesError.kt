package com.ritense.valtimoplugins.socrates.error

import org.apache.commons.validator.Msg

data class SocratesError(val exception: Exception, val error: Any?, val errorCode: String): Exception(exception)
