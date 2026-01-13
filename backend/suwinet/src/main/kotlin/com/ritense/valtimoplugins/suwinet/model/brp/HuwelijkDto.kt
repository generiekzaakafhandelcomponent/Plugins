package com.ritense.valtimoplugins.suwinet.model.brp

import java.time.LocalDate

class HuwelijkDto(
    val datHuwelijkssluiting: LocalDate,
    val datOntbindingHuwelijk: LocalDate?,
    val partner: PartnerDto?
)
