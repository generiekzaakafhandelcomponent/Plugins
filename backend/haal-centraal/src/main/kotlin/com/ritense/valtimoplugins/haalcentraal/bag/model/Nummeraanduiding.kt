package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.ritense.valtimoplugins.haalcentraal.bag.model.common.Onderzoek
import com.ritense.valtimoplugins.haalcentraal.bag.model.common.Voorkomen

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Nummeraanduiding(
    val nummeraanduiding: NummeraanduidingDetails?,
    val inonderzoek: List<Onderzoek>?,
    @JsonProperty("_links") val links: Links?
)

@JsonInclude(JsonInclude.Include.NON_NULL)
data class NummeraanduidingDetails(
    val identificatie: String,
    val domein: String,
    val huisnummer: Int,
    val huisletter: String?,
    val huisnummertoevoeging: String?,
    val postcode: String,
    val typeAdresseerbaarObject: String,
    val status: String,
    val geconstateerd: String,
    val documentdatum: String,
    val documentnummer: String,
    val voorkomen: Voorkomen,
    val ligtIn: String,
    val ligtAan: String?
)
