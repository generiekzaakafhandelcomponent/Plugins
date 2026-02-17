package com.ritense.valtimoplugins.suwinet.model

import java.math.BigInteger

data class KadastraleAanduidingDto(
    val cdKadastraleGemeente: String = "",
    val kadastraleGemeentenaam: String = "",
    val kadastraleSectie: String = "",
    val kadastraalPerceelnr: BigInteger = BigInteger.ZERO,
    val volgnrKadastraalAppartementsrecht: BigInteger = BigInteger.ZERO
)
