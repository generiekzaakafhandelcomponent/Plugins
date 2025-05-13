package com.ritense.valtimoplugins.huggingface.client.mistral

data class MistralRequest(
    val model: String,
    val messages: List<MistralMessage>,
    val maxTokens: Int = 500,
    val stream: Boolean = false
)

data class MistralMessage(
    val role: String,
    val content: String,
    val parameters: Map<String, String> = mapOf("decode_mode" to "plain")
)
