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

package com.ritense.valtimoplugins.valtimos2t.client.mistral

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable

@JsonInclude(JsonInclude.Include.NON_NULL)
data class TranscriptionResult(
    @JsonProperty("text") val text: String,
    @JsonProperty("segments") val segments: List<TranscriptionSegment>?,
    @JsonProperty("language") val language: String?
) : Serializable

@JsonInclude(JsonInclude.Include.NON_NULL)
data class TranscriptionSegment(
    @JsonProperty("start") val start: Double,
    @JsonProperty("end") val end: Double,
    @JsonProperty("text") val text: String
) : Serializable