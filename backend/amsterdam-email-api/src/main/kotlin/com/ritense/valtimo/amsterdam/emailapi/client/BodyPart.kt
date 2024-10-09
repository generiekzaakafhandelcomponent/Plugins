package com.ritense.valtimo.amsterdam.emailapi.client

import com.fasterxml.jackson.annotation.JsonProperty

data class BodyPart(
    val content: String,
    val mimeType: String,
    val encoding: String
)
