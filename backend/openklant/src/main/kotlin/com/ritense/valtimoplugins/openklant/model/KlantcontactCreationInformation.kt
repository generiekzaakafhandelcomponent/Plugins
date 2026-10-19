package com.ritense.valtimoplugins.openklant.model

import mu.KotlinLogging

data class KlantcontactCreationInformation(
    val referentienummer: String?,
    val kanaal: String,
    val onderwerp: String,
    val inhoud: String?,
    val reactie: String?,
    val indicatieContactGelukt: Boolean?,
    val vertrouwelijk: Boolean,
    val taal: String,
    val plaatsgevondenOp: String,
    val metadata: Map<String, String>?,
    val hasBetrokkene: Boolean,
    val partijUuid: String?,
    val voorletters: String?,
    val voornaam: String?,
    val voorvoegselAchternaam: String?,
    val achternaam: String?,
) {
    companion object {
        private val logger = KotlinLogging.logger { }

        fun fromActionProperties(
            referentienummer: String?,
            kanaal: String,
            onderwerp: String,
            inhoud: String?,
            reactie: String?,
            indicatieContactGelukt: String?,
            vertrouwelijk: String,
            taal: String,
            plaatsgevondenOp: String,
            metadata: Map<String, String>?,
            hasBetrokkene: Boolean?,
            partijUuid: String?,
            voorletters: String?,
            voornaam: String?,
            voorvoegselAchternaam: String?,
            achternaam: String?,
        ) = KlantcontactCreationInformation(
            referentienummer = referentienummer?.trim(),
            kanaal = kanaal.trim(),
            onderwerp = onderwerp,
            inhoud = inhoud,
            reactie = reactie,
            indicatieContactGelukt = resolveIndicatieContactGelukt(indicatieContactGelukt),
            vertrouwelijk = vertrouwelijk.trim().toBoolean(),
            taal = taal.trim(),
            plaatsgevondenOp = plaatsgevondenOp.trim(),
            metadata = metadata,
            hasBetrokkene = hasBetrokkene ?: resolveMissingHasBetrokkene(partijUuid),
            partijUuid = partijUuid?.trim(),
            voorletters = voorletters?.trim(),
            voornaam = voornaam?.trim(),
            voorvoegselAchternaam = voorvoegselAchternaam?.trim(),
            achternaam = achternaam?.trim(),
        )

        /**
         * Before plugin version 1.4.0 indicatieContactGelukt could not be configured and was always sent as
         * true. Process links configured before that version have no value for it, so keep sending true
         * for them instead of silently registering those klantcontacten as unsuccessful.
         */
        private fun resolveIndicatieContactGelukt(indicatieContactGelukt: String?): Boolean =
            indicatieContactGelukt
                ?.trim()
                ?.takeIf { it.isNotEmpty() }
                ?.toBoolean()
                ?: true

        /**
         * Process links configured before plugin version 1.4.0, when the 'heeftBetrokkene' toggle
         * was not persisted, have no hasBetrokkene property at all. Falling back to false would
         * silently register those klantcontacten as anonymous and drop the configured betrokkene,
         * so derive the intent from the presence of a partijUuid instead.
         *
         * Can be removed once no process links predating 1.4.0 are in use.
         */
        private fun resolveMissingHasBetrokkene(partijUuid: String?): Boolean =
            (!partijUuid.isNullOrBlank()).also {
                logger.warn {
                    "Action property 'hasBetrokkene' is missing from the process link. " +
                        "Derived hasBetrokkene = $it from the configured partijUuid. " +
                        "Re-save the process link to store the property explicitly."
                }
            }
    }
}
