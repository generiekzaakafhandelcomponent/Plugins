/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.ritense.valtimoplugins.valtimoocr.client.mistral

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
