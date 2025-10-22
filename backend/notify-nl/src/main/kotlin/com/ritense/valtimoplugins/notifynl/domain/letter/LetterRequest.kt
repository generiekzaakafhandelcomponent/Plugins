package com.ritense.valtimoplugins.notifynl.domain.letter

import com.fasterxml.jackson.annotation.JsonProperty

data class LetterRequest(
    @JsonProperty("template_id")
    val templateId: String,
    val personalisation: Personalisation
)

data class Personalisation(
    val address_line_1: String?,
    val address_line_2: String?,
    val address_line_3: String?,
    val address_line_4: String?,
    val address_line_5: String?,
    val address_line_6: String?,
    val address_line_7: String?
)
