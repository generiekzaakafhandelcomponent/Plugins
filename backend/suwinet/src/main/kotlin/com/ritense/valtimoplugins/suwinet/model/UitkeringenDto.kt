package com.ritense.valtimoplugins.suwinet.model

import java.math.BigDecimal

data class UitkeringenDto(
    val svbUitkeringen: List<Uitkering>
) {
    data class Uitkering(
        val codeSzWet: String,
        val datumBeginUitkeringsverhouding: String,
        val datumEindUitkeringsverhouding: String,
        val periodes: List<UitkeringPeriode>
    )
    data class UitkeringPeriode(
        val brutoBedrag: BigDecimal,
        val nettoBedrag: BigDecimal,
        val datumAanvangUitkeringsperiode: String,
        val datumEindUitkeringsperiode: String,
        val codeUitkeringsperiode: CodesUitkeringsperiodeDto?,
        val codeMunteenheid: String,
        val codeSzWet: String
    )
}

