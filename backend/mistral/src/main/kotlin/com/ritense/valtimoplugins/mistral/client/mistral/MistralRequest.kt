package com.ritense.valtimoplugins.mistral.client.mistral

data class MistralRequest(
    val model: String,
    val messages: List<MistralMessage>,
    val max_tokens: Int = 500,
    val stream: Boolean = false
)

data class MistralMessage(
    val role: String,
    val content: String,
)
