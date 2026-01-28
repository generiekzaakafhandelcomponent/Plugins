package com.ritense.valtimoplugins.openklant.dto

import com.fasterxml.jackson.annotation.JsonProperty

data class Klantcontact(
    @JsonProperty("uuid")
    override val uuid: String,
    @JsonProperty("url")
    override val url: String,
    @JsonProperty("gingOverOnderwerpobjecten")
    val gingOverOnderwerpobjecten: List<ObjectReference>,
    @JsonProperty("hadBetrokkenActoren")
    val hadBetrokkenActoren: List<Actor>,
    @JsonProperty("omvatteBijlagen")
    val omvatteBijlagen: List<ObjectReference>,
    @JsonProperty("hadBetrokkenen")
    val hadBetrokkenen: List<ObjectReference>,
    @JsonProperty("leiddeTotInterneTaken")
    val leiddeTotInterneTaken: List<ObjectReference>,
    @JsonProperty("nummer")
    val nummer: String?,
    @JsonProperty("kanaal")
    val kanaal: String,
    @JsonProperty("onderwerp")
    val onderwerp: String,
    @JsonProperty("inhoud")
    val inhoud: String?,
    @JsonProperty("indicatieContactGelukt")
    val indicatieContactGelukt: Boolean?,
    @JsonProperty("taal")
    val taal: String,
    @JsonProperty("vertrouwelijk")
    val vertrouwelijk: Boolean,
    @JsonProperty("plaatsgevondenOp")
    val plaatsgevondenOp: String?,
    @JsonProperty("_expand")
    val expand: Any?,
) : Referable
