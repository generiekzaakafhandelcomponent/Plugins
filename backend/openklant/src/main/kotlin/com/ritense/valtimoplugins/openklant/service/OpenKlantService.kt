package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.Klantcontact
import com.ritense.valtimoplugins.openklant.model.ContactInformation
import com.ritense.valtimoplugins.openklant.model.KlantcontactCreationInformation
import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties

interface OpenKlantService {
    suspend fun storeContactInformation(
        properties: OpenKlantProperties,
        contactInformation: ContactInformation,
    ): String

    suspend fun getAllKlantcontacten(properties: KlantcontactOptions): List<Klantcontact>

    suspend fun getAllKlantcontactenByBsn(properties: KlantcontactOptions): List<Klantcontact>

    suspend fun postKlantcontact(
        properties: OpenKlantProperties,
        klantcontactCreationInformation: KlantcontactCreationInformation
    )
}