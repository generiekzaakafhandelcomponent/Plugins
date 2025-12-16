package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class PartijIdentificator(
    @JsonProperty("uuid")
    override val uuid: String,
    @JsonProperty("url")
    override val url: String,
    @JsonProperty("identificeerdePartij")
    val identificeerdePartij: ObjectReference,
    @JsonProperty("partijIdentificator")
    val partijIdentificator: Identificator,
    @JsonProperty("subIdentificatorVan")
    val subIdentificatorVan: ObjectReference?,
) : Referable