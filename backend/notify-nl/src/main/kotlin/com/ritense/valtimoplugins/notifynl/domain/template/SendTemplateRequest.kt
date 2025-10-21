package com.ritense.valtimoplugins.notifynl.domain.template

import com.fasterxml.jackson.annotation.JsonProperty

data class TemplateRequest(
    @JsonProperty("template_id")
    val templateId: String,
)

data class AllTemplatesRequest(
    @JsonProperty("template_type")
    val templateType: String,
)