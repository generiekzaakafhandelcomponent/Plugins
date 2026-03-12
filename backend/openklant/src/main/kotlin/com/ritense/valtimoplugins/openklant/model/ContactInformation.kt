package com.ritense.valtimoplugins.openklant.model

data class ContactInformation(
    override val bsn: String,
    override val voorletters: String,
    override val voornaam: String,
    override val voorvoegselAchternaam: String,
    override val achternaam: String,
    val emailadres: String,
    val zaaknummer: String,
) : PartijInformation {
    companion object {
        fun fromActionProperties(
            bsn: String,
            voornaam: String,
            voorvoegselAchternaam: String,
            achternaam: String,
            emailadres: String,
            zaaknummer: String,
        ) = ContactInformation(
            bsn = bsn.trim(),
            voorletters = "",
            voornaam = voornaam.trim(),
            voorvoegselAchternaam = voorvoegselAchternaam.trim(),
            achternaam = achternaam.trim(),
            emailadres = emailadres.trim(),
            zaaknummer = zaaknummer.trim(),
        )
    }
}
