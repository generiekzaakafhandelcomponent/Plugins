package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Betrokkene(
    @JsonProperty("uuid")
    override val uuid: String,
    @JsonProperty("url")
    override val url: String,
    @JsonProperty("wasPartij")
    val wasPartij: UuidAndUrlReference? = null,
    @JsonProperty("hadKlantcontact")
    val hadKlantcontact: UuidAndUrlReference,
    @JsonProperty("digitaleAdressen")
    val digitaleAdressen: List<UuidAndUrlReference>,
    @JsonProperty("bezoekadres")
    val bezoekadres: Adres? = null,
    @JsonProperty("correspondentieadres")
    val correspondentieadres: Adres? = null,
    @JsonProperty("contactnaam")
    val contactnaam: Contactnaam? = null,
    @JsonProperty("volledigeNaam")
    val volledigeNaam: String,
    @JsonProperty("rol")
    val rol: Rol,
    @JsonProperty("organisatienaam")
    val organisatienaam: String? = null,
    @JsonProperty("initiator")
    val initiator: Boolean,
) : Referable {
    data class UuidAndUrlReference(
        @JsonProperty("uuid")
        val uuid: String,

        @JsonProperty("url")
        val url: String
    )

    enum class Rol {
        @JsonProperty("vertegenwoordiger")
        VERTEGENWOORDIGER,

        @JsonProperty("klant")
        KLANT
    }

}
