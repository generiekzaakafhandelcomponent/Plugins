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

package com.ritense.valtimoplugins.notifynl.domain.letter

import com.fasterxml.jackson.annotation.JsonProperty

data class LetterResponse(
    val id: String,
    val reference: String?,
    val content: Content,
    val uri: String,
    val template: Template,
    @JsonProperty("scheduled_for")
    val scheduledFor: String?
) {
    fun formattedResponse(request: LetterRequest): String = """
        Letter Details:
        ID: $id
        Reference: ${reference ?: "n/a"}
        Scheduled for: ${scheduledFor ?: "n/a"}
        URI: $uri

        Recipient:
          Address Line 1: ${request.personalisation.address_line_1}
          Address Line 2: ${request.personalisation.address_line_2}
          Address Line 3: ${request.personalisation.address_line_3}

        Content:
          Subject: ${content.subject}
          
        Body:
        ${content.body}

        Template:
          ID: ${template.id}
          Version: ${template.version}
          URI: ${template.uri}
    """.trimIndent()
}

data class Content(
    val subject: String,
    val body: String
)

data class Template(
    val id: String,
    val version: Int,
    val uri: String
)