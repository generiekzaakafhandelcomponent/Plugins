package com.ritense.valtimo.suwinet.model

data class AdresDto(
    val straatnaam: String,
    val huisnummer: Int,
    val huisletter: String,
    val huisnummertoevoeging: String,
    val postcode: String,
    val woonplaatsnaam: String,
    val aanduidingBijHuisnummer: String,
    val locatieomschrijving: String
)