package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Contactnaam(
    @JsonProperty("voorletters")
    val voorletters: String?,
    @JsonProperty("voornaam")
    val voornaam: String?,
    @JsonProperty("voorvoegselAchternaam")
    val voorvoegselAchternaam: String?,
    @JsonProperty("achternaam")
    val achternaam: String?,
)