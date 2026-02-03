package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

import java.time.LocalDate

data class BeslissingOpAanvraagUitkeringDto(

    /**
     *  De code die aangeeft welke beslissing is genomen op de
     * AANVRAAG UITKERING van de CLIENT SUWI.
     */
    val cdBeslissingOpAanvraagUitkering: String?,

    /**
     * De datum van de dag die als dagtekening is opgenomen in de brief
     * aan CLIENT SUWI waarin de beslissing op zijn/haar AANVRAAG
     * UITKERING kenbaar wordt gemaakt.
     */
    val datDagtekeningBeslisOpAanvrUitk: String?
)
