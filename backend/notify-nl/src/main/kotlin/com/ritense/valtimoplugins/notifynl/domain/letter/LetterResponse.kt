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
import java.io.Serializable

data class LetterResponse(
    val id: String,
    val reference: String?,
    val content: Content,
    val uri: String,
    val template: Template,
    @JsonProperty("scheduled_for")
    val scheduledFor: String?
) : Serializable

data class Content(
    val subject: String,
    val body: String
) : Serializable

data class Template(
    val id: String,
    val version: Int,
    val uri: String
) : Serializable

data class LetterResponseFlat(
    val id: String,
    val reference: String?,
    val uri: String,
    val scheduledFor: String?,
    val contentSubject: String?,
    val contentBody: String?,
    val templateId: String?,
    val templateUri: String?,
    val templateVersion: Int?
) : Serializable {
    companion object {
        fun from(original: LetterResponse): LetterResponseFlat {
            return LetterResponseFlat(
                id = original.id,
                reference = original.reference,
                uri = original.uri,
                scheduledFor = original.scheduledFor,
                contentSubject = original.content.subject,
                contentBody = original.content.body,
                templateId = original.template.id,
                templateUri = original.template.uri,
                templateVersion = original.template.version
            )
        }
    }
}
