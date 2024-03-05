package com.ritense.valtimo.implementation.haalcentraal.brp.client

data class HaalCentraalBrpResponse(
    val personen: List<Persoonsinformatie>?,
    val type: String?,
) {

    data class Persoonsinformatie(

        val burgerservicenummer: String,
        val naam: Naam?,
        val geslachtsaanduiding: CodeValue?,
        val geboorte: Geboorte?,
        val nationaliteiten: List<Nationaliteit>?,
        val geheimhoudingPersoonsgegevens: Boolean?,
        val verblijfplaats: Adres?,
        val kinderen: List<Kind>?
    ) {
        data class CodeValue(
            val code: String?,
            val omschrijving: String?
        )

        data class Datum(
            val datum: String?,
            val type: String?
        )

        data class Nationaliteit(
            val type: String?,
            val datumIngangGeldigheid: Datum?,
            val nationaliteit: CodeValue?,
            val redenOpname: CodeValue?
        )

        data class Adres(
            val type: String?,
            val functieAdres: CodeValue?,
            val straat: String?,
            val huisnummer: Int?,
            val huisletter: String?,
            val huisnummertoevoeging: String?,
            val postcode: String?,
            val woonplaats: String?
        )

        data class Kind(
            val type: String?,
            val burgerservicenummer: String?,
            val leeftijd: Int?,
            val naam: NaamGerelateerde?,
            val geboorte: Geboorte?,
        )

        data class Naam(
            val aanhef: String?,
            val voornamen: String?,
            val voorvoegsel: String?,
            val geslachtsnaam: String?,
            val voorletters: String?
        )

        data class NaamGerelateerde(
            val voornamen: String?,
            val voorvoegsel: String?,
            val geslachtsnaam: String?
        )

        data class Geboorte(
            val datum: Datum?,
            val land: CodeValue?,
            val plaats: CodeValue?,
        )
    }
}
