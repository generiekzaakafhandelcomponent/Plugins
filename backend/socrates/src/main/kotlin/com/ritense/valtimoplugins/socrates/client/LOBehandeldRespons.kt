package com.ritense.valtimoplugins.socrates.client

import java.io.Serializable

class LOBehandeldRespons (
    val berichtId: String,
    val responseId: String,
    val timestamp: String?,
    val foutcode: String?,
    val foutomschrijving: String?,
    val details: String?,
    val fouten: List<String>?
) : Serializable
