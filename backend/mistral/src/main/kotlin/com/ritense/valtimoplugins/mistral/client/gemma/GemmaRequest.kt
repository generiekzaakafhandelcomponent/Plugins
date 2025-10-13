package com.ritense.valtimoplugins.mistral.client.gemma

data class GemmaRequest(
    val model: String,
    val messages: List<GemmaMessage>,
    val max_tokens: Int = 500,
    val stream: Boolean = false
)

data class GemmaMessage(
    val role: String,
    val content: String,
)
