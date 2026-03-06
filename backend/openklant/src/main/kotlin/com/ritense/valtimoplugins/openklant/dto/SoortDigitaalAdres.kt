package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

enum class SoortDigitaalAdres(
    val value: String,
) {
    @JsonProperty("email")
    EMAIL("email"),

    @JsonProperty("telefoonnummer")
    TELEFOONNUMMER("telefoonnummer"),

    @JsonProperty("overig")
    OVERIG("overig"),
}
