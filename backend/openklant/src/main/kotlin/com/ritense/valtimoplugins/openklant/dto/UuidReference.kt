package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank

data class UuidReference(
    @JsonProperty("uuid")
    @field:NotBlank
    val uuid: String,
)