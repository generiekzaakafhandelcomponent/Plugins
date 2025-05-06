package com.ritense.valtimoplugins.haalcentraal.brp.model

import java.time.LocalDate


data class Periode(
    val datumVan: LocalDate? = null,
    val datumTot: LocalDate? = null,
)
