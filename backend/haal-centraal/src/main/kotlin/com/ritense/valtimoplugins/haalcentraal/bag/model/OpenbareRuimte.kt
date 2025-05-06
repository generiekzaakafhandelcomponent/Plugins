package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.ritense.valtimoplugins.haalcentraal.bag.model.common.Onderzoek
import com.ritense.valtimoplugins.haalcentraal.bag.model.common.Voorkomen

@JsonInclude(JsonInclude.Include.NON_NULL)
data class OpenbareRuimte(
    val openbareRuimte: OpenbareRuimteDetails?,
    val inonderzoek: List<Onderzoek>?,
    @JsonProperty("_links") val links: Links?
)

data class OpenbareRuimteDetails(
    val identificatie: String,
    val domein: String,
    val naam: String,
    val type: String,
    val status: String,
    val korteNaam: String,
    val geconstateerd: String,
    val documentdatum: String,
    val documentnummer: String,
    val voorkomen: Voorkomen,
    val ligtIn: String
)
