package com.ritense.valtimoplugins.openklant.resolver

import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimoplugins.openklant.dto.Klantcontact
import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.plugin.OpenKlantPlugin
import com.ritense.valtimoplugins.openklant.service.OpenKlantService
import com.ritense.valtimoplugins.openklant.util.ReflectionUtil
import com.ritense.zakenapi.domain.ZaakResponse
import com.ritense.zakenapi.service.ZaakDocumentService
import io.mockk.clearAllMocks
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.junit5.MockKExtension
import io.mockk.mockk
import io.mockk.slot
import io.mockk.verify
import org.camunda.bpm.engine.delegate.VariableScope
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import java.net.URI
import java.util.UUID

@ExtendWith(MockKExtension::class)
class OpenKlantValueResolverFactoryTest {
    private lateinit var factory: OpenKlantValueResolverFactory
    private lateinit var processDocumentService: ProcessDocumentService
    private lateinit var zaakDocumentService: ZaakDocumentService
    private lateinit var openKlantService: OpenKlantService
    private lateinit var reflectionUtil: ReflectionUtil
    private lateinit var variableScope: VariableScope
    private lateinit var pluginService: PluginService

    @BeforeEach
    fun setup() {
        processDocumentService = mockk()
        zaakDocumentService = mockk()
        openKlantService = mockk()
        reflectionUtil = mockk()
        variableScope = mockk()
        pluginService = mockk()

        val plugin = mockk<OpenKlantPlugin>()
        every { plugin.klantinteractiesUrl } returns URI.create("https://test.klantinteracties.org")
        every { plugin.token } returns "openklant-token"
        val configuration = pluginConfiguration("Open Klant")
        every { pluginService.findPluginConfigurations(OpenKlantPlugin::class.java, any()) } returns
            listOf(configuration)
        every { pluginService.createInstance(configuration) } returns plugin

        factory =
            OpenKlantValueResolverFactory(
                processDocumentService = processDocumentService,
                zaakDocumentService = zaakDocumentService,
                openKlantService = openKlantService,
                reflectionUtil = reflectionUtil,
                pluginService = pluginService,
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
        val exception =
            assertThrows<IllegalArgumentException> {
                resolver.apply("unknownValue")
            }
        assertEquals("Unknown Open Klant column with name: unknownValue", exception.message)
    }

    @Test
    fun `createResolver with processInstanceId should return function that handles klantcontacten`() {
        // Arrange
        val processInstanceId = UUID.randomUUID().toString()
        val documentId = UUID.randomUUID()
        val zaakUuid = UUID.randomUUID()

        val mockDocument = mockk<com.ritense.document.domain.Document>()
        every { mockDocument.id() } returns JsonSchemaDocumentId.newId(documentId)
        every {
            processDocumentService.getDocument(
                CamundaProcessInstanceId(processInstanceId),
                variableScope,
            )
        } returns mockDocument

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
        every {
            processDocumentService.getDocument(
                CamundaProcessInstanceId(processInstanceId),
                variableScope,
            )
        } returns mockDocument

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
        every {
            processDocumentService.getDocument(
                CamundaProcessInstanceId(processInstanceId),
                variableScope,
            )
        } returns mockDocument

        val mockZaak = mockk<ZaakResponse>()
        every { mockZaak.uuid } returns UUID.randomUUID()
        every { zaakDocumentService.getZaakByDocumentIdOrThrow(documentId) } returns mockZaak

        // Act & Assert
        val resolver = factory.createResolver(processInstanceId, variableScope)
        val exception =
            assertThrows<IllegalArgumentException> {
                resolver.apply("unknownValue")
            }
        assertEquals("Unknown Open Klant column with name: unknownValue", exception.message)
    }

    @Test
    fun `klantcontacten should resolve to an empty list when no Open Klant configuration exists`() {
        // Arrange
        val documentId = stubZaakForDocument()
        every { pluginService.findPluginConfigurations(OpenKlantPlugin::class.java, any()) } returns emptyList()

        // Act & Assert
        assertEquals(emptyList<Any>(), factory.createResolver(documentId).apply("klantcontacten"))

        val exception = assertThrows<IllegalStateException> { factory.openKlantProperties() }
        assertEquals(OpenKlantValueResolverFactory.MISSING_CONFIGURATION_MESSAGE, exception.message)
    }

    @Test
    fun `klantcontactenOrNull should resolve to null when no Open Klant configuration exists`() {
        // Arrange
        val documentId = stubZaakForDocument()
        every { pluginService.findPluginConfigurations(OpenKlantPlugin::class.java, any()) } returns emptyList()

        // Act & Assert
        assertNull(factory.createResolver(documentId).apply("klantcontactenOrNull"))

        val exception = assertThrows<IllegalStateException> { factory.openKlantProperties() }
        assertEquals(OpenKlantValueResolverFactory.MISSING_CONFIGURATION_MESSAGE, exception.message)
    }

    @Test
    fun `klantcontacten should fall back to the environment properties when no plugin configuration exists`() {
        // Arrange
        every { pluginService.findPluginConfigurations(OpenKlantPlugin::class.java, any()) } returns emptyList()
        val factory = factoryWith(environmentProperties = ENVIRONMENT_PROPERTIES)

        // Act
        val options = captureOptionsUsedBy(factory)

        // Assert
        assertEquals(ENVIRONMENT_PROPERTIES.klantinteractiesUrl, options.klantinteractiesUrl)
        assertEquals(ENVIRONMENT_PROPERTIES.token, options.token)
    }

    @Test
    fun `klantcontacten should let the plugin configuration override the environment properties`() {
        // Arrange
        val factory = factoryWith(environmentProperties = ENVIRONMENT_PROPERTIES)

        // Act
        val options = captureOptionsUsedBy(factory)

        // Assert
        assertEquals(URI.create("https://test.klantinteracties.org"), options.klantinteractiesUrl)
        assertEquals("openklant-token", options.token)
    }

    @Test
    fun `klantcontacten should resolve to an empty list when multiple Open Klant configurations exist`() {
        // Arrange
        every { pluginService.findPluginConfigurations(OpenKlantPlugin::class.java, any()) } returns
            listOf(pluginConfiguration("Open Klant A"), pluginConfiguration("Open Klant B"))
        val factory = factoryWith(environmentProperties = ENVIRONMENT_PROPERTIES)
        val documentId = stubZaakForDocument()

        // Act & Assert
        // The environment properties are configured, but an ambiguous plugin configuration still
        // takes precedence over them rather than falling through to the fallback.
        assertEquals(emptyList<Any>(), factory.createResolver(documentId).apply("klantcontacten"))

        val exception = assertThrows<IllegalStateException> { factory.openKlantProperties() }
        assertEquals(
            OpenKlantValueResolverFactory.multipleConfigurationsMessage(listOf("Open Klant A", "Open Klant B")),
            exception.message,
        )
    }

    private fun pluginConfiguration(title: String): PluginConfiguration {
        val configuration = mockk<PluginConfiguration>()
        every { configuration.title } returns title
        return configuration
    }

    private fun factoryWith(environmentProperties: OpenKlantProperties?) =
        OpenKlantValueResolverFactory(
            processDocumentService = processDocumentService,
            zaakDocumentService = zaakDocumentService,
            openKlantService = openKlantService,
            reflectionUtil = reflectionUtil,
            pluginService = pluginService,
            openKlantPropertiesFromEnvironmentVariables = environmentProperties,
        )

    private fun stubZaakForDocument(): String {
        val documentId = UUID.randomUUID().toString()
        val mockZaak = mockk<ZaakResponse>()
        every { mockZaak.uuid } returns UUID.randomUUID()
        every { zaakDocumentService.getZaakByDocumentIdOrThrow(UUID.fromString(documentId)) } returns mockZaak
        return documentId
    }

    private fun captureOptionsUsedBy(factory: OpenKlantValueResolverFactory): KlantcontactOptions {
        val documentId = stubZaakForDocument()
        val options = slot<KlantcontactOptions>()
        coEvery { openKlantService.getAllKlantcontacten(capture(options)) } returns emptyList()
        every { reflectionUtil.deepReflectedMapOf(any()) } returns emptyMap<String, Any>()

        factory.createResolver(documentId).apply("klantcontacten")

        return options.captured
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

    companion object {
        private val ENVIRONMENT_PROPERTIES =
            OpenKlantProperties(
                klantinteractiesUrl = URI.create("https://environment.klantinteracties.org"),
                token = "environment-token",
            )
    }
}
