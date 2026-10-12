package com.ritense.valtimoplugins.socrates.model

data class Persoon(
    val burgerservicenummer: String,
    val partner: Partner?,
    val adreshouding: List<Adreshouding>?
)
