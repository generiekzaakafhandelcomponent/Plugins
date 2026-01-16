package resolver

import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import dto.Klantcontact
import model.OpenKlantProperties
import service.OpenKlantService
import util.ReflectionUtil
import com.ritense.zakenapi.domain.ZaakResponse
import com.ritense.zakenapi.service.ZaakDocumentService
import io.mockk.*
import io.mockk.junit5.MockKExtension
import org.camunda.bpm.engine.delegate.VariableScope
import org.junit.jupiter.api.*
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.extension.ExtendWith
import java.net.URI
import java.util.*

@ExtendWith(MockKExtension::class)
class OpenKlantValueResolverFactoryTest {

    private lateinit var factory: OpenKlantValueResolverFactory
    private lateinit var processDocumentService: ProcessDocumentService
    private lateinit var zaakDocumentService: ZaakDocumentService
    private lateinit var openKlantService: OpenKlantService
    private lateinit var reflectionUtil: ReflectionUtil
    private lateinit var variableScope: VariableScope
    private lateinit var properties: OpenKlantProperties

    @BeforeEach
    fun setup() {
        processDocumentService = mockk()
        zaakDocumentService = mockk()
        openKlantService = mockk()
        reflectionUtil = mockk()
        variableScope = mockk()
        properties = OpenKlantProperties(URI.create("https://test.klantinteracties.org"), "openklant-token")

        factory = OpenKlantValueResolverFactory(
            processDocumentService = processDocumentService,
            zaakDocumentService = zaakDocumentService,
            openKlantService = openKlantService,
            reflectionUtil = reflectionUtil,
            properties = properties,
        )
    }

    @AfterEach
    fun cleanup() {
        clearAllMocks()
    }

    @Test
    fun `supportedPrefix should return klant`() {
        assertEquals("klant", factory.supportedPrefix())
    }

    @Test
    fun `createResolver with documentId should return function that handles klantcontacten`() {
        // Arrange
        val documentId = UUID.randomUUID().toString()
        val zaakUuid = UUID.randomUUID()
        val mockZaak = mockk<ZaakResponse>()
        every { mockZaak.uuid } returns zaakUuid
        every { zaakDocumentService.getZaakByDocumentIdOrThrow(UUID.fromString(documentId)) } returns mockZaak

        val klantContact = mockk<Klantcontact>()
        every { klantContact.uuid } returns "test-uuid"
        every { klantContact.url } returns "test-url"
        every { klantContact.kanaal } returns "test-kanaal"
        every { klantContact.onderwerp } returns "test-onderwerp"
        every { klantContact.taal } returns "nl"
        every { klantContact.vertrouwelijk } returns false
        every { klantContact.gingOverOnderwerpobjecten } returns emptyList()
        every { klantContact.hadBetrokkenActoren } returns emptyList()
        every { klantContact.omvatteBijlagen } returns emptyList()
        every { klantContact.hadBetrokkenen } returns emptyList()
        every { klantContact.leiddeTotInterneTaken } returns emptyList()
        every { klantContact.nummer } returns null
        every { klantContact.inhoud } returns null
        every { klantContact.indicatieContactGelukt } returns null
        every { klantContact.plaatsgevondenOp } returns null
        every { klantContact.expand } returns null

        val expectedKlantcontacten = listOf(klantContact)
        val reflectedResult = mapOf("reflected" to "data")
        coEvery { openKlantService.getAllKlantcontacten(any()) } returns expectedKlantcontacten
        every { reflectionUtil.deepReflectedMapOf(any()) } returns reflectedResult

        // Act
        val resolver = factory.createResolver(documentId)
        val result = resolver.apply("klantcontacten")

        // Assert
        assertEquals(reflectedResult, result)
        verify { zaakDocumentService.getZaakByDocumentIdOrThrow(UUID.fromString(documentId)) }
        coVerify { openKlantService.getAllKlantcontacten(any()) }
        verify { reflectionUtil.deepReflectedMapOf(any()) }
    }

