package com.ritense.valtimoplugins.openklant.model

import java.net.URI

data class KlantcontactOptions(
    override val klantinteractiesUrl: URI,
    override val token: String,
    val objectTypeId: String? = null,
    val objectUuid: String? = null,
    val bsn: String? = null,
) : OpenKlantProperties(klantinteractiesUrl, token)