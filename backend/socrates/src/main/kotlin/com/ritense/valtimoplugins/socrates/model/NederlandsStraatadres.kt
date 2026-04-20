package com.ritense.valtimoplugins.socrates.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
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
