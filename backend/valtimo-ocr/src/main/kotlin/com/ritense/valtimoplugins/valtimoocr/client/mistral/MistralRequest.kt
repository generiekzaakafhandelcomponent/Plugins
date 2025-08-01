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
