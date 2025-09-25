package com.ritense.valtimoplugins.suwinet.model

data class DuoStudiefinancieringInfoDto(
    val burgerservicenummer: String,
    val studiefinancieringen: List<Studiefinanciering>
) {
    data class Studiefinanciering (
        val dateBeginToekenningsperiodeStufi: String?,
        val dateEindToekenningsperiodeStufi: String?,
        val codeToekenningBasisbeursStufi: String?,
        val indicatieAanvullendeBeursStufi: String?,
        val codeStatusPartnertoeslagStufi: String?,
        val codeStatusEenOudertoeslagStufi: String?,
        val indicatieToekenningWtosVo18: String?
    )
}
