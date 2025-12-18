package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.client.OpenKlantClient
import com.ritense.valtimoplugins.openklant.dto.CreateDigitaalAdresRequest
import com.ritense.valtimoplugins.openklant.dto.DigitaalAdres
import com.ritense.valtimoplugins.openklant.dto.KlantContact
import com.ritense.valtimoplugins.openklant.dto.Partij
import com.ritense.valtimoplugins.openklant.dto.SoortDigitaalAdres
import com.ritense.valtimoplugins.openklant.model.ContactInformation
import com.ritense.valtimoplugins.openklant.model.KlantContactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties

class DefaultOpenKlantService(
    private val openKlantClient: OpenKlantClient,
    private val partijFactory: PartijFactory,
) : OpenKlantService {
    override suspend fun storeContactInformation(
        properties: OpenKlantProperties,
        contactInformation: ContactInformation,
    ): String {
        val partij = openKlantClient.getPartijByBsn(contactInformation.bsn, properties)
        return if (partij != null) {
            if (!isPreferredAddress(contactInformation.emailAddress, partij, properties)) {
                updateExistingPartij(partij, contactInformation, properties)
            }
            partij.uuid
        } else {
            createAndStoreNewPartij(contactInformation, properties)
        }
    }

    override suspend fun getAllKlantContacten(properties: KlantContactOptions): List<KlantContact> =
        openKlantClient.getKlantContacten(properties).results

    private suspend fun isPreferredAddress(
        emailAddress: String,
        partij: Partij,
        properties: OpenKlantProperties,
    ): Boolean {
        val voorkeursAdresUuid = partij.voorkeursDigitaalAdres?.uuid ?: return false
        val voorkeursAdres = openKlantClient.getDigitaalAdresByUuid(voorkeursAdresUuid, properties)
        return voorkeursAdres.adres == emailAddress
    }

    private suspend fun createDigitalAddress(
        partij: Partij,
        contactInformation: ContactInformation,
        properties: OpenKlantProperties,
    ): DigitaalAdres =
        openKlantClient.createDigitaalAdres(
            CreateDigitaalAdresRequest(
                verstrektDoorPartij = partij.getUuidReference(),
                adres = contactInformation.emailAddress,
                soortDigitaalAdres = SoortDigitaalAdres.EMAIL,
                referentie = contactInformation.caseNumber,
            ),
            properties,
        )

    private suspend fun createNewPartij(
        contactInformation: ContactInformation,
        properties: OpenKlantProperties,
    ): Partij {
        val newPartij = partijFactory.createFromBsn(contactInformation)
        return openKlantClient.createPartij(newPartij, properties)
    }

    private suspend fun updateExistingPartij(
        partij: Partij,
        contactInformation: ContactInformation,
        properties: OpenKlantProperties,
    ) {
        val digitaleAdressen =
            openKlantClient
                .getDigitaleAdressenByPartijByUuid(
                    partij.getObjectReference().uuid,
                    properties,
                ).toMutableList()

        val digitaleUniekeReferenties =
            digitaleAdressen.map {
                "${it.verstrektDoorPartij?.uuid},${it.referentie},${it.soortDigitaalAdres}"
            }

        // Maak alleen nieuwe aan wanneer deze uniek is (niet bestaat)
        if ("${partij.getUuidReference().uuid},${contactInformation.caseNumber},${SoortDigitaalAdres.EMAIL}" !in
            digitaleUniekeReferenties
        ) {
            digitaleAdressen.add(createDigitalAddress(partij, contactInformation, properties))
        }

        updateDigitaleAdressenForPartij(partij, digitaleAdressen.toList(), properties)
    }

    private suspend fun createAndStoreNewPartij(
        contactInformation: ContactInformation,
        properties: OpenKlantProperties,
    ): String {
        val partij = openKlantClient.getPartijByBsn(contactInformation.bsn, properties)
        return if (partij != null) {
            if (!isPreferredAddress(contactInformation.emailAddress, partij, properties)) {
                updateExistingPartij(partij, contactInformation, properties)
            }
            partij.uuid
        } else {
            val nieuwePartij = createNewPartij(contactInformation, properties)
            val nieuweDigitaleAdress = createDigitalAddress(nieuwePartij, contactInformation, properties)

            updateDigitaleAdressenForPartij(nieuwePartij, nieuweDigitaleAdress, properties)
            return nieuwePartij.uuid
        }
    }

    private suspend fun updateDigitaleAdressenForPartij(
        partij: Partij,
        digitaleAdressen: List<DigitaalAdres>,
        properties: OpenKlantProperties,
    ) {
        val patchData =
            mapOf(
                "digitaleAdressen" to digitaleAdressen.map { it.getUuidReference() },
            )
        openKlantClient.patchPartij(partij.uuid, patchData, properties)
    }

    private suspend fun updateDigitaleAdressenForPartij(
        partij: Partij,
        digitaleAdress: DigitaalAdres,
        properties: OpenKlantProperties,
    ) = updateDigitaleAdressenForPartij(partij, listOf(digitaleAdress), properties)
}
