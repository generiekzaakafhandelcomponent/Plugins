package com.ritense.valtimoplugins.huggingface.client

data class GemmaRequest(
    val model: String,
    val messages: List<GemmaMessage>,
    val maxTokens: Int = 500,
    val stream: Boolean = false
)

data class GemmaMessage(
    val role: String,
    val content: String,
    val parameters: Map<String, String> = mapOf("decode_mode" to "plain")
)
