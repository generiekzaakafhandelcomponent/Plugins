package com.ritense.valtimoplugins.suwinet.model

import java.io.Serializable

data class AdresDto(
    val straatnaam: String,
    val huisnummer: Int,
    val huisletter: String? = null,
    val huisnummertoevoeging: String,
    val postcode: String,
    val woonplaatsnaam: String,
    val aanduidingBijHuisnummer: String? = null,
    val locatieomschrijving: String
) : Serializable
