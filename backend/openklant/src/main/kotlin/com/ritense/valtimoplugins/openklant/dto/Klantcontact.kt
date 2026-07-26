package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Klantcontact(
    @field:JsonProperty("uuid")
    override val uuid: String,
    @field:JsonProperty("url")
    override val url: String,
    @field:JsonProperty("gingOverOnderwerpobjecten")
    val gingOverOnderwerpobjecten: List<ObjectReference>,
    @field:JsonProperty("hadBetrokkenActoren")
    val hadBetrokkenActoren: List<Actor>,
    @field:JsonProperty("omvatteBijlagen")
    val omvatteBijlagen: List<ObjectReference>,
    @field:JsonProperty("hadBetrokkenen")
    val hadBetrokkenen: List<ObjectReference>,
    @field:JsonProperty("leiddeTotInterneTaken")
    val leiddeTotInterneTaken: List<ObjectReference>,
    @field:JsonProperty("nummer")
    val nummer: String?,
    @field:JsonProperty("referentienummer")
    val referentienummer: String?,
    @field:JsonProperty("kanaal")
    val kanaal: String,
    @field:JsonProperty("onderwerp")
    val onderwerp: String,
    @field:JsonProperty("inhoud")
    val inhoud: String?,
    @field:JsonProperty("reactie")
    val reactie: String?,
    @field:JsonProperty("indicatieContactGelukt")
    val indicatieContactGelukt: Boolean?,
    @field:JsonProperty("taal")
    val taal: String,
    @field:JsonProperty("vertrouwelijk")
    val vertrouwelijk: Boolean,
    @field:JsonProperty("plaatsgevondenOp")
    val plaatsgevondenOp: String?,
    @field:JsonProperty("metadata")
    val metadata: Map<String, String>,
    @field:JsonProperty("_expand")
    val expand: Any?,
) : Referable