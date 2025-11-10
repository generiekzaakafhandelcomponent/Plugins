package com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen

import java.math.BigInteger

/**
 *  Het bruto- of nettobedrag dat wordt toegepast als de norm voor het feitelijke uitkeringsbedrag.
 */
data class NormbedragDto(

    /**
     *  De code die de soort aangeeft van het toegepaste NORMBEDRAG.
     */
    val cdSrtNormbedrag: String,

    /**
     *  Code voor de munteenheid van een land.
     *  ISO 4217 (Currency, Code Alphabetic) vb EUR
     *
     */
    val cdMunteenheid: String,

    /**
     * De waarde van een hoeveelheid geld in een bepaalde munteenheid.
     */
    val waardeBedr: BigInteger
)
