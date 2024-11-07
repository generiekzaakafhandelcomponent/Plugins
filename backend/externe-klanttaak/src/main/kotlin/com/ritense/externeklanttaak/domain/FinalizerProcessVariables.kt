package com.ritense.externeklanttaak.domain

enum class FinalizerProcessVariables(val value: String) {
    VERWERKER_TAAK_ID("verwerkerTaakId"),
    EXTERNE_KLANTTAAK_OBJECT_URL("externeKlanttaakObjectUrl"),
    ;

    override fun toString(): String = value
}