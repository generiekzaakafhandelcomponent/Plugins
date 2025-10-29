package com.ritense.valtimo.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class ObjectReference(
    @JsonProperty("uuid")
    val uuid: String,
    @JsonProperty("url")
    val url: String,
)