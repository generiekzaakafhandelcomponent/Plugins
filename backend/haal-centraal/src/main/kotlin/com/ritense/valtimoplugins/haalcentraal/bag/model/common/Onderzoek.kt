package com.ritense.valtimoplugins.haalcentraal.bag.model.common

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Onderzoek(
    val kenmerk: String,
    val identificatieVanOpenbareRuimte: String?,
    val identificatieVanNummeraanduiding: String?,
    val identificatieVanWoonplaats: String?,
    val identificatieVanPand: String?,
    val identificatieVanLigplaats: String?,
    val identificatieVanStandplaats: String?,
    val identificatieVanVerblijfsobject: String?,
    val inOnderzoek: String,
    val historie: Historie?,
    val documentdatum: String,
    val documentnummer: String
)
