package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class EmbeddedObject(
    val openbareRuimte: OpenbareRuimte?,
    val nummeraanduiding: Nummeraanduiding?,
    val woonplaats: Woonplaats?,
    val adresseerbaarObject: AdresseerbaarObject?,
    val panden: List<Pand>?
)
