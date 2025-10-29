package com.ritense.valtimo.openklant.model

data class ContactInformation(
    val bsn: String,
    val firstName: String,
    val inFix: String,
    val lastName: String,
    val emailAddress: String,
    val caseNumber: String,
) {
    val fullName by lazy {
        listOf(firstName, inFix, lastName)
            .filter { it.isNotBlank() }
            .joinToString(" ")
    }
}