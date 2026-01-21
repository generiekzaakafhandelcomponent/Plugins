package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.Betrokkene.Rol
import com.ritense.valtimoplugins.openklant.dto.Contactnaam
import com.ritense.valtimoplugins.openklant.dto.KlantcontactCreationRequest
import com.ritense.valtimoplugins.openklant.dto.UuidReference
import com.ritense.valtimoplugins.openklant.model.KlantcontactCreationInformation

class KlantcontactFactory {
    fun createKlantcontactRequest(klantContactCreationInformation: KlantcontactCreationInformation): KlantcontactCreationRequest =
        if (klantContactCreationInformation.hasBetrokkene) {
            KlantcontactCreationRequest(
                klantcontact = klantcontactRequest(klantContactCreationInformation),
                betrokkene = betrokkeneRequest(klantContactCreationInformation)
            )
        } else {
            KlantcontactCreationRequest(
                klantcontact = klantcontactRequest(klantContactCreationInformation),
            )
        }


    private fun klantcontactRequest(klantContactCreationInformation: KlantcontactCreationInformation) =
        KlantcontactCreationRequest.KlantcontactRequest(
            nummer = null,
            kanaal = klantContactCreationInformation.kanaal,
            onderwerp = klantContactCreationInformation.onderwerp,
            inhoud = klantContactCreationInformation.inhoud,
            indicateContactGelukt = true,
            taal = klantContactCreationInformation.taal,
            vertrouwelijk = klantContactCreationInformation.vertrouwelijk,
            plaatsgevondenOp = klantContactCreationInformation.plaatsgevondenOp,
        )

    private fun betrokkeneRequest(klantContactCreationInformation: KlantcontactCreationInformation) =
        KlantcontactCreationRequest.BetrokkeneRequest(
            wasPartij = UuidReference(
                uuid = klantContactCreationInformation.partijUuid
                    ?: throw IllegalArgumentException("No partijUuid was specified to create a betrokkene request")
            ),
            bezoekadres = null,
            correspondentieadres = null,
            contactnaam = contactNaam(klantContactCreationInformation),
            rol = Rol.KLANT,
            organisatienaam = null,
            initiator = true
        )

    private fun contactNaam(klantContactCreationInformation: KlantcontactCreationInformation) = Contactnaam(
        voorletters = klantContactCreationInformation.voorletters,
        voornaam = klantContactCreationInformation.voornaam,
        voorvoegselAchternaam = klantContactCreationInformation.voorvoegselAchternaam,
        achternaam = klantContactCreationInformation.achternaam
    )
}