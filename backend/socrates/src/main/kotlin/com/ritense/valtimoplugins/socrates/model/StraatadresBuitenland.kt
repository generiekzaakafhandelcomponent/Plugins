package com.ritense.valtimoplugins.socrates.model

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
