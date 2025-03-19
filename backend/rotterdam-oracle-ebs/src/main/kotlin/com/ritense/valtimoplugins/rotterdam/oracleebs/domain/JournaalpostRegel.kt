package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class JournaalpostRegel(
    val grootboekSleutel: String,
    val boekingType: BoekingType,
    val bedrag: String,
    val omschrijving: String? = null,
)
