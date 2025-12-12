package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class CreatePartijRequest(
    @JsonProperty("nummer")
    val nummer: String,
    @JsonProperty("interneNotitie")
    val interneNotitie: String,
    @JsonProperty("digitaleAdressen")
    val digitaleAdressen: List<UuidReference>?,
    @JsonProperty("voorkeursDigitaalAdres")
    val voorkeursDigitaalAdres: UuidReference?,
    @JsonProperty("rekeningnummers")
    val rekeningnummers: List<UuidReference>?,
    @JsonProperty("voorkeursRekeningnummer")
    val voorkeursRekeningnummer: UuidReference?,
    @JsonProperty("partijIdentificatoren")
    val partijIdentificatoren: List<Map<String, Identificator>>,
    @JsonProperty("soortPartij")
    val soortPartij: Partij.SoortPartij,
    @JsonProperty("indicatieGeheimhouding")
    val indicatieGeheimhouding: Boolean?,
    @JsonProperty("voorkeurstaal")
    val voorkeurstaal: String,
    @JsonProperty("indicatieActief")
    val indicatieActief: Boolean,
    @JsonProperty("bezoekadres")
    val bezoekadres: Partij.Adres?,
    @JsonProperty("correspondentieAdres")
    val correspondentieAdres: Partij.Adres?,
    @JsonProperty("partijIdentificatie")
    val partijIdentificatie: Partij.PartijIdentificatie?,
)