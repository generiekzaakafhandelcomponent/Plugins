package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.DigitaalAdres
import com.ritense.valtimoplugins.openklant.dto.Klantcontact
import com.ritense.valtimoplugins.openklant.dto.Partij
import com.ritense.valtimoplugins.openklant.model.AdresInformation
import com.ritense.valtimoplugins.openklant.model.ContactInformation
import com.ritense.valtimoplugins.openklant.model.KlantcontactCreationInformation
import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.model.PartijInformation

interface OpenKlantService {
    fun storeContactInformation(
        properties: OpenKlantProperties,
        contactInformation: ContactInformation,
    ): String

    fun getOrCreatePartij(
        properties: OpenKlantProperties,
        partijInformation: PartijInformation,
    ): Partij

    fun setDefaultDigitaalAdres(
        properties: OpenKlantProperties,
        adresInformation: AdresInformation,
    ): DigitaalAdres

    fun getAllKlantcontacten(properties: KlantcontactOptions): List<Klantcontact>

    fun postKlantcontact(
        properties: OpenKlantProperties,
        klantcontactCreationInformation: KlantcontactCreationInformation,
    )
}
