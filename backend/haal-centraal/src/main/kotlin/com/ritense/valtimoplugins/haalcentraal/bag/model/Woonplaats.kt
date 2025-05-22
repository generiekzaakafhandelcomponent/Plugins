package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.ritense.valtimoplugins.haalcentraal.bag.model.common.Onderzoek
import com.ritense.valtimoplugins.haalcentraal.bag.model.common.Voorkomen

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Woonplaats(
    val woonplaats: WoonplaatsDetails?,
    val inonderzoek: List<Onderzoek>?,
    @JsonProperty("_links") val links: Links?
)

data class WoonplaatsDetails(
    val identificatie: String,
    val domein: String,
    val naam: String,
    val status: String,
    val geconstateerd: String,
    val documentdatum: String,
    val documentnummer: String,
    val voorkomen: Voorkomen
)
