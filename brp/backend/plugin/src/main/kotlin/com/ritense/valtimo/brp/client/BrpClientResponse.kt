/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimo.brp.client

data class BrpClientResponse(
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
