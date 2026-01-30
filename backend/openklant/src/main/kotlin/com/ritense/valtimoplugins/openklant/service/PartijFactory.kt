package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.Contactnaam
import com.ritense.valtimoplugins.openklant.dto.CreatePartijRequest
import com.ritense.valtimoplugins.openklant.dto.Identificator
import com.ritense.valtimoplugins.openklant.dto.Partij
import com.ritense.valtimoplugins.openklant.model.PartijInformation

class PartijFactory {
    fun createFromBsn(partijInformation: PartijInformation): CreatePartijRequest =
        CreatePartijRequest(
            nummer = "",
            interneNotitie = "",
            digitaleAdressen = emptyList(),
            voorkeursDigitaalAdres = null,
            rekeningnummers = emptyList(),
            voorkeursRekeningnummer = null,
            partijIdentificatoren = listOf(getPartijIdentificator(partijInformation)),
            soortPartij = Partij.SoortPartij.PERSOON,
            indicatieGeheimhouding = false,
            voorkeurstaal = "nld",
            indicatieActief = true,
            bezoekadres = null,
            correspondentieAdres = null,
            partijIdentificatie = getPartijIdentificatie(partijInformation),
        )

    private fun getPartijIdentificator(partijInformation: PartijInformation): Map<String, Identificator> {
        val identificator =
            Identificator(
                objectId = partijInformation.bsn,
                codeObjecttype = "natuurlijk_persoon",
                codeRegister = "brp",
                codeSoortObjectId = "bsn",
            )
        return mapOf("partijIdentificator" to identificator)
    }

    private fun getPartijIdentificatie(partijInformation: PartijInformation): Partij.PartijIdentificatie {
        val contactnaam =
            Contactnaam(
                voorletters = partijInformation.voorletters,
                voornaam = partijInformation.voornaam,
                voorvoegselAchternaam = partijInformation.voorvoegselAchternaam,
                achternaam = partijInformation.lastName,
            )
        return Partij.PartijIdentificatie(contactnaam)
    }
}
