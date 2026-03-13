package com.ritense.valtimoplugins.socrates.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class StraatadresBuitenland(
    override val soortAdres: String,
    val huisnummerBuitenland: Int? = null,
    val landencodeIso: String? = null,
    val landsnaam: String? = null,
    val locatieomschrijvingBuitenland: String? = null,
    val postcodeBuitenland: String? = null,
    val regionaamBuitenland: String? = null,
    val straatnaamBuitenland: String? = null,
    val woonplaatsnaamBuitenland: String? = null,
) : Adres
