package com.ritense.valtimoplugins.openklant.model

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
            hasBetrokkene: Boolean,
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
            hasBetrokkene = hasBetrokkene,
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
    }
}
