package com.ritense.valtimoplugins.notifynl.domain.email

import com.fasterxml.jackson.annotation.JsonProperty

data class SendEmailResponse (
    val content: EmailContent,
    val id: String,
    val reference: String?,
    @JsonProperty("scheduled_for")
    val scheduledFor: String?,
    val template: EmailTemplate,
    val uri: String
) {
    fun formattedResponse(request: EmailRequest): String = """
        Recipient:
        Recipient Phone number: ${request.email}
        Message: ${content.body}
        
        Sender:
        Sender Phone number: ${content.fromEmail}
        Scheduled for: ${scheduledFor ?: "n/a"}
        Reference: ${reference ?: "n/a"}
        URI: $uri
        Message ID: $id
        NotifyNL Template ID: ${request.templateId}
    """.trimIndent()
}

data class EmailContent(
    val body: String,
    @JsonProperty("from_email")
    val fromEmail: String,
    val subject: String
)

data class EmailTemplate(
    val id: String,
    val uri: String,
    val version: Int
)
