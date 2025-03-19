package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class FactuurRegel(
    val hoeveelheid: String,
    val tarief: String,
    val btwPercentage: String,
    val grootboekSleutel: String,
    val omschrijving: String
)
