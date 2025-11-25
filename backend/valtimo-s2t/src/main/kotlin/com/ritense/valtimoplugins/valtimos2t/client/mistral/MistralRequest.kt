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

import org.springframework.core.io.ByteArrayResource
import org.springframework.http.ContentDisposition
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.util.LinkedMultiValueMap
import org.springframework.util.MultiValueMap
import java.util.Base64

fun buildFormData(
    model: String,
    audioBase64: String,
    fileName: String = "audio.mp3"
): MultiValueMap<String, Any> {

    // Convert base64 to bytes (ignoring the metadata)
    val bytes = Base64.getDecoder()
        .decode(audioBase64.substringAfter(','))

    val headers = HttpHeaders().apply {
        contentType = MediaType.parseMediaType("audio/mpeg")
        contentDisposition = ContentDisposition
            .builder("form-data")
            .name("file")
            .filename(fileName)
            .build()
    }

    val audioEntity = HttpEntity(ByteArrayResource(bytes), headers)

    return LinkedMultiValueMap<String, Any>().apply {
        add("model", model)
        add("file", audioEntity)
    }
}
