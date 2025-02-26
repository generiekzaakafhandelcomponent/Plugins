package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

import java.math.BigDecimal

data class FactuurRegel(
    val hoeveelheid: BigDecimal,
    val tarief: BigDecimal,
    val btwPercentage: String,
    val grootboekSleutel: String,
    val omschrijving: String
)
