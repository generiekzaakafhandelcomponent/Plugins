/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.notifynl.domain.letter

data class AddressWrapper(
    val address: NominatimAddress
)

data class NominatimAddress(
    val display_name: String?,
    val lat: String?,
    val lon: String?,
    val address: AddressDetails?
)

data class AddressDetails(
    val road: String?,
    val house_number: String?,
    val postcode: String?,
    val city: String?,
    val town: String?,
    val village: String?
)

data class SimpleAddress(
    val street: String,
    val number: String,
    val postalCode: String,
    val city: String
)

fun buildPersonalisation(addresses: List<SimpleAddress>): Personalisation {
    val lines = addresses.map {
        "${it.street} ${it.number}, ${it.postalCode} ${it.city}"
    }

    val padded = List(7) { i -> lines.getOrNull(i) }

    return Personalisation(
        padded[0], padded[1], padded[2], padded[3],
        padded[4], padded[5], padded[6]
    )
}