package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

import java.time.LocalDate

/**
 * De aanvraag voor een UITKERING die door of voor een CLIENT SUWI bij een
 * UITVOERINGSORGAAN is ingediend.
 */

data class AanvraagUitkeringDto(

    /**
     *  De datum van de dag waarop de AANVRAAG UITKERING door het
     * UITVOERINGSORGAAN is ontvangen.
     */
    val datAanvraagUitkering: LocalDate?,
    val szWet: SzWetDto?,
    val beslissingOpAanvraagUitkering: BeslissingOpAanvraagUitkeringDto?,
    val partnerAanvraagUitkering: PartnerBijstandDto,
    val bron: BronDto?
)
