package com.ritense.valtimoplugins.openklant.model

import com.ritense.valtimoplugins.openklant.dto.SoortDigitaalAdres
import mu.KotlinLogging

data class AdresInformation(
    val partijUuid: String,
    val adres: String,
    val soortDigitaalAdres: SoortDigitaalAdres,
    val referentie: String,
    val verificatieDatum: String,
) {
    companion object {
        private val logger = KotlinLogging.logger { }

        fun fromActionProperties(
            partijUuid: String,
            adres: String,
            soortDigitaalAdres: String,
            referentie: String,
            verificatieDatum: String,
        ) = AdresInformation(
            partijUuid = partijUuid.trim(),
            adres = adres.trim(),
            soortDigitaalAdres =
                SoortDigitaalAdres.entries
                    .firstOrNull { it.name.equals(soortDigitaalAdres.trim(), ignoreCase = true) }
                    ?: SoortDigitaalAdres.OVERIG
                        .also { logger.warn { "Unknown soortDigitaalAdres: {$soortDigitaalAdres}, using default: {$it}" } },
            referentie = referentie.trim(),
            verificatieDatum = verificatieDatum.trim(),
        )
    }
}
