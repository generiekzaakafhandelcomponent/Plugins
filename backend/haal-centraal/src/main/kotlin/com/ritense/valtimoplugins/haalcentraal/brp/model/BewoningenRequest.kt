package com.ritense.valtimo.haalcentraal.brp.model

data class BewoningenRequest(
    val type: String,
    val adresseerbaarObjectIdentificatie: String,
    val peildatum: String?
)
