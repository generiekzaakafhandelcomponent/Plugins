package com.ritense.valtimoplugins.notifynl.domain

import com.fasterxml.jackson.annotation.JsonProperty

data class SendSmsRequest(
    @JsonProperty("phone_number")
    val phoneNumber: String,
    @JsonProperty("template_id")
    val templateId: String
)