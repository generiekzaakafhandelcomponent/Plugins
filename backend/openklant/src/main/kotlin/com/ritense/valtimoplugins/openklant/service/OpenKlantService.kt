package com.ritense.valtimo.openklant.service

import com.ritense.valtimo.openklant.dto.KlantContact
import com.ritense.valtimo.openklant.model.ContactInformation
import com.ritense.valtimo.openklant.model.KlantContactOptions
import com.ritense.valtimo.openklant.model.OpenKlantProperties

interface OpenKlantService {
    suspend fun storeContactInformation(
        properties: OpenKlantProperties,
        contactInformation: ContactInformation,
    ): String

    suspend fun getAllKlantContacten(properties: KlantContactOptions): List<KlantContact>
}