package com.ritense.valtimoplugins.socrates.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class NederlandsPostbusadres(
    override val soortAdres: String,
    val locatieomschrijving: String? = null,
    val postbusnummer: Int,
    val postcode: String,
    val woonplaatsnaam: String
) : Adres
