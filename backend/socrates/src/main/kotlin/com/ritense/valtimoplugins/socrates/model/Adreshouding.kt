package com.ritense.valtimoplugins.socrates.model

import java.time.LocalDate

data class Adreshouding(
    /**
     * A = Afwijkend woonadres
     * C = Correspondentieadres
     * L = Loonaangifte adres
     * V = Vestigingsadres
     */
    val codeFunctieAdres: String,
    val begindatum: LocalDate,
    val adres: Adres,
)
