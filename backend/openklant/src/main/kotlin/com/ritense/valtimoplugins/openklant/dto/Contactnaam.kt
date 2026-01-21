package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty

@JsonInclude(JsonInclude.Include.NON_EMPTY)
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