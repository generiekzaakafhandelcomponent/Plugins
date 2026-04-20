package com.ritense.valtimoplugins.socrates.model

import java.time.LocalDate

data class Adreshouding(
    /**
     * A = A
     * B = B
     * C = C
     * L = L
     * V = V
     * W = W
     */
    val codeFunctieAdres: String,
    val begindatum: LocalDate,
    val adres: Adres,
)
