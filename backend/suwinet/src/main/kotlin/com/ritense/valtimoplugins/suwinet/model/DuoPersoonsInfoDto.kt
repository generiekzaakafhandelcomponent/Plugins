package com.ritense.valtimoplugins.suwinet.model

data class DuoPersoonsInfoDto(
    val burgerservicenummer: String,
    val indicatieStartkwalificatieDuo: String,
    val onderwijsOvereenkomst: List<DuoOnderwijsOvereenkomst>,
    val resultaatOpleiding: List<ResultaatOpleidingGeregistrDuo>
) {
    data class DuoOnderwijsOvereenkomst(
        val brin: String,
        val datumInschrijvingOpleiding: String,
        val datumUitschrijvingOpleiding: String,
        val deelnameOpleidingGeregistrDuo: List<DeelnameOpleidingGeregistrDuo>

    ) {
        data class DeelnameOpleidingGeregistrDuo(
            val datumBeginDeelnameOpleiding: String,
            val datumEindDeelnameOpleiding: String,
            val aanduidingLeerjaar: String,
            val codeInschrijvingsvorm: String,
            val codeOnderwijsvorm: String,
            val codeLeerwegMbo: String,
            val inhoudDeelnameOpleiding: InhoudDeelnameOpleidingDuo
        ) {
            data class InhoudDeelnameOpleidingDuo(
                val naamOpleidingKortDuo: String,
                val codeNiveauOpleidingDuo: String,
                val omsStudiegebied: String,
                val omsStudieinhoud: String,
                val omsStudieuitstroom: String
            )
        }
    }

    data class ResultaatOpleidingGeregistrDuo(
        val codeFaseOpleidingDuo: String,
        val inhoudResultaatOpleidingDuo: InhoudResultaatOpleidingDuo,
        val resultaatExamen: ResultaatExamen,
    ) {
        data class InhoudResultaatOpleidingDuo(
            val naamOpleidingKortDuo: String?,
            val codeNiveauOpleidingDuo: String?,
        )

        data class ResultaatExamen(
            val datumResultaatExamen: String?,
            val codeResultaatExamen: String?,
        )
    }
}
