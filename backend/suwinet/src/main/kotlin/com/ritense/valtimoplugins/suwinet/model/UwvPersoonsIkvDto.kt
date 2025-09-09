package com.ritense.valtimo.suwinet.model

import java.math.BigDecimal
import java.time.LocalDate

data class UwvPersoonsIkvDto(
    val inkomsten: List<Inkomsten>

) {
    data class Inkomsten(
        val naamRechtspersoon: String?,
        val opgaven: List<InkomstenOpgave>
    )
    data class InkomstenOpgave(
        val brutoSocialeVerzekeringsLoon: BigDecimal,
        val loonLbPremieVolksverzekering: BigDecimal,
        val ingehoudenLbPremieVolksverzekering: BigDecimal,
        val vakantietoeslag: BigDecimal,
        val opgbRechtVakantietoeslag: BigDecimal,
        val extraPrdSalaris: BigDecimal,
        val opgbRechtExtraPrdSalaris: BigDecimal,
        val vergoedingReiskostenOnbelast: BigDecimal,
        val datumAanvangOpgave: String,
        val datumEindOpgave: String,
        val aantalVerloondeUren: Int,
        var codeSoortIkv: UwvSoortIkvDto = UwvSoortIkvDto(),
        var codeSoortArbeidscontract: UwvCodesDto = UwvCodesDto(),
        var codeAardIkv: UwvCodesDto = UwvCodesDto(),
        var indLoonheffingskortingToegepast: UwvCodesDto = UwvCodesDto(),
        val naamRechtspersoon: String?
    )
    data class InkomstenPeriode(
        val datumAanvangPeriode: LocalDate,
        val datumEindPeriode: LocalDate,
        val codeSoortIkv: String,
        val codeSoortArbeidscontract: String,
        var codeAardIkv: String,
        val indLoonheffingskortingToegepast: String
    )
}

