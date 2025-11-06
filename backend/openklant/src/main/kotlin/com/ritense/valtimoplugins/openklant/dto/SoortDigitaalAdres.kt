package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

enum class SoortDigitaalAdres {
    @JsonProperty("email")
    EMAIL,

    @JsonProperty("telefoonnummer")
    TELEFOONNUMMER,

    @JsonProperty("overig")
    OVERIG,
}