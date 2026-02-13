package com.ritense.valtimoplugins.suwinet.model

import java.math.BigInteger

data class KadastraleObjectenDto(
    val onroerendeGoederen: List<KadastraalObjectDto>,
    val propertiesMap: Map<String, Any?> = mapOf(),
    val properties: List<String> = listOf()
) {
    data class KadastraalObjectDto(
        val codeTypeOnroerendeZaak: String,
        val datumOntstaan: String,
        val kadastraleAanduiding: KadastraleAanduidingDto,
        val omschrijving: String,
        val zakelijkRecht: ZakelijkRechtDto,
        val locatieOz: AdresDto?,
        val publiekrechtelijkeBeperking: List<PubliekrechtelijkeBeperkingDto?>,
        val indicatieMeerGerechtigden: String
    ) {
        data class KadastraleAanduidingDto(
            val codeKadastraleGemeente: String,
            val kadastraleGemeentenaam: String,
            val kadastraleSectie: String,
            val kadastraalPerceelnr: BigInteger,
            val volgnrKadastraalAppartementsrecht: BigInteger,
        )
        data class ZakelijkRechtDto(
            val omschrijvingZakelijkRecht: String,
            val datumEZakelijkRecht: String,
        )
        data class PubliekrechtelijkeBeperkingDto(
            val aantekeningKadastraal: AantekeningKadastraalDto
        ) {
            data class AantekeningKadastraalDto(
                val datumEAantekeningKadastraal: String,
                val omschrijvingAantekeningKadastraal: String
            )
        }
    }
}
