package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Adres(
    @JsonProperty("nummeraanduidingId")
    val nummeraanduidingId: String?,
    @JsonProperty("straatnaam")
    val straatnaam: String?,
    @JsonProperty("huisnummer")
    val huisnummer: Int?,
    @JsonProperty("huisnummertoevoeging")
    val huisnummertoevoeging: String?,
    @JsonProperty("postcode")
    val postcode: String?,
    @JsonProperty("stad")
    val stad: String?,
    @JsonProperty("adresregel1")
    val adresregel1: String?,
    @JsonProperty("adresregel2")
    val adresregel2: String?,
    @JsonProperty("adresregel3")
    val adresregel3: String?,
    @JsonProperty("land")
    val land: String?,
)