package com.ritense.valtimoplugins.socrates.model

import java.time.LocalDate

data class Partner(
    /**
     * 1 = Partnergehuwd, 2 = Partnergeregistreerd,
     * 3 = Partnerongehuwd, 4 = Overigefamilierelatie
     */
    val partnerRelatietype: Int,
    val ingangsdatumRelatie: LocalDate,
)
