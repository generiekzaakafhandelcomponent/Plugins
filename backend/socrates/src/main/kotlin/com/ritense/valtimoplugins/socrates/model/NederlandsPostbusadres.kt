package com.ritense.valtimoplugins.socrates.model

data class NederlandsPostbusadres(
    override val soortAdres: String,
    val locatieomschrijving: String? = null,
    val postbusnummer: Int? = null,
    val postcode: String,
    val woonplaatsnaam: String
) : Adres
