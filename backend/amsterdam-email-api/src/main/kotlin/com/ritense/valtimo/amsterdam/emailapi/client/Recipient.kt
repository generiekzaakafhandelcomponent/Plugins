package com.ritense.valtimo.amsterdam.emailapi.client

import com.fasterxml.jackson.annotation.JsonInclude

data class Recipient(val address: String, val name: String? = null)
