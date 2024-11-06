package com.ritense.externeklanttaak.model

import com.fasterxml.jackson.annotation.JsonProperty

data class PortaalFormulier(
    val formulier: TaakFormulier,
    val data: Map<String, Any>? = emptyMap(),
    @JsonProperty("verzonden_data")
    var verzondenData: Map<String, Any> = emptyMap(),
)