package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class Verwerkingsstatus(
     val isGeslaagd: Boolean,
     val melding: String? = null,
     val foutcode: String? = null,
     val foutmelding: String? = null
)
