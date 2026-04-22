package com.ritense.valtimoplugins.openklant.dto

data class Klantcontact(
    override val uuid: String,
    override val url: String,
    val gingOverOnderwerpobjecten: List<ObjectReference>,
    val hadBetrokkenActoren: List<Actor>,
    val omvatteBijlagen: List<ObjectReference>,
    val hadBetrokkenen: List<ObjectReference>,
    val leiddeTotInterneTaken: List<ObjectReference>,
    val nummer: String?,
    val referentienummer: String?,
    val kanaal: String,
    val onderwerp: String,
    val inhoud: String?,
    val reactie: String?,
    val indicatieContactGelukt: Boolean?,
    val taal: String,
    val vertrouwelijk: Boolean,
    val plaatsgevondenOp: String?,
    val metadata: Map<String, String>,
    val expand: Any?,
) : Referable