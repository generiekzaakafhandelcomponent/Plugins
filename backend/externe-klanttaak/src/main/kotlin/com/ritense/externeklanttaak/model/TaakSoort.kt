package com.ritense.externeklanttaak.model

import com.fasterxml.jackson.annotation.JsonValue

enum class TaakSoort(
    @JsonValue val value: String,
) {
    URL("url"),
    PORTAALFORMULIER("portaalformulier"),
    OGONEBETALING("ogonebetaling"),
    ;

    override fun toString(): String = value
}