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

sealed class MistralFile
data class MistralDocument(
    val document_url: String,
    val document_name: String?,
    val type: String?
) : MistralFile()

data class MistralImage(
    val image_url: String,
    val type: String?
) : MistralFile()

data class MistralFileRequest(
    val model: String,
    val document: MistralFile,
    val pages: List<Int>? = null,
    val include_image_base64: Boolean = false
)
