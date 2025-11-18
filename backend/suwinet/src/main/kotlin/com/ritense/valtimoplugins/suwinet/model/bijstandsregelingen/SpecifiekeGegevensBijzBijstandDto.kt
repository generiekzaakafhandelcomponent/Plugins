package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

import java.time.LocalDate


/**
 *  De gegevens die specifiek betrekking hebben op de Bijzondere Bijstand, een regeling binnen de
 * Participatiewet
 */
data class SpecifiekeGegevensBijzBijstandDto(

    val cdClusterBijzBijstand: String?,

    /**
     *  Omschrijving soort kosten Bijzondere Bijstand
     */
    val omsSrtKostenBijzBijstand: String?,

    /**
     *  Datum betaalbaarstelling Bijzondere Bijstand
     */
    val datBetaalbaarBijzBijstand: LocalDate?,

    val partnerBijzBijstand: PartnerBijstandDto?,
    val szWet: SzWetDto?,
    val bron: BronDto?

)
