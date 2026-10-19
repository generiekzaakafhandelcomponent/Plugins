package com.ritense.valtimoplugins.openklant.service

import com.ritense.valtimoplugins.openklant.dto.Betrokkene.Rol
import com.ritense.valtimoplugins.openklant.model.KlantcontactCreationInformation
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.util.UUID

class KlantcontactFactoryTest {
    private val factory = KlantcontactFactory()

    @Test
    fun `creates a request with a betrokkene when hasBetrokkene is true`() {
        val partijUuid = UUID.randomUUID()

        val request =
            factory.createKlantcontactRequest(
                creationInformation(hasBetrokkene = true, partijUuid = partijUuid.toString()),
            )

        val betrokkene = requireNotNull(request.betrokkene)
        assertEquals(partijUuid.toString(), betrokkene.wasPartij?.uuid)
        assertEquals("P", betrokkene.contactnaam?.voorletters)
        assertEquals("Pietje", betrokkene.contactnaam?.voornaam)
        assertEquals("van", betrokkene.contactnaam?.voorvoegselAchternaam)
        assertEquals("Puk", betrokkene.contactnaam?.achternaam)
        assertEquals(Rol.KLANT, betrokkene.rol)
        assertTrue(betrokkene.initiator)
    }

    @Test
    fun `creates a request without a betrokkene when hasBetrokkene is false`() {
        val request = factory.createKlantcontactRequest(creationInformation(hasBetrokkene = false, partijUuid = null))

        assertNull(request.betrokkene)
        assertEquals("E-mail", request.klantcontact.kanaal)
    }

    @Test
    fun `maps the klantcontact fields onto the request`() {
        val request =
            factory.createKlantcontactRequest(
                creationInformation(hasBetrokkene = false, partijUuid = null).copy(
                    referentienummer = "REF-1",
                    reactie = "Bedankt",
                    indicatieContactGelukt = false,
                    metadata = mapOf("bron" to "portaal"),
                ),
            )

        val klantcontact = request.klantcontact
        assertEquals("REF-1", klantcontact.referentienummer)
        assertEquals("Herinnering: openstaande taak", klantcontact.onderwerp)
        assertEquals("E-mailbericht met herinnering openstaande taak", klantcontact.inhoud)
        assertEquals("Bedankt", klantcontact.reactie)
        assertEquals(false, klantcontact.indicatieContactGelukt)
        assertEquals("nld", klantcontact.taal)
        assertEquals(mapOf("bron" to "portaal"), klantcontact.metadata)
    }

    @Test
    fun `ignores betrokkene details when hasBetrokkene is false`() {
        val request =
            factory.createKlantcontactRequest(
                creationInformation(hasBetrokkene = false, partijUuid = UUID.randomUUID().toString()),
            )

        assertNull(request.betrokkene)
    }

    @Test
    fun `throws a descriptive exception when hasBetrokkene is true without a partijUuid`() {
        val exception =
            assertThrows(IllegalArgumentException::class.java) {
                factory.createKlantcontactRequest(creationInformation(hasBetrokkene = true, partijUuid = null))
            }

        assertEquals("No partijUuid was specified to create a betrokkene request", exception.message)
    }

    @Test
    fun `throws a descriptive exception when hasBetrokkene is true with a blank partijUuid`() {
        val exception =
            assertThrows(IllegalArgumentException::class.java) {
                factory.createKlantcontactRequest(creationInformation(hasBetrokkene = true, partijUuid = "   "))
            }

        assertEquals("No partijUuid was specified to create a betrokkene request", exception.message)
    }

    private fun creationInformation(
        hasBetrokkene: Boolean,
        partijUuid: String?,
    ) = KlantcontactCreationInformation(
        referentienummer = null,
        kanaal = "E-mail",
        onderwerp = "Herinnering: openstaande taak",
        inhoud = "E-mailbericht met herinnering openstaande taak",
        reactie = null,
        indicatieContactGelukt = true,
        vertrouwelijk = false,
        taal = "nld",
        plaatsgevondenOp = "2026-08-31T12:00:00Z",
        metadata = null,
        hasBetrokkene = hasBetrokkene,
        partijUuid = partijUuid,
        voorletters = "P",
        voornaam = "Pietje",
        voorvoegselAchternaam = "van",
        achternaam = "Puk",
    )
}
