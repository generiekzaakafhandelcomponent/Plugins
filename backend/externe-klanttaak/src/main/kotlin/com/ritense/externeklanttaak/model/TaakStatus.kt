package com.ritense.externeklanttaak.model

import com.fasterxml.jackson.annotation.JsonValue

enum class TaakStatus(@JsonValue val value: String) {
    OPEN("open"),
    AFGEROND("afgerond"),
    VERWERKT("verwerkt"),
    GESLOTEN("gesloten"),
    ;

    override fun toString(): String = value
}