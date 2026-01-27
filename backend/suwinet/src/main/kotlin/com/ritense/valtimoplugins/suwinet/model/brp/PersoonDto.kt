package com.ritense.valtimoplugins.suwinet.model.brp

import com.fasterxml.jackson.annotation.JsonInclude
import com.ritense.valtimoplugins.suwinet.model.AdresDto
import com.ritense.valtimoplugins.suwinet.model.AdresType

data class PersoonDto(
    val voornamen: String,
    val voorvoegsel: String,
    val achternaam: String,
    val geboortedatum: String,
    val bsn: String,
    val adresBrp: AdresDto?,
    @JsonInclude(JsonInclude.Include.NON_NULL) val postadresBrp: AdresDto?,
    val verblijfstitel: Verblijfstitel?,
    val verblijfplaatsHistorisch: List<VerblijfplaatsHistorisch>,
    val nationaliteiten: List<NationaliteitDto>?,
    @JsonInclude(JsonInclude.Include.NON_NULL) val kinderenBsns: List<String>?,
    val partnerBsn: String? = "",
    val geslachtsnaamPartner: String? = "",
    val datumOverlijden: String? = "",

    val codeBrpGegevensGeheim:  BrpGegevensGeheim?,
    val anummer: String? = "",

    val naamgebruik: String? = "",
    val geslachtsAanduiding: String? = "",
    ){
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
    data class VerblijfplaatsHistorisch(
        val type: AdresType,
        @JsonInclude(JsonInclude.Include.NON_NULL)
        val adres: AdresDto?,
        val datumBeginAdreshouding: String
    )
}
