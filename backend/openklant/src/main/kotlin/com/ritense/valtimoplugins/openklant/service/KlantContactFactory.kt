package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.Betrokkene.Rol
import com.ritense.valtimoplugins.openklant.dto.Contactnaam
import com.ritense.valtimoplugins.openklant.dto.CreateKlantContactRequest
import com.ritense.valtimoplugins.openklant.dto.UuidReference
import com.ritense.valtimoplugins.openklant.model.CreateKlantContactInformation

class KlantContactFactory {
    fun createKlantContactRequest(createKlantContactInformation: CreateKlantContactInformation): CreateKlantContactRequest =
        CreateKlantContactRequest(
            klantcontact = klantcontactRequest(createKlantContactInformation),
            betrokkene = betrokkeneRequest(createKlantContactInformation)
        )

    private fun klantcontactRequest(createKlantContactInformation: CreateKlantContactInformation) =
        CreateKlantContactRequest.KlantContactRequest(
            nummer = null,
            kanaal = createKlantContactInformation.communicationChannel,
            onderwerp = createKlantContactInformation.subject,
            inhoud = createKlantContactInformation.content,
            indicateContactGelukt = true,
            taal = "nld",
            vertrouwelijk = createKlantContactInformation.confidential,
            plaatsgevondenOp = createKlantContactInformation.startDateTime,
        )

    private fun betrokkeneRequest(createKlantContactInformation: CreateKlantContactInformation) =
        CreateKlantContactRequest.BetrokkeneRequest(
            wasPartij = UuidReference(createKlantContactInformation.partijUuid),
            bezoekadres = null,
            correspondentieadres = null,
            contactnaam = contactNaam(createKlantContactInformation),
            rol = Rol.KLANT,
            organisatienaam = null,
            initiator = true
        )

    private fun contactNaam(createKlantContactInformation: CreateKlantContactInformation) = Contactnaam(
        voorletters = createKlantContactInformation.initials,
        voornaam = createKlantContactInformation.firstName,
        voorvoegselAchternaam = createKlantContactInformation.prefixesSurname,
        achternaam = createKlantContactInformation.lastName
    )
}