    @Test
    fun `createResolver with documentId should return function that handles klantcontactenOrNull`() {
        // Arrange
        val documentId = UUID.randomUUID().toString()
        val zaakUuid = UUID.randomUUID()
        val mockZaak = mockk<ZaakResponse>()
        every { mockZaak.uuid } returns zaakUuid
        every { zaakDocumentService.getZaakByDocumentIdOrThrow(UUID.fromString(documentId)) } returns mockZaak

        val klantContact = mockk<Klantcontact>()
        every { klantContact.uuid } returns "test-uuid"
        every { klantContact.url } returns "test-url"
        every { klantContact.kanaal } returns "test-kanaal"
        every { klantContact.onderwerp } returns "test-onderwerp"
        every { klantContact.taal } returns "nl"
        every { klantContact.vertrouwelijk } returns false
        every { klantContact.gingOverOnderwerpobjecten } returns emptyList()
        every { klantContact.hadBetrokkenActoren } returns emptyList()
        every { klantContact.omvatteBijlagen } returns emptyList()
        every { klantContact.hadBetrokkenen } returns emptyList()
        every { klantContact.leiddeTotInterneTaken } returns emptyList()
        every { klantContact.nummer } returns null
        every { klantContact.inhoud } returns null
        every { klantContact.indicatieContactGelukt } returns null
        every { klantContact.plaatsgevondenOp } returns null
        every { klantContact.expand } returns null

        val expectedKlantcontacten = listOf(klantContact)
        val reflectedResult = mapOf("reflected" to "data")
        coEvery { openKlantService.getAllKlantcontacten(any()) } returns expectedKlantcontacten
        every { reflectionUtil.deepReflectedMapOf(any()) } returns reflectedResult

        // Act
        val resolver = factory.createResolver(documentId)
        val result = resolver.apply("klantcontactenOrNull")

        // Assert
        assertEquals(reflectedResult, result)
    }

    @Test
    fun `createResolver with documentId should return function that throws exception for unknown value`() {
        // Arrange
        val documentId = UUID.randomUUID().toString()
        val zaakUuid = UUID.randomUUID()
        val mockZaak = mockk<ZaakResponse>()
        every { mockZaak.uuid } returns zaakUuid
        every { zaakDocumentService.getZaakByDocumentIdOrThrow(UUID.fromString(documentId)) } returns mockZaak

        // Act & Assert
        val resolver = factory.createResolver(documentId)
        val exception = assertThrows<IllegalArgumentException> {
            resolver.apply("unknownValue")
        }
        assertEquals("Unknown openklant column with name: unknownValue", exception.message)
    }

    @Test
    fun `createResolver with processInstanceId should return function that handles klantcontacten`() {
        // Arrange
        val processInstanceId = UUID.randomUUID().toString()
        val documentId = UUID.randomUUID()
        val zaakUuid = UUID.randomUUID()

        val mockDocument = mockk<com.ritense.document.domain.Document>()
        every { mockDocument.id() } returns JsonSchemaDocumentId.newId(documentId)
        every { processDocumentService.getDocument(CamundaProcessInstanceId(processInstanceId), variableScope) } returns mockDocument

        val mockZaak = mockk<ZaakResponse>()
        every { mockZaak.uuid } returns zaakUuid
        every { zaakDocumentService.getZaakByDocumentIdOrThrow(documentId) } returns mockZaak

        val klantContact = mockk<Klantcontact>()
        every { klantContact.uuid } returns "test-uuid"
        every { klantContact.url } returns "test-url"
        every { klantContact.kanaal } returns "test-kanaal"
        every { klantContact.onderwerp } returns "test-onderwerp"
        every { klantContact.taal } returns "nl"
        every { klantContact.vertrouwelijk } returns false
        every { klantContact.gingOverOnderwerpobjecten } returns emptyList()
        every { klantContact.hadBetrokkenActoren } returns emptyList()
        every { klantContact.omvatteBijlagen } returns emptyList()
        every { klantContact.hadBetrokkenen } returns emptyList()
        every { klantContact.leiddeTotInterneTaken } returns emptyList()
        every { klantContact.nummer } returns null
        every { klantContact.inhoud } returns null
        every { klantContact.indicatieContactGelukt } returns null
        every { klantContact.plaatsgevondenOp } returns null
        every { klantContact.expand } returns null

        val expectedKlantcontacten = listOf(klantContact)
        val reflectedResult = mapOf("reflected" to "data")
        coEvery { openKlantService.getAllKlantcontacten(any()) } returns expectedKlantcontacten
        every { reflectionUtil.deepReflectedMapOf(any()) } returns reflectedResult

        // Act
        val resolver = factory.createResolver(processInstanceId, variableScope)
        val result = resolver.apply("klantcontacten")

        // Assert
        assertEquals(reflectedResult, result)
        verify { processDocumentService.getDocument(CamundaProcessInstanceId(processInstanceId), variableScope) }
        verify { zaakDocumentService.getZaakByDocumentIdOrThrow(documentId) }
        coVerify { openKlantService.getAllKlantcontacten(any()) }
    }

