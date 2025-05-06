package com.ritense.valtimoplugins.haalcentraal.bag.model.common

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Voorkomen(
    val tijdstipRegistratie: String,
    val versie: Int,
    val eindRegistratie: String?,
    val beginGeldigheid: String?,
    val eindGeldigheid: String?,
    val tijdstipInactief: String?,
    val tijdstipRegistratieLV: String?,
    val tijdstipNietBAG: String?,
    val tijdstipEindRegistratieLV: String?,
    val tijdstipInactiefLV: String?
)
