package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class JournaalpostRegel(
    val grootboekSleutel: String,
    val boekingType: String,
    val bedrag: String,
    val omschrijving: String? = null,
)
