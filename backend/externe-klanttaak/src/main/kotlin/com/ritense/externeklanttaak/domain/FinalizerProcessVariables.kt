package com.ritense.externeklanttaak.domain

enum class FinalizerProcessVariables(val value: String) {
    EXTERNE_KLANTTAAK_OBJECT_URL("externeKlanttaakObjectUrl"),
    ;

    override fun toString(): String = value
}