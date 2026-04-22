package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonInclude
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

@JsonInclude(JsonInclude.Include.NON_EMPTY)
data class KlantcontactCreationRequest(
    @field:NotBlank
    val klantcontact: KlantcontactRequest,
    val betrokkene: BetrokkeneRequest? = null,
    val onderwerpobject: OnderwerpobjectRequest? = null,
) {
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    data class KlantcontactRequest(
        @field:Size(max = 10)
        val referentienummer: String? = null,
        @field:NotBlank
        @field:Size(max = 50)
        val kanaal: String,
        @field:NotBlank
        @field:Size(max = 200)
        val onderwerp: String,
        @field:Size(max = 1000)
        val inhoud: String? = null,
        @field:Size(max = 1000)
        val reactie: String? = null,
        @field:NotNull
        val indicatieContactGelukt: Boolean? = null,
        @field:NotBlank
        @field:Pattern(
            regexp = "^[A-Za-z]{3}$",
            message = "taal must be of 3 letters (ISO 639-2/B)",
        )
        val taal: String,
        val vertrouwelijk: Boolean,
        @field:NotBlank
        val plaatsgevondenOp: String? = null,
        @field:NotNull
        val metadata: Map<
            @Size(max = 100)
            String,
            @Size(max = 100)
            String,
        >? = null,
    )

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    data class BetrokkeneRequest(
        val wasPartij: UuidReference? = null,
        val bezoekadres: Adres? = null,
        val correspondentieadres: Adres? = null,
        val contactnaam: Contactnaam? = null,
        @field:NotBlank
        val rol: Betrokkene.Rol,
        @field:Size(max = 200)
        val organisatienaam: String? = null,
        @field:NotBlank
        val initiator: Boolean,
    )

    @JsonInclude(JsonInclude.Include.NON_NULL)
    data class OnderwerpobjectRequest(
        val wasKlantcontact: UuidReference? = null,
        val onderwerpobjectidentificator: Onderwerpobjectidentificator? = null,
    )
}