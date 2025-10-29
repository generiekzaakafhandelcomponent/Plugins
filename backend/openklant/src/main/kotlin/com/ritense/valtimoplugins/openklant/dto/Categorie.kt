package com.ritense.valtimo.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Categorie(
    @JsonProperty("uuid")
    override val uuid: String,
    @JsonProperty("url")
    override val url: String,
    @JsonProperty("naam")
    val naam: String,
) : Referable