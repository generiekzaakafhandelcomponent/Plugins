package com.ritense.valtimoplugins.openklant.model

data class KlantcontactCreationInformation(
    val kanaal: String,
    val onderwerp: String,
    val inhoud: String,
    val vertrouwelijk: Boolean,
    val taal: String,
    val plaatsgevondenOp: String,
    val hasBetrokkene: Boolean,
    val partijUuid: String?,
    val voorletters: String?,
    val voornaam: String?,
    val voorvoegselAchternaam: String?,
    val achternaam: String?,
) {
    companion object {
        fun fromActionProperties(
            kanaal: String,
            onderwerp: String,
            inhoud: String,
            vertrouwelijk: String,
            taal: String,
            plaatsgevondenOp: String,
            hasBetrokkene: Boolean,
            partijUuid: String?,
            voorletters: String?,
            voornaam: String?,
            voorvoegselAchternaam: String?,
            achternaam: String?,
        ) = KlantcontactCreationInformation(
            kanaal = kanaal.trim(),
            onderwerp = onderwerp,
            inhoud = inhoud,
            vertrouwelijk = vertrouwelijk.trim().toBoolean(),
            taal = taal.trim(),
            plaatsgevondenOp = plaatsgevondenOp.trim(),
            hasBetrokkene = hasBetrokkene,
            partijUuid = partijUuid?.trim(),
            voorletters = voorletters?.trim(),
            voornaam = voornaam?.trim(),
            voorvoegselAchternaam = voorvoegselAchternaam?.trim(),
            achternaam = achternaam?.trim(),
        )
    }
}
