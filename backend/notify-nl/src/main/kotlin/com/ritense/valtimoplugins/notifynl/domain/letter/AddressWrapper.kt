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