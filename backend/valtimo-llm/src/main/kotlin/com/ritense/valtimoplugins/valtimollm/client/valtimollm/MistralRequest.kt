package com.ritense.valtimoplugins.valtimollm.client.valtimollm

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

val MISTRAL_SYSTEM_MESSAGE = MistralMessage(
    role = "system",
    content = """
        You are a writing assistant that summarizes well-structured plain text.
    """.trimIndent()
)