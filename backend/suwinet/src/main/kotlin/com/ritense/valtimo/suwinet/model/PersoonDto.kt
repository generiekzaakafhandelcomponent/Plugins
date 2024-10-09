package com.ritense.valtimo.suwinet.model

import com.fasterxml.jackson.annotation.JsonInclude

data class PersoonDto(
    val voornamen: String,
    val voorvoegsel: String,
    val achternaam: String,
    val geboortedatum: String,
    val bsn: String,
    val adresBrp: AdresDto?,
    @JsonInclude(JsonInclude.Include.NON_NULL) val postadresBrp: AdresDto?,
    val verblijfstitel: Verblijfstitel?,
    val nationaliteiten: List<NationaliteitDto>?,
    @JsonInclude(JsonInclude.Include.NON_NULL) val kinderenBsns: List<String>?,
    val partnerBsn: String? = "",
    val datumOverlijden: String? = ""
) {
    data class Verblijfstitel(
        val codeVerblijfstitel: CodeVerblijfstitel,
        val datumAanvangVerblijfstitel: String,
        val datumEindeVerblijfstitel: String
    ) {
        data class CodeVerblijfstitel(
            val code: String,
            val name: String
        )
    }
}