package com.ritense.valtimoplugins.openklant.model

import java.net.URI

data class KlantcontactOptions(
    override val klantinteractiesUrl: URI,
    override val token: String,
    val objectTypeId: String? = null,
    val objectUuid: String? = null,
    val bsn: String? = null,
    val partijUuid: String? = null,
) : OpenKlantProperties(klantinteractiesUrl, token) {
    companion object {
        fun fromActionProperties(
            klantinteractiesUrl: URI,
            token: String,
            objectTypeId: String? = null,
            objectUuid: String? = null,
            bsn: String? = null,
            partijUuid: String? = null,
        ) = KlantcontactOptions(
            klantinteractiesUrl,
            token = token,
            bsn = bsn?.trim(),
            partijUuid = partijUuid?.trim(),
            objectTypeId = objectTypeId?.trim(),
            objectUuid = objectUuid?.trim(),
        )
    }
}
