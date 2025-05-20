package com.ritense.valtimoplugins.haalcentraal.brp.model

data class Bewoner(
    val burgerservicenummer: String? = null,
    val geheimhoudingPersoonsgegevens: Boolean? = null,
    val inOnderzoek: Boolean? = null,
    val naam: Naam? = null,
    val geboorte: Geboorte? = null
)
