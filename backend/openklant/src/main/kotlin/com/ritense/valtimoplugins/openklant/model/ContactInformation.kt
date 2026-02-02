package com.ritense.valtimoplugins.openklant.model

data class ContactInformation(
    override val bsn: String,
    override val voorletters: String = "",
    override val voornaam: String,
    override val voorvoegselAchternaam: String,
    override val achternaam: String,
    val emailAddress: String,
    val caseNumber: String,
) : PartijInformation
