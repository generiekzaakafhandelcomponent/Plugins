package com.ritense.valtimoplugins.haalcentraal.brp.model

data class BewoningDto(
    val adresseerbaarObjectIdentificatie: String? = null,
    val bewoners: List<Bewoner>? = emptyList(),
    val mogelijkeBewoners: List<Bewoner>? = emptyList(),
    val indicatieVeelBewoners: Boolean? = null
)
