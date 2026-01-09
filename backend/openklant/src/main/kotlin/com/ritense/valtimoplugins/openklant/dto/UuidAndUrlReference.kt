package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class UuidAndUrlReference(
    @JsonProperty("uuid")
    val uuid: String,

    @JsonProperty("url")
    val url: String
)