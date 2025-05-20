package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AddressResponse(
    @JsonProperty("_embedded") val embedded: Embedded?,
    @JsonProperty("_links") val links: Links,
)

data class Embedded(
    val adressen: List<Address>?
)
