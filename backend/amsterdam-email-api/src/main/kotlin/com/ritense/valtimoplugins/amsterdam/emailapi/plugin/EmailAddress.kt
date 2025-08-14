package com.ritense.valtimoplugins.amsterdam.emailapi.plugin

import java.io.Serializable

data class EmailAddress(val address: String, val name: String? = null) : Serializable
