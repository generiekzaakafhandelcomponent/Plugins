package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

import org.hibernate.validator.constraints.Length

data class AdresLocatie(
    override val naamContactpersoon: String? = null,
    override val vestigingsnummerRotterdam: String? = null,
    @field:Length(max = 240)
    val straatnaam: String,
    val huisnummer: String,
    @field:Length(max = 240)
    val huisnummertoevoeging: String? = null,
    override val postcode: String,
    override val plaatsnaam: String,
    override val landcode: String
): Adres(
    naamContactpersoon = naamContactpersoon,
    vestigingsnummerRotterdam = vestigingsnummerRotterdam,
    landcode = landcode,
    plaatsnaam = plaatsnaam,
    postcode = postcode
)
