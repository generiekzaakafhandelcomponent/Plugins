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

package com.ritense.valtimoplugins.notifynl.domain.template

import com.fasterxml.jackson.annotation.JsonProperty

data class GetTemplateResponse(
    val id: String,
    val name: String,
    val type: String,
    @JsonProperty("created_at")
    val createdAt: String,
    @JsonProperty("updated_at")
    val updatedAt: String?,
    val version: Int,
    @JsonProperty("created_by")
    val createdBy: String,
    val subject: String?,
    val body: String,
    @JsonProperty("letter_contact_block")
    val letterContactBlock: String?
) {
    fun formattedResponse(request: TemplateRequest): String = """
        Template Details:
        ID: $id
        Name: $name
        Type: $type
        Version: $version
        Created at: $createdAt
        Updated at: ${updatedAt ?: "n/a"}
        Created by: $createdBy
        Letter Contact Block: ${letterContactBlock ?: "n/a"}
        
        Subject: ${subject ?: "n/a"}
    
        Body:
        $body
    """.trimIndent()
}

data class GetAllTemplatesResponse(
    val templates: List<GetTemplateResponse>
) {
    fun formattedResponse(request: AllTemplatesRequest): String = buildString {
        appendLine("Templates (${templates.size} total):")
        appendLine("--------------------------------------------------")

        templates.forEach { template ->
            appendLine(
                """
                ID: ${template.id}
                Name: ${template.name}
                Type: ${template.type}
                Version: ${template.version}
                Created at: ${template.createdAt}
                Updated at: ${template.updatedAt ?: "n/a"}
                Created by: ${template.createdBy}
                Letter Contact Block: ${template.letterContactBlock ?: "n/a"}
                
                Subject: ${template.subject ?: "n/a"}
                
                Body:
                ${template.body}
                --------------------------------------------------
                """.trimIndent()
            )
        }
    }
}

