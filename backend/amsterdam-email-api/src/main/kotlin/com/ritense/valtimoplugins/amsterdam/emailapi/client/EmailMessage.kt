package com.ritense.valtimoplugins.amsterdam.emailapi.client

import com.fasterxml.jackson.annotation.JsonInclude
import java.util.UUID

@JsonInclude(JsonInclude.Include.NON_EMPTY)
data class EmailMessage(
    val to: Set<Recipient> = emptySet(),
    val content: Set<BodyPart>,
    val subject: String = "",
    val from: Recipient,
    val priority: String = "normal",
    val channel: String = "mail",
    var cc: Set<Recipient> = emptySet(),
    var bcc: Set<Recipient> = emptySet(),
    val messageId: String = UUID.randomUUID().toString(),
    val zaakId: String,
    val relatieCodes: List<Int>,
    val attachments: MutableList<Attachment> = mutableListOf()

)
