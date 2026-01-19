package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.Size

data class Onderwerpobjectidentificator(
    @JsonProperty("objectId")
    @field:Size(max = 200)
    val objectId: String,

    @JsonProperty("codeObjecttype")
    @field:Size(max = 200)
    val codeObjecttype: String,

    @JsonProperty("codeRegister")
    @field:Size(max = 200)
    val codeRegister: String,

    @JsonProperty("CodeSoortObjectId")
    @field:Size(max = 200)
    val codeSoortObjectId: String,
)