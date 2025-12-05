package com.ritense.valtimoplugins.openklant.service
import com.ritense.valtimoplugins.openklant.client.OpenKlantClient
import com.ritense.valtimoplugins.openklant.dto.CreateDigitaalAdresRequest
import com.ritense.valtimoplugins.openklant.dto.CreatePartijRequest
import com.ritense.valtimoplugins.openklant.dto.DigitaalAdres
import com.ritense.valtimoplugins.openklant.dto.ObjectReference
import com.ritense.valtimoplugins.openklant.dto.Partij
import com.ritense.valtimoplugins.openklant.dto.SoortDigitaalAdres
import com.ritense.valtimoplugins.openklant.dto.UuidReference
import com.ritense.valtimoplugins.openklant.model.ContactInformation
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import io.mockk.MockKAnnotations
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.impl.annotations.MockK
import io.mockk.junit5.MockKExtension
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import java.net.URI

@ExtendWith(MockKExtension::class)
class OpenKlantServiceTest {
    private val testProperties =
        OpenKlantProperties(
            klantinteractiesUrl = URI("https://example.com"),
            token = "dummy-token",
        )

    @MockK
    lateinit var client: OpenKlantClient

    @MockK
    lateinit var partijFactory: PartijFactory
    lateinit var service: OpenKlantService
    private val defaultDigitaalAdres =
        DigitaalAdres(
            uuid = "ded28f8e-7da9-4ca6-96d5-2955f5641fd6",
            url = "https://example.com",
            verstrektDoorBetrokkene = null,
            verstrektDoorPartij = null,
            adres = "",
            soortDigitaalAdres = SoortDigitaalAdres.OVERIG,
            isStandaardAdres = false,
            omschrijving = null,
            referentie = null,
            expand = null,
        )
    private val defaultPartij =
        Partij(
            uuid = "24c482c7-acec-410f-95e6-72781a9f3064",
            url = "https://example.com",
            nummer = null,
            interneNotitie = null,
            betrokkenen = emptyList(),
            categorieRelaties = emptyList(),
            digitaleAdressen = null,
            voorkeursDigitaalAdres =
                ObjectReference(
                    uuid = "4ba49f26-4b22-4183-a269-bd340b10eac8",
                    url = "https://example.com",
                ),
            vertegenwoordigden = emptyList(),
            rekeningnummers = null,
            voorkeursRekeningnummer = null,
            partijIdentificatoren = null,
            soortPartij = Partij.SoortPartij.PERSOON,
            indicatieGeheimhouding = null,
            voorkeurstaal = null,
            indicatieActief = true,
            bezoekadres = null,
            correspondentieAdres = null,
            partijIdentificatie = null,
        )
    private val defaultCreatePartijRequest =
        CreatePartijRequest(
            nummer = "",
            interneNotitie = "",
            digitaleAdressen = null,
            voorkeursDigitaalAdres = null,
            rekeningnummers = null,
            voorkeursRekeningnummer = null,
            partijIdentificatoren = emptyList(),
            soortPartij = Partij.SoortPartij.PERSOON,
            indicatieGeheimhouding = null,
            voorkeurstaal = "nl",
            indicatieActief = true,
            bezoekadres = null,
            correspondentieAdres = null,
            partijIdentificatie = null,
        )

    @BeforeEach
    fun setUp() {
        MockKAnnotations.init(this)
        service = DefaultOpenKlantService(client, partijFactory)
    }

    @Test
    fun `storeContactInformation should do nothing when supplied email is preferred address`() =
        runBlocking {
            // ARRANGE:
            val contactInformation =
                ContactInformation(
                    emailAddress = "email@adres.nl",
                    caseNumber = "ZAAK-1234",
                    lastName = "Oe",
                    inFix = "D",
                    firstName = "John",
                    bsn = "123456789",
                )
            coEvery { client.getPartijByBsn(contactInformation.bsn, testProperties) } returns defaultPartij
            coEvery { client.getDigitaalAdresByUuid(any(), testProperties) } returns
                defaultDigitaalAdres.copy(
                    adres = "email@adres.nl",
                    isStandaardAdres = true,
                    soortDigitaalAdres = SoortDigitaalAdres.EMAIL,
                )

            // ACT:
            service.storeContactInformation(
                testProperties,
                contactInformation,
            )

            // ASSERT:
            coVerify { client.getPartijByBsn(contactInformation.bsn, testProperties) }
            coVerify { client.getDigitaalAdresByUuid(defaultPartij.voorkeursDigitaalAdres!!.uuid, testProperties) }
            coVerify(exactly = 0) { client.createDigitaalAdres(any(), testProperties) }
            coVerify(exactly = 0) { client.patchPartij(any(), any(), any()) }
            coVerify(exactly = 0) { client.createPartij(any(), any()) }
        }

