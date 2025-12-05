package com.ritense.valtimoplugins.openklant.model

import java.net.URI

data class KlantContactOptions(
    override val klantinteractiesUrl: URI,
    override val token: String,
    val objectTypeId: String? = null,
    val objectUuid: String? = null,
) : OpenKlantProperties(klantinteractiesUrl, token)