package com.ritense.valtimoplugins.openklant.model

data class PartijInformationImpl(
    override val bsn: String,
    override val voorletters: String,
    override val voornaam: String,
    override val voorvoegselAchternaam: String,
    override val achternaam: String,
) : PartijInformation {
    companion object {
        fun fromActionProperties(
            bsn: String,
            voorletters: String,
            voornaam: String,
            voorvoegselAchternaam: String,
            achternaam: String,
        ) = PartijInformationImpl(
            bsn = bsn.trim(),
            voorletters = voorletters.trim(),
            voornaam = voornaam.trim(),
            voorvoegselAchternaam = voorvoegselAchternaam.trim(),
            achternaam = achternaam.trim(),
        )
    }
}
