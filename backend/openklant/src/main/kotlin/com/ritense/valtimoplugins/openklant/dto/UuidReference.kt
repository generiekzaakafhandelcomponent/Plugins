package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank

class UuidReference(
    @JsonProperty
    @field:NotBlank
    val uuid: String,
)