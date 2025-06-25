package com.ritense.valtimoplugins.rotterdam.oracleebs.domain

import org.hibernate.validator.constraints.Length

abstract class Adres(
    @field:Length(max = 360)
    open val naamContactpersoon: String? = null,
    @field:Length(max = 30)
    open val vestigingsnummerRotterdam: String? = null,
    @field:Length(max = 60)
    open val postcode: String,
    @field:Length(max = 60)
    open val plaatsnaam: String,
    @field:Length(max = 60)
    open val landcode: String
)
