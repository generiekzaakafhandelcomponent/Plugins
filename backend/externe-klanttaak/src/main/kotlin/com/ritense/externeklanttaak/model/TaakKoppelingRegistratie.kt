package com.ritense.externeklanttaak.model

import com.fasterxml.jackson.annotation.JsonValue

enum class TaakKoppelingRegistratie(
    @JsonValue val value: String,
) {
    ZAAK("zaak"),
    PRODUCT("product"),
}