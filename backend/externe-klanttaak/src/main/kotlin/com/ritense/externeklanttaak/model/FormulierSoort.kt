package com.ritense.externeklanttaak.model

import com.fasterxml.jackson.annotation.JsonValue

enum class FormulierSoort(@JsonValue val value: String) {
    ID("id"),
    URL("url"),
    ;

    override fun toString(): String = value
}