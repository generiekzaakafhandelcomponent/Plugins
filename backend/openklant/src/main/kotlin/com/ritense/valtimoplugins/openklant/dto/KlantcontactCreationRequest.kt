package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

@JsonInclude(JsonInclude.Include.NON_EMPTY)
data class KlantcontactCreationRequest(
    @field:JsonProperty("klantcontact")
    @field:NotNull
    val klantcontact: KlantcontactRequest,
    @field:JsonProperty("betrokkene")
    val betrokkene: BetrokkeneRequest? = null,
    @field:JsonProperty("onderwerpobject")
    val onderwerpobject: OnderwerpobjectRequest? = null,
) {
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    data class KlantcontactRequest(
        @field:JsonProperty("referentienummer")
        @field:Size(max = 10)
        val referentienummer: String? = null,
        @field:JsonProperty("kanaal")
        @field:NotBlank
        @field:Size(max = 50)
        val kanaal: String,
        @field:JsonProperty("onderwerp")
        @field:NotBlank
        @field:Size(max = 200)
        val onderwerp: String,
        @field:JsonProperty("inhoud")
        @field:Size(max = 1000)
        val inhoud: String? = null,
        @field:JsonProperty("reactie")
        @field:Size(max = 1000)
        val reactie: String? = null,
        @field:JsonProperty("indicatieContactGelukt")
        val indicatieContactGelukt: Boolean? = null,
        @field:JsonProperty("taal")
        @field:NotBlank
        @field:Pattern(
            regexp = "^[A-Za-z]{3}$",
            message = "taal moet 3 letters bevatten (ISO 639-2/B)",
        )
        val taal: String,
        @field:JsonProperty("vertrouwelijk")
        val vertrouwelijk: Boolean,
        @field:JsonProperty("plaatsgevondenOp")
        @field:NotBlank
        val plaatsgevondenOp: String? = null,
        @field:JsonProperty("metadata")
        val metadata: Map<
            @Size(max = 100)
            String,
            @Size(max = 100)
            String,
        >? = null,
    )

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    data class BetrokkeneRequest(
        @field:JsonProperty("wasPartij")
        val wasPartij: UuidReference? = null,
        @field:JsonProperty("bezoekadres")
        val bezoekadres: Adres? = null,
        @field:JsonProperty("correspondentieadres")
        val correspondentieadres: Adres? = null,
        @field:JsonProperty("contactnaam")
        val contactnaam: Contactnaam? = null,
        @field:JsonProperty("rol")
        @field:NotBlank
        val rol: Betrokkene.Rol,
        @field:JsonProperty("organisatienaam")
        @field:Size(max = 200)
        val organisatienaam: String? = null,
        @field:JsonProperty("initiator")
        @field:NotBlank
        val initiator: Boolean,
    )

    @JsonInclude(JsonInclude.Include.NON_NULL)
    data class OnderwerpobjectRequest(
        @field:JsonProperty("wasKlantcontact")
        val wasKlantcontact: UuidReference? = null,
        @field:JsonProperty("onderwerpobjectidentificator")
        val onderwerpobjectidentificator: Onderwerpobjectidentificator? = null,
    )
}