    @Test
    fun `storeContactInformation should update existing partij if email is not preferred address`() =
        runBlocking {
            // ARRANGE:
            val contactInformation =
                ContactInformation(
                    emailAddress = "email@adres.nl",
                    caseNumber = "ZAAK-1234",
                    lastName = "Oe",
                    inFix = "D",
                    firstName = "John",
                    bsn = "123456789",
                )
            coEvery { client.getPartijByBsn(contactInformation.bsn, testProperties) } returns defaultPartij
            coEvery { client.getDigitaalAdresByUuid(any(), testProperties) } returns
                defaultDigitaalAdres.copy(
                    adres = "email2@adres.nl",
                    isStandaardAdres = true,
                    soortDigitaalAdres = SoortDigitaalAdres.EMAIL,
                )
            coEvery { client.getDigitaleAdressenByPartijByUuid(defaultPartij.uuid, testProperties) } returns listOf()
            val newDigitaalAdres = defaultDigitaalAdres.copy(adres = contactInformation.emailAddress)
            coEvery { client.createDigitaalAdres(any(), testProperties) } returns newDigitaalAdres
            coEvery { client.patchPartij(any(), any(), any()) } returns defaultPartij

            // ACT:
            service.storeContactInformation(
                testProperties,
                contactInformation,
            )
            // ASSERT:
            coVerify { client.getPartijByBsn(contactInformation.bsn, testProperties) }
            coVerify { client.getDigitaalAdresByUuid(defaultPartij.voorkeursDigitaalAdres!!.uuid, testProperties) }
            coVerify { client.getDigitaleAdressenByPartijByUuid(defaultPartij.uuid, testProperties) }
            coVerify {
                client.createDigitaalAdres(
                    match<CreateDigitaalAdresRequest> {
                        it.adres == contactInformation.emailAddress &&
                            it.soortDigitaalAdres == SoortDigitaalAdres.EMAIL &&
                            it.referentie == contactInformation.caseNumber
                    },
                    testProperties,
                )
            }
            coVerify {
                client.patchPartij(
                    defaultPartij.uuid,
                    match<Map<String, Any>> { partij ->
                        val digitaleAdressen = partij["digitaleAdressen"] as List<UuidReference>
                        digitaleAdressen.any { it.uuid == newDigitaalAdres.uuid }
                    },
                    testProperties,
                )
            }
            coVerify(exactly = 0) { client.createPartij(any(), any()) }
        }

    @Test
    fun `storeContactInformation should create a new partij when no partij exists for supplied bsn`() =
        runBlocking {
            // ARRANGE:
            val contactInformation =
                ContactInformation(
                    emailAddress = "email@adres.nl",
                    caseNumber = "ZAAK-1234",
                    lastName = "Oe",
                    inFix = "D",
                    firstName = "John",
                    bsn = "123456789",
                )
            coEvery { client.getPartijByBsn(contactInformation.bsn, testProperties) } returns null
            val newPartij = defaultPartij.copy(uuid = "new-partij-uuid")
            coEvery { partijFactory.createFromBsn(contactInformation) } returns defaultCreatePartijRequest
            coEvery { client.createPartij(defaultCreatePartijRequest, testProperties) } returns newPartij
            val newDigitaalAdres = defaultDigitaalAdres.copy(adres = contactInformation.emailAddress)
            coEvery { client.createDigitaalAdres(any(), testProperties) } returns newDigitaalAdres
            coEvery { client.patchPartij(any(), any(), any()) } returns newPartij

            // ACT:
            service.storeContactInformation(
                testProperties,
                contactInformation,
            )
            // ASSERT:
            coVerify { client.getPartijByBsn(contactInformation.bsn, testProperties) }
            coVerify { partijFactory.createFromBsn(contactInformation) }
            coVerify { client.createPartij(defaultCreatePartijRequest, testProperties) }
            coVerify {
                client.createDigitaalAdres(
                    match<CreateDigitaalAdresRequest> {
                        it.adres == contactInformation.emailAddress &&
                            it.soortDigitaalAdres == SoortDigitaalAdres.EMAIL &&
                            it.referentie == contactInformation.caseNumber
                    },
                    testProperties,
                )
            }
            coVerify {
                client.patchPartij(
                    newPartij.uuid,
                    match<Map<String, Any>> { partij ->
                        val digitaleAdressen = partij["digitaleAdressen"] as List<UuidReference>
                        digitaleAdressen.any { it.uuid == newDigitaalAdres.uuid }
                    },
                    testProperties,
                )
            }
            coVerify(exactly = 0) { client.getDigitaalAdresByUuid(any(), testProperties) }
        }
}