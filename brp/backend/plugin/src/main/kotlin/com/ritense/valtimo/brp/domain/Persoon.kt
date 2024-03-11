package com.ritense.valtimo.brp.domain

import com.ritense.valtimo.brp.client.BrpClientResponse

data class Persoon(
    val bsn: String,
    val voornaam: String?,
    val voorletters: String?,
    val tussenvoegsel: String?,
    val achternaam: String?,
    val aanhef: String?,
    val geslachtsaanduiding: Geslachtsaanduiding?,
    val geboortedatum: String?,
    val nationaliteiten: List<Nationaliteit>?,
    val geheimhoudingPersoonsgegevens: Boolean?,
    val adres: Adres?,
    val kinderen: List<Kind>?
) {

    data class Nationaliteit(
        val codeNaamNationaliteit: String?,
    )

    data class Geslachtsaanduiding(
        val code: String?,
        val omschrijving: String?
    )

    data class Adres(
        val codeFunctieAdres: String?,
        val straatnaam: String?,
        val huisnummer: Number?,
        val huisletter: String?,
        val huisnummertoevoeging: String?,
        val postcode: String?,
        val woonplaatsnaam: String?,
    )

    data class Kind(
        val bsn: String?,
        val voornaam: String?,
        val tussenvoegsel: String?,
        val achternaam: String?,
        val geboortedatum: String?
    )

    companion object {
        fun from(
            response: BrpClientResponse,
            filterChildrenOlderThenThirteen: Boolean
        ): Persoon = with(response.personen!!.first()) {
            Persoon(
                bsn = burgerservicenummer,
                voornaam = naam?.voornamen,
                voorletters = naam?.voorletters,
                tussenvoegsel = naam?.voorvoegsel,
                achternaam = naam?.geslachtsnaam,
                aanhef = naam?.aanhef,
                geslachtsaanduiding = Geslachtsaanduiding(
                    geslachtsaanduiding?.code,
                    geslachtsaanduiding?.omschrijving
                ),
                geboortedatum = geboorte?.datum?.datum,
                nationaliteiten = nationaliteiten?.map { nationaliteit ->
                    Nationaliteit(
                        nationaliteit.nationaliteit?.code,
                    )
                },
                geheimhoudingPersoonsgegevens = geheimhoudingPersoonsgegevens,
                adres = Adres(
                    verblijfplaats?.functieAdres?.code,
                    verblijfplaats?.straat,
                    verblijfplaats?.huisnummer,
                    verblijfplaats?.huisletter,
                    verblijfplaats?.huisnummertoevoeging,
                    verblijfplaats?.postcode,
                    verblijfplaats?.woonplaats
                ),
                kinderen =
                mapChildren(this, filterChildrenOlderThenThirteen)?.map { kind ->
                    Kind(
                        kind.burgerservicenummer,
                        kind.naam?.voornamen,
                        kind.naam?.voorvoegsel,
                        kind.naam?.geslachtsnaam,
                        kind.geboorte?.datum?.datum
                    )
                }
            )
        }

        private fun mapChildren(
            persoon: BrpClientResponse.Persoonsinformatie,
            filterChildrenOlderThenThirteen: Boolean
        ): List<BrpClientResponse.Persoonsinformatie.Kind>? =
            if (!persoon.kinderen.isNullOrEmpty() && filterChildrenOlderThenThirteen) {
                persoon.kinderen.filter { it.leeftijd!! < 13 }
            } else null
    }
}