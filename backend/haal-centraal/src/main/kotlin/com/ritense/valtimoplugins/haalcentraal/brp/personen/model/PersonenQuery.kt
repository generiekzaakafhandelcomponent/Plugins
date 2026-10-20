/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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
 *
 */

package com.ritense.valtimoplugins.haalcentraal.brp.personen.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
sealed class PersonenQuery(
    val type: String,
) {
    abstract val fields: List<String>
    abstract val gemeenteVanInschrijving: String?
}

@JsonInclude(JsonInclude.Include.NON_NULL)
data class RaadpleegMetBurgerservicenummer(
    override val fields: List<String>,
    val burgerservicenummer: List<String>,
    override val gemeenteVanInschrijving: String? = null,
) : PersonenQuery("RaadpleegMetBurgerservicenummer")

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ZoekMetGeslachtsnaamEnGeboortedatum(
    override val fields: List<String>,
    val geslachtsnaam: String,
    val geboortedatum: String,
    val geslacht: String? = null,
    val voorvoegsel: String? = null,
    val voornamen: String? = null,
    val inclusiefOverledenPersonen: Boolean? = null,
    override val gemeenteVanInschrijving: String? = null,
) : PersonenQuery("ZoekMetGeslachtsnaamEnGeboortedatum")

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ZoekMetNaamEnGemeenteVanInschrijving(
    override val fields: List<String>,
    val geslachtsnaam: String,
    val voornamen: String,
    override val gemeenteVanInschrijving: String,
    val geslacht: String? = null,
    val voorvoegsel: String? = null,
    val inclusiefOverledenPersonen: Boolean? = null,
) : PersonenQuery("ZoekMetNaamEnGemeenteVanInschrijving")

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ZoekMetPostcodeEnHuisnummer(
    override val fields: List<String>,
    val postcode: String,
    val huisnummer: Int,
    val huisletter: String? = null,
    val huisnummertoevoeging: String? = null,
    val geboortedatum: String? = null,
    val geslachtsnaam: String? = null,
    val inclusiefOverledenPersonen: Boolean? = null,
    override val gemeenteVanInschrijving: String? = null,
) : PersonenQuery("ZoekMetPostcodeEnHuisnummer")

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ZoekMetStraatHuisnummerEnGemeenteVanInschrijving(
    override val fields: List<String>,
    val straat: String,
    val huisnummer: Int,
    override val gemeenteVanInschrijving: String,
    val huisletter: String? = null,
    val huisnummertoevoeging: String? = null,
    val inclusiefOverledenPersonen: Boolean? = null,
) : PersonenQuery("ZoekMetStraatHuisnummerEnGemeenteVanInschrijving")

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ZoekMetNummeraanduidingIdentificatie(
    override val fields: List<String>,
    val nummeraanduidingIdentificatie: String,
    val inclusiefOverledenPersonen: Boolean? = null,
    override val gemeenteVanInschrijving: String? = null,
) : PersonenQuery("ZoekMetNummeraanduidingIdentificatie")

@JsonInclude(JsonInclude.Include.NON_NULL)
data class ZoekMetAdresseerbaarObjectIdentificatie(
    override val fields: List<String>,
    val adresseerbaarObjectIdentificatie: String,
    val inclusiefOverledenPersonen: Boolean? = null,
    override val gemeenteVanInschrijving: String? = null,
) : PersonenQuery("ZoekMetAdresseerbaarObjectIdentificatie")
