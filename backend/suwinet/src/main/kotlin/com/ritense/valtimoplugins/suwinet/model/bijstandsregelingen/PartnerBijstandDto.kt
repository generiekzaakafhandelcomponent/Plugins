package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

import java.time.LocalDate

data class PartnerBijstandDto(
    val burgerservicenr: String?,
    val voorletters: String?,
    val voorvoegsel: String?,
    val significantDeelVanDeAchternaam: String?,
    val geboortedat: String?,
)
