package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class InOnderzoek(
    val openbareRuimteNaam: Boolean,
    val korteNaam: Boolean,
    val huisnummer: Boolean,
    val huisletter: Boolean,
    val huisnummertoevoeging: Boolean,
    val postcode: Boolean,
    val woonplaatsNaam: Boolean,
    val openbareRuimteLigtIn: Boolean,
    val openbareRuimteStatus: Boolean,
    val nummeraanduidingLigtIn: Boolean,
    val nummeraanduidingligtAan: Boolean,
    val nummeraanduidingStatus: Boolean,
    val toelichting: List<String>,
    val adresregel5: Boolean,
    val adresregel6: Boolean
)
