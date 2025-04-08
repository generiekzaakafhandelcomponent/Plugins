package com.ritense.valtimo.haalcentraal.brp.model

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class BewoningenResponse(
    val bewoningen: List<Bewoning>? = emptyList()
)
