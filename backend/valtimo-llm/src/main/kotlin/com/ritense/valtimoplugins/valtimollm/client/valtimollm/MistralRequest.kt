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

const val DEFAULT_MODEL = "open-mistral-nemo-2407"

fun resolveModel(model: String?): String = model?.takeIf { it.isNotBlank() } ?: DEFAULT_MODEL

val MISTRAL_SYSTEM_MESSAGE = MistralMessage(
    role = "system",
    content = """
        You are a writing assistant specialized in producing high-quality plain-text summaries. 
        You organize information logically, maintain clarity and accuracy, and present ideas 
        in a concise, well-structured format.
    """.trimIndent()
)