package com.ritense.valtimoplugins.notifynl.domain.letter

import com.fasterxml.jackson.annotation.JsonProperty

data class LetterResponse(
    val id: String,
    val reference: String?,
    val content: Content,
    val uri: String,
    val template: Template,
    @JsonProperty("scheduled_for")
    val scheduledFor: String?
) {
    fun formattedResponse(request: LetterRequest): String = """
        Letter Details:
        ID: $id
        Reference: ${reference ?: "n/a"}
        Scheduled for: ${scheduledFor ?: "n/a"}
        URI: $uri

        Recipient:
          Address Line 1: ${request.personalisation.address_line_1}
          Address Line 2: ${request.personalisation.address_line_2}
          Address Line 3: ${request.personalisation.address_line_3}

        Content:
          Subject: ${content.subject}
          
        Body:
        ${content.body}

        Template:
          ID: ${template.id}
          Version: ${template.version}
          URI: ${template.uri}
    """.trimIndent()
}

data class Content(
    val subject: String,
    val body: String
)

data class Template(
    val id: String,
    val version: Int,
    val uri: String
)