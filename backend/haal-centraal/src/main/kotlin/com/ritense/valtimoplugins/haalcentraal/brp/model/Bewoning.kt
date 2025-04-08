package com.ritense.valtimo.haalcentraal.brp.model

data class Bewoning(
    val adresseerbaarObjectIdentificatie: String? = null,
    val periode: Periode? = null,
    val bewoners: List<Bewoner>? = emptyList(),
    val mogelijkeBewoners: List<Bewoner>? = emptyList(),
    val indicatieVeelBewoners: Boolean? = null
)
