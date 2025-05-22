package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AddressRequest(
    val postcode: String,
    val huisnummer: Int,
    val huisnummertoevoeging: String? = null,
    val huisletter: String? = null,
    val exacteMatch: Boolean
)
