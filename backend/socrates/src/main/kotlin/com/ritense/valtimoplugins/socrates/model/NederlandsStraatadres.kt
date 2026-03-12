package com.ritense.valtimoplugins.socrates.model

data class NederlandsStraatadres(
    override val soortAdres: String,
    val aanduidingBijHuisnummer: String? = null,
    val huisletter: String? = null,
    val huisnummer: Int,
    val huisnummertoevoeging: String? = null,
    val locatieomschrijving: String? = null,
    val postcode: String,
    val straatnaam: String,
    val woonplaatsnaam: String
) : Adres
