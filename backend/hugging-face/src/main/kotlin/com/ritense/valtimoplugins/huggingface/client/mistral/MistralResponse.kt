package com.ritense.valtimoplugins.huggingface.client.mistral

import com.fasterxml.jackson.annotation.JsonProperty

data class MistralResponse(
    @JsonProperty("choices") val choices: List<Choice>
)

data class Choice(
    @JsonProperty("index") val index: Int,
    @JsonProperty("message") val message: Message,
)

data class Message(
    @JsonProperty("content") val content: String
)

data class MistralOCRResponse(
    @JsonProperty("pages") val pages: List<MistralOCRPage>,
    @JsonProperty("model") val model: String,
    @JsonProperty("document_annotation") val documentAnnotation: Any?,
    @JsonProperty("usage_info") val usageInfo: MistralOCRUsageInfo
)

data class MistralOCRPage(
    @JsonProperty("index") val index: Int,
    @JsonProperty("markdown") val markdown: String,
    @JsonProperty("images") val images: List<Any>,
    @JsonProperty("dimensions") val dimensions: MistralOCRDimensions
)

data class MistralOCRDimensions(
    @JsonProperty("dpi") val dpi: Int,
    @JsonProperty("height") val height: Int,
    @JsonProperty("width") val width: Int
)

data class MistralOCRUsageInfo(
    @JsonProperty("pages_processed") val pagesProcessed: Int,
    @JsonProperty("doc_size_bytes") val docSizeBytes: Int
)
