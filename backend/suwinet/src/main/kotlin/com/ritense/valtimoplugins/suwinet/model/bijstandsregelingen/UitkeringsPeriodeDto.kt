package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

import java.time.LocalDate

/**
 *  Een uitkeringsperiode is een tijdvak binnen een UITKERINGSVERHOUDING waarover daadwerkelijk
 * een UITKERING wordt verstrekt.
 */
data class UitkeringsPeriodeDto(

    /**
     *  De datum van de eerste dag waarop een UITKERINGSPERIODE
     * binnen een UITKERINGSVERHOUDING geldt.
     */
    val datBUitkeringsperiode: LocalDate?,

    /**
     *  De datum van de laatste dag waarop een UITKERINGSPERIODE
     * binnen een UITKERINGSVERHOUDING geldt.
     */
    val datEUitkeringsperiode: LocalDate?,


    val normbedrag: List<NormbedragDto>?
)
