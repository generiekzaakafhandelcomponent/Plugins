package com.ritense.spotler.domain

data class SpotlerRecipient(
    val email: String,
    val name: String,
    val type: RecipientType
)
