package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class CreateKlantContactRequest(
    @JsonProperty("klantcontact")
    val klantcontact: KlantContactRequest,
    @JsonProperty("betrokkene")
    val betrokkene: BetrokkeneRequest? = null,
    @JsonProperty("onderwerobject")
    val onderwerpobject: OnderwerpobjectRequest? = null,
) {
    data class KlantContactRequest(
        @JsonProperty("nummer")
        val nummer: String? = null, // <= 10 chars
        @JsonProperty("kanaal")
        val kanaal: String, // <= 50 chars
        @JsonProperty("onderwerp")
        val onderwerp: String, // <= 200 chars
        @JsonProperty("inhoud")
        val inhoud: String?, // <= 1000 chars
        @JsonProperty("indicatieContactGelukt")
        val indicateContactGelukt: Boolean? = null,
        @JsonProperty("taal")
        val taal: String, // <= 3 chars, OSP 639-2/B format
        @JsonProperty("vertrouwelijk")
        val vertrouwelijk: Boolean,
        @JsonProperty("plaatsgevondenOp")
        val plaatsgevondenOp: String? = null, //date-time
    )

    data class BetrokkeneRequest(
        @JsonProperty("wasPartij")
        val wasPartij: UuidReference? = null,
        @JsonProperty("bezoekadres")
        val bezoekadres: Adres? = null,
        @JsonProperty("correspondentieadres")
        val correspondentieadres: Adres? = null,
        @JsonProperty("contactnaam")
        val contactnaam: Contactnaam? = null,
        @JsonProperty("rol")
        val rol: Betrokkene.Rol,
        @JsonProperty("organisatienaam")
        val organisatienaam: String? = null, // <= 200 chars
        @JsonProperty("initiator")
        val initiator: Boolean,
    )

    data class OnderwerpobjectRequest(
        @JsonProperty("wasKlantcontact")
        val wasKlantcontact: UuidAndUrlReference? = null,
        @JsonProperty("onderwerpobjectidentificator")
        val onderwerpobjectidentificator: Onderwerpobjectidentificator? = null,
    )
}
