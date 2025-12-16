package com.ritense.valtimoplugins.socrates.model

import java.time.LocalDate

data class LoBehandeld(
    /**
     * De datum waarop de aanvraag is ingediend.Doorgaans is dit de verzenddatum,
     * echter, de aanvraag kan leiden tot een compleetheid- en juistheidtoets.
     * Dit kan betekenen dat de aanvraag pas later wordt gecompleteerd.
     */
    val aanvraagdatum: LocalDate,

    /**
     * pattern: ^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$
     */
    val aanvraagid: String,

    /**
     * De code van de gemeente, die de aanvraag ontvangt en verwerkt.
     */
    val codeOntvangendeGemeente: String,
    val huishouding: Huishouding,
    val ingangBijstandsuitkering: IngangBijstandsuitkering
)

