package com.ritense.valtimo.kvk.model

import com.fasterxml.jackson.annotation.JsonProperty

data class ZoekenResponse(
    @JsonProperty("pagina")
    val pagina: Int,
    @JsonProperty("resultatenPerPagina")
    val resultatenPerPagina: Int,
    @JsonProperty("totaal")
    val totaal: Int,
    @JsonProperty("resultaten")
    val resultaten: List<Resultaat>,
    @JsonProperty("links")
    val links: List<Link>
)

data class Resultaat(
    @JsonProperty("kvkNummer")
    val kvkNummer: String,
    @JsonProperty("naam")
    val naam: String,
    @JsonProperty("type")
    val type: String,
    @JsonProperty("links")
    val links: List<Link>,
    @JsonProperty("vestigingsnummer")
    val vestigingsnummer: String? = null,
    @JsonProperty("adres")
    val adres: Adres? = null
)

data class Link(
    @JsonProperty("rel")
    val rel: String,
    @JsonProperty("href")
    val href: String
)

data class Adres(
    @JsonProperty("binnenlandsAdres")
    val binnenlandsAdres: BinnenlandsAdres
)

data class BinnenlandsAdres(
    @JsonProperty("type")
    val type: String,
    @JsonProperty("straatnaam")
    val straatnaam: String,
    @JsonProperty("plaats")
    val plaats: String
)

