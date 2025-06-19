package com.ritense.valtimoplugins.docscanner.client.mistral

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import com.fasterxml.jackson.databind.JsonNode
import java.io.Serializable

@JsonInclude(JsonInclude.Include.NON_NULL)
data class MistralOCRResponse(
    @JsonProperty("pages") val pages: List<MistralOCRPage>,
    @JsonProperty("model") val model: String,
    @JsonProperty("document_annotation") val documentAnnotation: JsonNode?, // i.p.v. Any
    @JsonProperty("usage_info") val usageInfo: MistralOCRUsageInfo
) : Serializable

@JsonInclude(JsonInclude.Include.NON_NULL)
data class MistralOCRPage(
    @JsonProperty("index") val index: Int,
    @JsonProperty("markdown") val markdown: String,
    @JsonProperty("images") val images: List<JsonNode>,
    @JsonProperty("dimensions") val dimensions: MistralOCRDimensions
) : Serializable

@JsonInclude(JsonInclude.Include.NON_NULL)
data class MistralOCRDimensions(
    @JsonProperty("dpi") val dpi: Int,
    @JsonProperty("height") val height: Int,
    @JsonProperty("width") val width: Int
) : Serializable

@JsonInclude(JsonInclude.Include.NON_NULL)
data class MistralOCRUsageInfo(
    @JsonProperty("pages_processed") val pagesProcessed: Int,
    @JsonProperty("doc_size_bytes") val docSizeBytes: Int
) : Serializable

@JsonInclude(JsonInclude.Include.NON_NULL)
data class OCRResult(
    val documentName: String?,
    val pages: Int,
    val content: List<MistralOCRPage>,
    val markdownCombined: String?
) : Serializable
