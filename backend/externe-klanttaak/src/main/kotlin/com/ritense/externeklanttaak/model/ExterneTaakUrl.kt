package com.ritense.externeklanttaak.model

import com.fasterxml.jackson.annotation.JsonValue

data class ExterneTaakUrl(
    @JsonValue val url: String
)