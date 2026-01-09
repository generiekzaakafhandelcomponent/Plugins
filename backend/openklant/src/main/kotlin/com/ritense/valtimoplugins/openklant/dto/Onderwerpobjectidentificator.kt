package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Onderwerpobjectidentificator(
    @JsonProperty("objectId")
    val objectId: String,
    @JsonProperty("codeObjecttype")
    val codeObjecttype: String,
    @JsonProperty("codeRegister")
    val codeRegister: String,
    @JsonProperty("CodeSoortObjectId")
    val codeSoortObjectId: String,
)