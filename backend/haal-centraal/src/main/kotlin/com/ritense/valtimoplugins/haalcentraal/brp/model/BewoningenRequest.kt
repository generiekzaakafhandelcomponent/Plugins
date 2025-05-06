package com.ritense.valtimoplugins.haalcentraal.brp.model

data class BewoningenRequest(
    val type: String,
    val adresseerbaarObjectIdentificatie: String,
    val peildatum: String?
)
