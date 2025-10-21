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

