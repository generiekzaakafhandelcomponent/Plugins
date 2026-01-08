package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.KlantContact
import com.ritense.valtimoplugins.openklant.model.ContactInformation
import com.ritense.valtimoplugins.openklant.model.KlantContactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties

interface OpenKlantService {
    suspend fun storeContactInformation(
        properties: OpenKlantProperties,
        contactInformation: ContactInformation,
    ): String

    suspend fun getAllKlantContacten(properties: KlantContactOptions): List<KlantContact>

    suspend fun postKlantContact(properties: OpenKlantProperties)
}