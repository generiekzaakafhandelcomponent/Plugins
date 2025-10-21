package com.ritense.valtimoplugins.notifynl.domain.notification

import com.fasterxml.jackson.annotation.JsonProperty

data class SmsRequest(
    @JsonProperty("phone_number")
    val phoneNumber: String,
    @JsonProperty("template_id")
    val templateId: String
)

data class NotificationRequest(
    @JsonProperty("notification_id")
    val notificationId: String,
)
