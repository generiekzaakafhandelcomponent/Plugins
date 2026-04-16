package com.ritense.valtimoplugins.socrates.model

import com.fasterxml.jackson.annotation.JsonProperty

data class Betrokkene(
    @JsonProperty("Naam")
    val naam: String,

    @JsonProperty("Rol")
    val rol: List<Rol>
)
