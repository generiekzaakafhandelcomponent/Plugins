package com.ritense.valtimoplugins.socrates.client

import com.fasterxml.jackson.annotation.JsonProperty
import com.ritense.valtimoplugins.socrates.model.Betrokkene
import com.ritense.valtimoplugins.socrates.model.LoBehandeld

data class LOBehandeldRequest(
    val identificatie: String,
    val loBehandeld: LoBehandeld,

    @JsonProperty("Betrokkenen")
    val betrokkenen: List<Betrokkene>?,
)
