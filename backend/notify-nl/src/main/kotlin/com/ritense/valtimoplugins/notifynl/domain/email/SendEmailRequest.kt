package com.ritense.valtimoplugins.notifynl.domain.email

import com.fasterxml.jackson.annotation.JsonProperty

data class EmailRequest(
    @JsonProperty("email_address")
    val email: String,
    @JsonProperty("template_id")
    val templateId: String
)
