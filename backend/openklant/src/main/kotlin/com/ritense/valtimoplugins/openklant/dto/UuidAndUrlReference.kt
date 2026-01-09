package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class UuidAndUrlReference(
    @JsonProperty("uuid")
    override val uuid: String,

    @JsonProperty("url")
    override val url: String
) : Referable