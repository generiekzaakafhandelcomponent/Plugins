package com.ritense.valtimoplugins.socrates.model

import java.time.LocalDate

data class IngangBijstandsuitkering(
    val datumMeldingBijGemeente: LocalDate,
    val gewensteStartdatumUitkering: LocalDate
)
