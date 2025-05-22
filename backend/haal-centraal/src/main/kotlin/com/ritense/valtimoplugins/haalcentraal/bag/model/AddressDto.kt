package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AddressDto(
    val openbareRuimteNaam: String?,
    val korteNaam: String?,
    val huisnummer: Int,
    val huisletter: String?,
    val huisnummertoevoeging: String?,
    val postcode: String,
    val woonplaatsNaam: String?,
    val nummeraanduidingIdentificatie: String?,
    val openbareRuimteIdentificatie: String?,
    val woonplaatsIdentificatie: String?,
    val adresseerbaarObjectIdentificatie: String?,
    val pandIdentificaties: List<String>?,
    val indicatieNevenadres: Boolean?,
    val adresregel5: String?,
    val adresregel6: String?,
    val geconstateerd: Geconstateerd?,
    val inonderzoek: InOnderzoek?,
    @JsonProperty("_links") val links: Links?,
    @JsonProperty("_embedded") val embeddedObject: EmbeddedObject?
)
