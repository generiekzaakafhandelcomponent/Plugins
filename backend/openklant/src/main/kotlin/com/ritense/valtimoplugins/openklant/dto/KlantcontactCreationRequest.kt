package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class KlantcontactCreationRequest(
    @JsonProperty("klantcontact")
    @field:NotBlank
    val klantcontact: KlantContactRequest,

    @JsonProperty("betrokkene")
    val betrokkene: BetrokkeneRequest? = null,

    @JsonProperty("onderwerobject")
    val onderwerpobject: OnderwerpobjectRequest? = null,
) {
    data class KlantContactRequest(
        @JsonProperty("nummer")
        @field:Size(max = 10)
        val nummer: String? = null,

        @JsonProperty("kanaal")
        @field:NotBlank
        @field:Size(max = 50)
        val kanaal: String,

        @JsonProperty("onderwerp")
        @field:NotBlank
        @field:Size(max = 200)
        val onderwerp: String,

        @JsonProperty("inhoud")
        @field:Size(max = 1000)
        val inhoud: String?,

        @JsonProperty("indicatieContactGelukt")
        val indicateContactGelukt: Boolean? = null,

        @JsonProperty("taal")
        @field:NotBlank
        @field:Pattern(
            regexp = "^[A-Za-z]{3}$",
            message = "taal must be of 3 letters (ISO 639-2/B)"
        )
        val taal: String,

        @JsonProperty("vertrouwelijk")
        @field:NotBlank
        val vertrouwelijk: Boolean,

        @JsonProperty("plaatsgevondenOp")
        val plaatsgevondenOp: String? = null,
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
        @field:NotBlank
        val rol: Betrokkene.Rol,

        @JsonProperty("organisatienaam")
        @field:Size(max = 200)
        val organisatienaam: String? = null,

        @JsonProperty("initiator")
        @field:NotBlank
        val initiator: Boolean,
    )

    data class OnderwerpobjectRequest(
        @JsonProperty("wasKlantcontact")
        val wasKlantcontact: UuidReference? = null,
        @JsonProperty("onderwerpobjectidentificator")
        val onderwerpobjectidentificator: Onderwerpobjectidentificator? = null,
    )
}
