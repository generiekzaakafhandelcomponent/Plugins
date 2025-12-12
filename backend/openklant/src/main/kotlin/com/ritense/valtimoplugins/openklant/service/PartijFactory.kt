package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.Contactnaam
import com.ritense.valtimoplugins.openklant.dto.CreatePartijRequest
import com.ritense.valtimoplugins.openklant.dto.Identificator
import com.ritense.valtimoplugins.openklant.dto.Partij
import com.ritense.valtimoplugins.openklant.model.ContactInformation

class PartijFactory {
    fun createFromBsn(contactInformation: ContactInformation): CreatePartijRequest =
        CreatePartijRequest(
            nummer = "",
            interneNotitie = "",
            digitaleAdressen = emptyList(),
            voorkeursDigitaalAdres = null,
            rekeningnummers = emptyList(),
            voorkeursRekeningnummer = null,
            partijIdentificatoren = listOf(getPartijIdentificator(contactInformation)),
            soortPartij = Partij.SoortPartij.PERSOON,
            indicatieGeheimhouding = false,
            voorkeurstaal = "nld",
            indicatieActief = true,
            bezoekadres = null,
            correspondentieAdres = null,
            partijIdentificatie = getPartijIdentificatie(contactInformation),
        )

    private fun getPartijIdentificator(contactInformation: ContactInformation): Map<String, Identificator> {
        val identificator =
            Identificator(
                objectId = contactInformation.bsn,
                codeObjecttype = "natuurlijk_persoon",
                codeRegister = "brp",
                codeSoortObjectId = "bsn",
            )
        return mapOf("partijIdentificator" to identificator)
    }

    private fun getPartijIdentificatie(contactInformation: ContactInformation): Partij.PartijIdentificatie {
        val contactnaam =
            Contactnaam(
                voorletters = "",
                voornaam = contactInformation.firstName,
                voorvoegselAchternaam = contactInformation.inFix,
                achternaam = contactInformation.lastName,
            )
        return Partij.PartijIdentificatie(contactnaam, contactInformation.fullName)
    }
}