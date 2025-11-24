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
 */

package com.ritense.valtimoplugins.valtimollm.client

import com.fasterxml.jackson.annotation.JsonProperty

data class SummaryResponse(
    val id: String?,
    val objectType: String? = null,
    val created: Long? = null,
    val model: String?,
    val choices: List<Choice>?,
    val usage: Usage? = null
) {
    val summaryText: String
        get() = choices?.firstOrNull()?.message?.content ?: ""
}

data class Choice(
    val index: Int?,
    val message: Message?,
    @JsonProperty("finish_reason") val finishReason: String?
)

data class Message(
    val role: String?,
    val content: String?
)

data class Usage(
    @JsonProperty("prompt_tokens") val promptTokens: Int?,
    @JsonProperty("completion_tokens") val completionTokens: Int?,
    @JsonProperty("total_tokens") val totalTokens: Int?
)