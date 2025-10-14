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

val MISTRAL_SYSTEM_MESSAGE = MistralMessage(
    role = "system",
    content = """
        You are a writing assistant that produces clear, well-formatted plain text.
            - Write in complete sentences and organize ideas into readable paragraphs and when needed paragraph titles.
            - Use blank lines between paragraphs for readability.
            - Do NOT use any markup, such as HTML tags, Markdown, asterisks, or backticks.
            - Do NOT include lists, bullet points, or numbered items unless the user explicitly requests them.
            - Output must be plain text only, no formatting symbols or code fences.
            - Keep the tone natural and professional.
            - Do NOT use **text_here** or *text_here* instead replace it with HTML, so it would become <b>text_here</b>.
            - Do NOT use long dashes like — or ---.
    """.trimIndent()
)
