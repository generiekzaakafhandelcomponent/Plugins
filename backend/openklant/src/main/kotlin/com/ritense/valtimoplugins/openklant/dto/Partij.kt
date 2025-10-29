package com.ritense.valtimo.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Partij(
    @JsonProperty("uuid")
    override val uuid: String,
    @JsonProperty("url")
    override val url: String,
    @JsonProperty("nummer")
    val nummer: String?,
    @JsonProperty("interneNotitie")
    val interneNotitie: String?,
    @JsonProperty("betrokkenen")
    val betrokkenen: List<ObjectReference>,
    @JsonProperty("categorieRelaties")
    val categorieRelaties: List<CategorieRelatiePartij>,
    @JsonProperty("digitaleAdressen")
    val digitaleAdressen: List<ObjectReference>?,
    @JsonProperty("voorkeursDigitaalAdres")
    val voorkeursDigitaalAdres: ObjectReference?,
    @JsonProperty("vertegenwoordigden")
    val vertegenwoordigden: List<ObjectReference>,
    @JsonProperty("rekeningnummers")
    val rekeningnummers: List<ObjectReference>?,
    @JsonProperty("voorkeursRekeningnummer")
    val voorkeursRekeningnummer: ObjectReference?,
    @JsonProperty("partijIdentificatoren")
    val partijIdentificatoren: List<PartijIdentificator>?,
    @JsonProperty("soortPartij")
    val soortPartij: SoortPartij,
    @JsonProperty("indicatieGeheimhouding")
    val indicatieGeheimhouding: Boolean?,
    @JsonProperty("voorkeurstaal")
    val voorkeurstaal: String?,
    @JsonProperty("indicatieActief")
    val indicatieActief: Boolean,
    @JsonProperty("bezoekadres")
    val bezoekadres: Adres?,
    @JsonProperty("correspondentieadres")
    val correspondentieAdres: Adres?,
    @JsonProperty("partijIdentificatie")
    val partijIdentificatie: PartijIdentificatie?,
) : Referable {
    data class CategorieRelatiePartij(
        @JsonProperty("uuid")
        val uuid: String,
        @JsonProperty("url")
        val url: String,
        @JsonProperty("categorieNaam")
        val categorieNaam: Categorie?,
        @JsonProperty("beginDatum")
        val beginDatum: String?,
        @JsonProperty("eindDatum")
        val eindDatum: String?,
    )

    enum class SoortPartij {
        @JsonProperty("contactpersoon")
        CONTACTPERSOON,

        @JsonProperty("persoon")
        PERSOON,

        @JsonProperty("organisatie")
        ORGANISATIE,

        @JsonProperty("ExpandPartij")
        EXPAND_PARTIJ,
    }

    data class Adres(
        @JsonProperty("nummeraanduidingId")
        val nummeraanduidingId: String?,
        @JsonProperty("straatnaam")
        val straatnaam: String?,
        @JsonProperty("huisnummer")
        val huisnummer: Int?,
        @JsonProperty("huisnummertoevoeging")
        val huisnummertoevoeging: String?,
        @JsonProperty("postcode")
        val postcode: String?,
        @JsonProperty("stad")
        val stad: String?,
        @JsonProperty("adresregel1")
        val adresregel1: String?,
        @JsonProperty("adresregel2")
        val adresregel2: String?,
        @JsonProperty("adresregel3")
        val adresregel3: String?,
        @JsonProperty("land")
        val land: String?,
    )

    data class PartijIdentificatie(
        @JsonProperty("contactnaam")
        val contactnaam: Contactnaam?,
        @JsonProperty("volledigeNaam")
        val volledigeNaam: String?,
    )
}