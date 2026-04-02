package com.ritense.valtimoplugins.socrates.model

import com.fasterxml.jackson.annotation.JsonProperty

data class Rol(
    @JsonProperty("Rolomschrijving")
    val rolomschrijving: String
)
