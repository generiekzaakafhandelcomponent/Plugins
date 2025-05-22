package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude
import com.ritense.valtimoplugins.haalcentraal.bag.model.common.Voorkomen

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Pand(
    val identificatie: String?,
    val domein: String?,
    val oorspronkelijkBouwjaar: String?,
    val status: String?,
    val geconstateerd: String?,
    val documentdatum: String?,
    val documentnummer: String?,
    val voorkomen: Voorkomen?
)
