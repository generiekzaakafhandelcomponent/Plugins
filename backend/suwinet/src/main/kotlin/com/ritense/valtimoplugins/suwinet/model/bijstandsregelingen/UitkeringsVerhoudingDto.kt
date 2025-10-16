package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

import java.time.LocalDate

data class UitkeringsVerhoudingDto(

    /**
     * De datum van de eerste dag waarop een
     * UITKERINGSVERHOUDING geldt.
     */
    val datBUitkeringsverhouding: LocalDate?,

    /**
     *  De datum van de laatste dag waarop een
     *  UITKERINGSVERHOUDING geldt.
     */
    val datEUitkeringsverhouding: LocalDate?,

    val szWet: SzWetDto?,

    val specifiekeGegevensBijstandUitk: SpecifiekeGegevensBijstandUitkDto?,

    val inkomstenInvloedOpBijstandUitk: List<InkomstenInvloedOpBijstandUitkDto?>?,

    val partnerUitkeringsverhouding: PartnerBijstandDto?,

    val uitkeringsperiodeList: List<UitkeringsPeriodeDto>?,


    )
