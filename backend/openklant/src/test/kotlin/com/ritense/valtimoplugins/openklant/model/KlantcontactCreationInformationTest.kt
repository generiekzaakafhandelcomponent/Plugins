package com.ritense.valtimoplugins.openklant.model

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.util.UUID

class KlantcontactCreationInformationTest {
    @Test
    fun `keeps hasBetrokkene as configured`() {
        assertTrue(fromActionProperties(hasBetrokkene = true, partijUuid = UUID.randomUUID().toString()).hasBetrokkene)
        assertFalse(
            fromActionProperties(hasBetrokkene = false, partijUuid = UUID.randomUUID().toString()).hasBetrokkene,
        )
    }

    @Test
    fun `derives hasBetrokkene from the partijUuid when the property is missing`() {
        assertTrue(fromActionProperties(hasBetrokkene = null, partijUuid = UUID.randomUUID().toString()).hasBetrokkene)
    }

    @Test
    fun `derives hasBetrokkene as false when the property is missing and no partijUuid is configured`() {
        assertFalse(fromActionProperties(hasBetrokkene = null, partijUuid = null).hasBetrokkene)
        assertFalse(fromActionProperties(hasBetrokkene = null, partijUuid = "   ").hasBetrokkene)
    }

    @Test
    fun `trims the action property values`() {
        val information =
            fromActionProperties(hasBetrokkene = true, partijUuid = " 6f9a6e25-801e-4677-a69e-b0c35a932fec ")

        assertEquals("6f9a6e25-801e-4677-a69e-b0c35a932fec", information.partijUuid)
        assertEquals("E-mail", information.kanaal)
        assertEquals("nld", information.taal)
    }

    @Test
    fun `keeps indicatieContactGelukt as configured`() {
        assertEquals(true, fromActionProperties(indicatieContactGelukt = " true ").indicatieContactGelukt)
        assertEquals(false, fromActionProperties(indicatieContactGelukt = "false").indicatieContactGelukt)
    }

    @Test
    fun `defaults indicatieContactGelukt to true when the property is missing or blank`() {
        assertEquals(true, fromActionProperties(indicatieContactGelukt = null).indicatieContactGelukt)
        assertEquals(true, fromActionProperties(indicatieContactGelukt = "  ").indicatieContactGelukt)
    }

    private fun fromActionProperties(
        hasBetrokkene: Boolean? = true,
        partijUuid: String? = UUID.randomUUID().toString(),
        indicatieContactGelukt: String? = "true",
    ) = KlantcontactCreationInformation.fromActionProperties(
        referentienummer = null,
        kanaal = " E-mail ",
        onderwerp = "Herinnering: openstaande taak",
        inhoud = null,
        reactie = null,
        indicatieContactGelukt = indicatieContactGelukt,
        vertrouwelijk = "false",
        taal = " nld ",
        plaatsgevondenOp = " 2026-08-31T12:00:00Z ",
        metadata = null,
        hasBetrokkene = hasBetrokkene,
        partijUuid = partijUuid,
        voorletters = "P",
        voornaam = "Pietje",
        voorvoegselAchternaam = "van",
        achternaam = "Puk",
    )
}
