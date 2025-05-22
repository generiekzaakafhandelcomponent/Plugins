package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.ritense.valtimoplugins.haalcentraal.bag.model.common.Voorkomen

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AdresseerbaarObject(
    @JsonProperty("_links") val links: Links,
    val ligplaats: Ligplaats? = null,
    val standplaats: Standplaats? = null,
    val verblijfsobject: Verblijfsobject? = null
)

sealed class AdresseerbaarObjectType(
    open val identificatie: String?,
    open val domein: String?,
    open val oppervlakte: Int?,
    open val status: String?,
    open val geconstateerd: String?,
    open val documentdatum: String?,
    open val documentnummer: String?,
    open val voorkomen: Voorkomen?
)

data class Standplaats(
    override val identificatie: String,
    override val domein: String,
    override val oppervlakte: Int?,
    override val status: String,
    override val geconstateerd: String,
    override val documentdatum: String,
    override val documentnummer: String,
    override val voorkomen: Voorkomen,
    val heeftAlsNevenAdres: List<String> = emptyList()
) : AdresseerbaarObjectType(
    identificatie,
    domein,
    oppervlakte,
    status,
    geconstateerd,
    documentdatum,
    documentnummer,
    voorkomen
)

data class Ligplaats(
    override val identificatie: String,
    override val domein: String,
    override val oppervlakte: Int?,
    override val status: String,
    override val geconstateerd: String,
    override val documentdatum: String,
    override val documentnummer: String,
    override val voorkomen: Voorkomen,
    val heeftAlsNevenAdres: List<String> = emptyList()
) : AdresseerbaarObjectType(
    identificatie,
    domein,
    oppervlakte,
    status,
    geconstateerd,
    documentdatum,
    documentnummer,
    voorkomen
)

data class Verblijfsobject(
    override val identificatie: String,
    override val domein: String,
    override val oppervlakte: Int?,
    override val status: String,
    override val geconstateerd: String,
    override val documentdatum: String,
    override val documentnummer: String,
    override val voorkomen: Voorkomen,
    val maaktDeelUitVan: List<String> = emptyList()
) : AdresseerbaarObjectType(
    identificatie,
    domein,
    oppervlakte,
    status,
    geconstateerd,
    documentdatum,
    documentnummer,
    voorkomen
)
