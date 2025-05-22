package com.ritense.valtimoplugins.haalcentraal.bag.model.common

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Historie(
    val tijdstipRegistratie: String?,
    val eindRegistratie: String?,
    val beginGeldigheid: String?,
    val eindGeldigheid: String?,
    val tijdstipRegistratieLV: String?,
    val tijdstipEindRegistratieLV: String?
)
