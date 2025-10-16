package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

/**
 * De aanvraag voor een UITKERING die door of voor een CLIENT SUWI bij een
 * UITVOERINGSORGAAN is ingediend.
 */

data class AanvraagUitkeringDto(

    val datAanvraagUitkering: String?,
    val szWet: SzWetDto?,
    val beslissingOpAanvraagUitkering: BeslissingOpAanvraagUitkeringDto?,
    val partnerAanvraagUitkering: PartnerBijstandDto,
    val bron: BronDto?
)
