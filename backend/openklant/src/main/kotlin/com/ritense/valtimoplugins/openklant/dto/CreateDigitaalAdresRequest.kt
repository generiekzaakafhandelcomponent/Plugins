package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class CreateDigitaalAdresRequest(
    @JsonProperty("verstrektDoorBetrokkene")
    val verstrektDoorBetrokkene: UuidReference? = null,
    @JsonProperty("verstrektDoorPartij")
    val verstrektDoorPartij: UuidReference?,
    @JsonProperty("adres")
    val adres: String,
    @JsonProperty("soortDigitaalAdres")
    val soortDigitaalAdres: SoortDigitaalAdres,
    @JsonProperty("isStandaardAdres")
    val isStandaardAdres: Boolean? = false,
    @JsonProperty("omschrijving")
    val omschrijving: String = "",
    @JsonProperty("referentie")
    val referentie: String?,
)