package com.ritense.valtimoplugins.openklant.dto

data class CreateKlantContact(
    val klantContact: KlantContact,
    val betrokkene: Betrokkene,
    val onderwerpobject: Onderwerpobject
)
