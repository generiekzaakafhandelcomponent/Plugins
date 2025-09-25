package com.ritense.valtimoplugins.suwinet.model

import com.fasterxml.jackson.databind.node.ObjectNode

data class MotorvoertuigDto(
    val motorVoertuigen: List<Motorvoertuig>
) {
    data class Motorvoertuig(
        val kenteken: String,
        // TODO replace with ObjectNode to src/main/kotlin/com/ritense/valtimo/bbz/service/SoortVoertuig.kt
        val soortMotorvoertuig: ObjectNode,
        val merk: String,
        val model: String,
        val datumEersteInschrijving: String,
        val datumRegistratieAansprakelijkheid: String
    )
}
