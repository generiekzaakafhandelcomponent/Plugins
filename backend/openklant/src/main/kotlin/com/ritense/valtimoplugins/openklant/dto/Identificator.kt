package com.ritense.valtimo.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Identificator(
    @JsonProperty("objectId")
    val objectId: String?,
    @JsonProperty("codeObjecttype")
    val codeObjecttype: String?,
    @JsonProperty("codeRegister")
    val codeRegister: String?,
    @JsonProperty("codeSoortObjectId")
    val codeSoortObjectId: String?,
)