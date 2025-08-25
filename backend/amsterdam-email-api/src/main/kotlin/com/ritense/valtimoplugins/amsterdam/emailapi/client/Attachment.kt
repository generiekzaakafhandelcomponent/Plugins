package com.ritense.valtimoplugins.amsterdam.emailapi.client

import java.net.URI

data class Attachment (
    val disposition: String,
    val filename: String?,
    val content: String?,
    val contentType: String?,
    val href: URI
)
