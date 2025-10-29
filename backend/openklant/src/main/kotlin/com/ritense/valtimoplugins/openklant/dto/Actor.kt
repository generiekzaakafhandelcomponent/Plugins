package com.ritense.valtimo.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Actor(
    @JsonProperty("uuid")
    override val uuid: String,
    @JsonProperty("url")
    override val url: String,
    @JsonProperty("naam")
    val naam: String,
    @JsonProperty("soortActor")
    val soortActor: SoortActor,
    @JsonProperty("indicatieActief")
    val indicatieActief: Boolean?,
    @JsonProperty("actoridentificator")
    val actoridentificator: Identificator?,
    @JsonProperty("actoridentificatie")
    val actoridentificatie: Actoridentificatie?,
) : Referable {
    enum class SoortActor {
        @JsonProperty("medewerker")
        MEDEWERKER,

        @JsonProperty("geautomatiseerde_actor")
        GEAUTOMATISEERDE_ACTOR,

        @JsonProperty("organisatorische_eenheid")
        ORGANISATORISCHE_EENHEID,
    }

    sealed class Actoridentificatie {
        data class Medewerker(
            @JsonProperty("functie")
            val functie: String,
            @JsonProperty("emailadres")
            val emailadres: String?,
            @JsonProperty("telefoonnummer")
            val telefoonnummer: String,
        ) : Actoridentificatie()

        data class GeautomatiseerdeActor(
            @JsonProperty("functie")
            val functie: String,
            @JsonProperty("omschrijving")
            val omschrijving: String?,
        ) : Actoridentificatie()

        data class OrganisatorischeEenheid(
            @JsonProperty("omschrijving")
            val omschrijving: String?,
            @JsonProperty("emailadres")
            val emailadres: String?,
            @JsonProperty("faxnummer")
            val faxnummer: String?,
            @JsonProperty("telefoonnummer")
            val telefoonnummer: String?,
        ) : Actoridentificatie()
    }
}