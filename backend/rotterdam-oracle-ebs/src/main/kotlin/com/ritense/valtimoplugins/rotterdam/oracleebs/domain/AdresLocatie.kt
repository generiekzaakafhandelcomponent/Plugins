package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class AdresLocatie(
    override val naamContactpersoon: String? = null,
    override val vestigingsnummerRotterdam: String? = null,
    val straatnaam: String,
    val huisnummer: String,
    val huisnummertoevoeging: String? = null,
    override val postcode: String,
    override val plaatsnaam: String,
    override val landcode: String
): Adres
