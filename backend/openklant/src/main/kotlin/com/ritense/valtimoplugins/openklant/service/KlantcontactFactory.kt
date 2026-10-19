package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.Betrokkene.Rol
import com.ritense.valtimoplugins.openklant.dto.Contactnaam
import com.ritense.valtimoplugins.openklant.dto.KlantcontactCreationRequest
import com.ritense.valtimoplugins.openklant.dto.UuidReference
import com.ritense.valtimoplugins.openklant.model.KlantcontactCreationInformation
import com.ritense.valtimoplugins.openklant.util.toUuidIfPresent

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
            referentienummer = klantContactCreationInformation.referentienummer,
            kanaal = klantContactCreationInformation.kanaal,
            onderwerp = klantContactCreationInformation.onderwerp,
            inhoud = klantContactCreationInformation.inhoud,
            reactie = klantContactCreationInformation.reactie,
            indicatieContactGelukt = klantContactCreationInformation.indicatieContactGelukt,
            taal = klantContactCreationInformation.taal,
            vertrouwelijk = klantContactCreationInformation.vertrouwelijk,
            plaatsgevondenOp = klantContactCreationInformation.plaatsgevondenOp,
            metadata = klantContactCreationInformation.metadata,
        )

    private fun betrokkeneRequest(klantContactCreationInformation: KlantcontactCreationInformation) =
        KlantcontactCreationRequest.BetrokkeneRequest(
            wasPartij = UuidReference(uuid = partijUuid(klantContactCreationInformation)),
            bezoekadres = null,
            correspondentieadres = null,
            contactnaam = contactNaam(klantContactCreationInformation),
            rol = Rol.KLANT,
            organisatienaam = null,
            initiator = true
        )

    private fun partijUuid(klantContactCreationInformation: KlantcontactCreationInformation): String =
        requireNotNull(klantContactCreationInformation.partijUuid.toUuidIfPresent()) {
            "No partijUuid was specified to create a betrokkene request"
        }.toString()

    private fun contactNaam(klantContactCreationInformation: KlantcontactCreationInformation) = Contactnaam(
        voorletters = klantContactCreationInformation.voorletters,
        voornaam = klantContactCreationInformation.voornaam,
        voorvoegselAchternaam = klantContactCreationInformation.voorvoegselAchternaam,
        achternaam = klantContactCreationInformation.achternaam
    )
}