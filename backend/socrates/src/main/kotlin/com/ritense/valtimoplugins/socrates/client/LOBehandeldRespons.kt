package com.ritense.valtimoplugins.socrates.client

class LOBehandeldRespons(
    val berichtId: String,
    val responseId: String,
    val timestamp: String,
    val foutcode: String,
    val foutomschrijving: String,
    val details: String,
    val fouten: List<String>
)
