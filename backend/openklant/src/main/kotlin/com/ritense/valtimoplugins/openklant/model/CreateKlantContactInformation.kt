package com.ritense.valtimoplugins.openklant.model

data class CreateKlantContactInformation(
    val communicationChannel: String,
    val subject: String,
    val content: String,
    val confidential: Boolean,
    val startDateTime: String,

    val partijUuid: String,
    val initials: String,
    val firstName: String,
    val inFix: String,
    val lastName: String,
)
