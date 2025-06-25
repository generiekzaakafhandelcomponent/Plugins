package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

data class AdresPostbus(
    override val naamContactpersoon: String? = null,
    override val vestigingsnummerRotterdam: String? = null,
    val postbus: String,
    override val postcode: String,
    override val plaatsnaam: String,
    override val landcode: String,
): Adres
