package com.ritense.valtimoplugins.socrates.model

import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "SoortAdres",
    visible = true
)
@JsonSubTypes(
    JsonSubTypes.Type(value = NederlandsStraatadres::class, name = "1"),
    JsonSubTypes.Type(value = NederlandsPostbusadres::class, name = "2"),
    JsonSubTypes.Type(value = StraatadresBuitenland::class, name = "3")
)
sealed interface Adres {
    /**
     * 1 = NederlandsStraatadres
     * 2 = NederlandsPostbusadres
     * 3 = StraatadresBuitenland
     */
    @get:JsonProperty("SoortAdres")
    val soortAdres: String
}
