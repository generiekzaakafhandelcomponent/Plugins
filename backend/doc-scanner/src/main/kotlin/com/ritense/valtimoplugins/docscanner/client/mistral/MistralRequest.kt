package com.ritense.valtimoplugins.docscanner.client.mistral

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
