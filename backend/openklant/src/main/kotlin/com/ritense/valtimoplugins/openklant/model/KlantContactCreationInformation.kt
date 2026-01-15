package com.ritense.valtimoplugins.openklant.model

data class KlantContactCreationInformation(
    val kanaal: String,
    val onderwerp: String,
    val inhoud: String,
    val vertrouwelijk: Boolean,
    val taal: String,
    val plaatsgevondenOp: String,

    val partijUuid: String,
    val voorletters: String,
    val voornaam: String,
    val voorvoegselAchternaam: String,
    val achternaam: String,
)
