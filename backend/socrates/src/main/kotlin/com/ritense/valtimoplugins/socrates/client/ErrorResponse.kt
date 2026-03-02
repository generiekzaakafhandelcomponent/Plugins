package com.ritense.valtimoplugins.socrates.client

class ErrorResponse(
    val errors: Map<String, List<String>>,
    val status: Int,
    val title: String,
    val traceId: String?,
)
