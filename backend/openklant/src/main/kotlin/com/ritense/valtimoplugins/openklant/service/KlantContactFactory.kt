package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.Betrokkene.Rol
import com.ritense.valtimoplugins.openklant.dto.Contactnaam
import com.ritense.valtimoplugins.openklant.dto.CreateKlantContactRequest
import com.ritense.valtimoplugins.openklant.dto.UuidReference
import com.ritense.valtimoplugins.openklant.model.KlantContactCreationInformation

class KlantContactFactory {
    fun createKlantContactRequest(klantContactCreationInformation: KlantContactCreationInformation): CreateKlantContactRequest =
        CreateKlantContactRequest(
            klantcontact = klantcontactRequest(klantContactCreationInformation),
            betrokkene = betrokkeneRequest(klantContactCreationInformation)
        )

    private fun klantcontactRequest(klantContactCreationInformation: KlantContactCreationInformation) =
        CreateKlantContactRequest.KlantContactRequest(
            nummer = null,
            kanaal = klantContactCreationInformation.communicationChannel,
            onderwerp = klantContactCreationInformation.subject,
            inhoud = klantContactCreationInformation.content,
            indicateContactGelukt = true,
            taal = "nld",
            vertrouwelijk = klantContactCreationInformation.confidential,
            plaatsgevondenOp = klantContactCreationInformation.startDateTime,
        )

    private fun betrokkeneRequest(klantContactCreationInformation: KlantContactCreationInformation) =
        CreateKlantContactRequest.BetrokkeneRequest(
            wasPartij = UuidReference(klantContactCreationInformation.partijUuid),
            bezoekadres = null,
            correspondentieadres = null,
            contactnaam = contactNaam(klantContactCreationInformation),
            rol = Rol.KLANT,
            organisatienaam = null,
            initiator = true
        )

    private fun contactNaam(klantContactCreationInformation: KlantContactCreationInformation) = Contactnaam(
        voorletters = klantContactCreationInformation.initials,
        voornaam = klantContactCreationInformation.firstName,
        voorvoegselAchternaam = klantContactCreationInformation.inFix,
        achternaam = klantContactCreationInformation.lastName
    )
}