    @Test
    fun `createResolver with processInstanceId should return function that handles klantcontactenOrNull`() {
        // Arrange
        val processInstanceId = UUID.randomUUID().toString()
        val documentId = UUID.randomUUID()
        val zaakUuid = UUID.randomUUID()

        val mockDocument = mockk<com.ritense.document.domain.Document>()
        every { mockDocument.id() } returns JsonSchemaDocumentId.newId(documentId)
        every { processDocumentService.getDocument(CamundaProcessInstanceId(processInstanceId), variableScope) } returns mockDocument

        val mockZaak = mockk<ZaakResponse>()
        every { mockZaak.uuid } returns zaakUuid
        every { zaakDocumentService.getZaakByDocumentIdOrThrow(documentId) } returns mockZaak

        val klantContact = mockk<Klantcontact>()
        every { klantContact.uuid } returns "test-uuid"
        every { klantContact.url } returns "test-url"
        every { klantContact.kanaal } returns "test-kanaal"
        every { klantContact.onderwerp } returns "test-onderwerp"
        every { klantContact.taal } returns "nl"
        every { klantContact.vertrouwelijk } returns false
        every { klantContact.gingOverOnderwerpobjecten } returns emptyList()
        every { klantContact.hadBetrokkenActoren } returns emptyList()
        every { klantContact.omvatteBijlagen } returns emptyList()
        every { klantContact.hadBetrokkenen } returns emptyList()
        every { klantContact.leiddeTotInterneTaken } returns emptyList()
        every { klantContact.nummer } returns null
        every { klantContact.inhoud } returns null
        every { klantContact.indicatieContactGelukt } returns null
        every { klantContact.plaatsgevondenOp } returns null
        every { klantContact.expand } returns null

        val expectedKlantcontacten = listOf(klantContact)
        val reflectedResult = mapOf("reflected" to "data")
        coEvery { openKlantService.getAllKlantcontacten(any()) } returns expectedKlantcontacten
        every { reflectionUtil.deepReflectedMapOf(any()) } returns reflectedResult

        // Act
        val resolver = factory.createResolver(processInstanceId, variableScope)
        val result = resolver.apply("klantcontactenOrNull")

        // Assert
        assertEquals(reflectedResult, result)
    }

    @Test
    fun `createResolver with processInstanceId should return function that throws exception for unknown value`() {
        // Arrange
        val processInstanceId = UUID.randomUUID().toString()
        val documentId = UUID.randomUUID()

        val mockDocument = mockk<com.ritense.document.domain.Document>()
        every { mockDocument.id() } returns JsonSchemaDocumentId.newId(documentId)
        every { processDocumentService.getDocument(CamundaProcessInstanceId(processInstanceId), variableScope) } returns mockDocument

        val mockZaak = mockk<ZaakResponse>()
        every { mockZaak.uuid } returns UUID.randomUUID()
        every { zaakDocumentService.getZaakByDocumentIdOrThrow(documentId) } returns mockZaak

        // Act & Assert
        val resolver = factory.createResolver(processInstanceId, variableScope)
        val exception = assertThrows<IllegalArgumentException> {
            resolver.apply("unknownValue")
        }
        assertEquals("Unknown openklant column with name: unknownValue", exception.message)
    }

    @Test
    fun `handleValues should throw NotImplementedError`() {
        // Arrange
        val processInstanceId = UUID.randomUUID().toString()
        val values = mapOf<String, Any?>("key" to "value")

        // Act & Assert
        assertThrows<NotImplementedError> {
            factory.handleValues(processInstanceId, variableScope, values)
        }
    }
}