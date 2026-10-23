/*
 * Copyright 2026 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimoplugins.httpclientauthentication.plugin

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.documentenapi.DocumentenApiPlugin
import com.ritense.notificatiesapi.NotificatiesApiPlugin
import com.ritense.notificatiesapi.client.NotificatiesApiClient
import com.ritense.notificatiesapi.domain.Abonnement
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.autodeployment.PluginAutoDeploymentDto
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.exception.PluginEventInvocationException
import com.ritense.plugin.repository.PluginConfigurationRepository
import com.ritense.plugin.repository.PluginDefinitionRepository
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.httpclientauthentication.BaseIntegrationTest
import com.ritense.valtimoplugins.httpclientauthentication.tls.MtlsTestServer
import com.ritense.valtimoplugins.httpclientauthentication.tls.TlsFixtures
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.ResourceAccessException
import java.net.URI
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

internal class HttpClientAuthenticationPluginIT : BaseIntegrationTest() {
    @Autowired
    lateinit var pluginService: PluginService

    @Autowired
    lateinit var pluginDefinitionRepository: PluginDefinitionRepository

    @Autowired
    lateinit var pluginConfigurationRepository: PluginConfigurationRepository

    @Autowired
    lateinit var objectMapper: ObjectMapper

    @Autowired
    lateinit var notificatiesApiClient: NotificatiesApiClient

    @Test
    @Transactional
    fun `should be selectable as authentication by every ZGW API plugin`() {
        val definition = pluginDefinitionRepository.findById(PLUGIN_KEY).orElseThrow()

        assertEquals(
            setOf(
                "http-client-authentication",
                "zaken-api-authentication",
                "documenten-api-authentication",
                "catalogi-api-authentication",
                "besluiten-api-authentication",
                "notificaties-api-authentication",
                "objecten-api-authentication",
                "objecttypen-api-authentication",
            ),
            definition.categories.map { it.key }.toSet(),
        )
    }

    @Test
    @Transactional
    fun `should call the Objecten API through a gateway that requires mutual TLS`() {
        MtlsTestServer(responseBody = objectResponse()).use { server ->
            val authentication =
                createConfiguration(
                    "Den Bosch gateway",
                    mapOf(
                        "authenticationType" to "TOKEN",
                        "authSecret" to "1e2804e1113e083fb1f8258d161a2e222c317987",
                        "clientCertificate" to TlsFixtures.CLIENT_CERTIFICATE,
                        "clientPrivateKey" to TlsFixtures.CLIENT_PRIVATE_KEY,
                        "serverCertificate" to TlsFixtures.CA_CERTIFICATE,
                    ),
                    PLUGIN_KEY,
                )
            val objectenApi =
                createConfiguration(
                    "Objecten API via gateway",
                    mapOf(
                        "url" to "${server.baseUrl}/api/v2/",
                        "authenticationPluginConfiguration" to authentication.id.id.toString(),
                    ),
                    "objectenapi",
                )
            val plugin = pluginService.createInstance(objectenApi.id) as ObjectenApiPlugin

            val result =
                runWithoutAuthorization { plugin.getObject(URI("${server.baseUrl}/api/v2/objects/$OBJECT_ID")) }

            assertEquals(UUID.fromString(OBJECT_ID), result.uuid)
            assertEquals(TlsFixtures.CLIENT_SUBJECT, server.receivedClientCertificateSubject)
            assertEquals("Token 1e2804e1113e083fb1f8258d161a2e222c317987", server.receivedAuthorization)
        }
    }

    @Test
    @Transactional
    fun `should manage kanalen and abonnementen through a gateway that requires mutual TLS`() {
        MtlsTestServer(responses = notificatiesApiResponses()).use { server ->
            val plugin = notificatiesApiPlugin(server, mtlsProperties() + OPEN_NOTIFICATIES_JWT)
            val authentication = plugin.authenticationPluginConfiguration

            plugin.ensureKanalenExist(setOf("zaken"))
            val abonnement =
                notificatiesApiClient.createAbonnement(
                    authentication,
                    plugin.url,
                    Abonnement(
                        callbackUrl = CALLBACK_URL,
                        auth = "callback-secret",
                        kanalen = listOf(Abonnement.Kanaal(naam = "zaken")),
                    ),
                )
            notificatiesApiClient.deleteAbonnement(authentication, plugin.url, abonnement.url!!.substringAfterLast("/"))

            assertEquals(
                listOf(
                    // Creating the Notificaties API configuration subscribes to Open Notificaties
                    "GET /api/v1/kanaal",
                    "POST /api/v1/kanaal",
                    "POST /api/v1/abonnement",
                    "GET /api/v1/kanaal",
                    "POST /api/v1/kanaal",
                    "POST /api/v1/abonnement",
                    "DELETE /api/v1/abonnement/$ABONNEMENT_ID",
                ),
                server.receivedRequests.map { it.request },
            )
            server.receivedRequests.forEach { received ->
                assertEquals(TlsFixtures.CLIENT_SUBJECT, received.clientCertificateSubject, received.request)
                assertTrue(received.authorization!!.startsWith("Bearer "), received.request)
            }
        }
    }

    @Test
    @Transactional
    fun `should not reach Open Notificaties behind a gateway that requires mutual TLS without a client certificate`() {
        MtlsTestServer(responses = notificatiesApiResponses()).use { server ->
            val properties = OPEN_NOTIFICATIES_JWT + mapOf("serverCertificate" to TlsFixtures.CA_CERTIFICATE)
            // Creating the Notificaties API configuration already calls Open Notificaties to subscribe
            val exception = assertThrows<PluginEventInvocationException> { notificatiesApiPlugin(server, properties) }

            assertTrue(generateSequence<Throwable>(exception) { it.cause }.any { it is ResourceAccessException })
            assertTrue(server.receivedRequests.isEmpty())
        }
    }

    @Test
    @Transactional
    fun `should fetch and download a document from the Documenten API through a gateway that requires mutual TLS`() {
        MtlsTestServer(responses = documentenApiResponses()).use { server ->
            val plugin = documentenApiPlugin(server, mtlsProperties() + OPEN_ZAAK_JWT)

            val document =
                runWithoutAuthorization { plugin.getInformatieObject(URI(documentUrl(server)), null) }
            val content =
                runWithoutAuthorization { plugin.downloadInformatieObject(null, DOCUMENT_ID) }.use { it.readBytes() }

            assertEquals("Bijlage bij het verzoek", document.titel)
            assertEquals(DOCUMENT_CONTENT, content.decodeToString())
            assertEquals(
                listOf(
                    "GET /documenten/api/v1/enkelvoudiginformatieobjecten/$DOCUMENT_ID",
                    "GET /documenten/api/v1/enkelvoudiginformatieobjecten/$DOCUMENT_ID/download",
                ),
                server.receivedRequests.map { it.request },
            )
            server.receivedRequests.forEach { received ->
                assertEquals(TlsFixtures.CLIENT_SUBJECT, received.clientCertificateSubject, received.request)
                assertTrue(received.authorization!!.startsWith("Bearer "), received.request)
            }
        }
    }

    @Test
    @Transactional
    fun `should not reach the Documenten API behind a gateway that requires mutual TLS without a client certificate`() {
        MtlsTestServer(responses = documentenApiResponses()).use { server ->
            val properties = OPEN_ZAAK_JWT + mapOf("serverCertificate" to TlsFixtures.CA_CERTIFICATE)
            val plugin = documentenApiPlugin(server, properties)

            assertThrows<ResourceAccessException> {
                runWithoutAuthorization { plugin.getInformatieObject(URI(documentUrl(server)), null) }
            }
            assertThrows<ResourceAccessException> {
                runWithoutAuthorization { plugin.downloadInformatieObject(null, DOCUMENT_ID) }
            }
            assertTrue(server.receivedRequests.isEmpty())
        }
    }

    @Test
    @Transactional
    fun `should fetch objecttypes from the Objecttypen API through a gateway that requires mutual TLS`() {
        MtlsTestServer(responses = objecttypenApiResponses()).use { server ->
            val plugin = objecttypenApiPlugin(server, mtlsProperties())

            val objecttype = plugin.getObjecttype(plugin.getObjectTypeUrlById(OBJECTTYPE_ID))
            val objecttypes = plugin.getObjecttypes(plugin.getObjectTypesUrl())

            assertEquals("Verzoek", objecttype.name)
            assertEquals(listOf("Verzoek"), objecttypes.map { it.name })
            assertEquals(
                listOf(
                    "GET /api/v2/objecttypes/$OBJECTTYPE_ID",
                    "GET /api/v2/objecttypes",
                ),
                server.receivedRequests.map { it.request },
            )
            server.receivedRequests.forEach { received ->
                assertEquals(TlsFixtures.CLIENT_SUBJECT, received.clientCertificateSubject, received.request)
                assertEquals("Token 1e2804e1113e083fb1f8258d161a2e222c317987", received.authorization, received.request)
            }
        }
    }

    @Test
    @Transactional
    fun `should not reach the Objecttypen API behind an mTLS gateway without a client certificate`() {
        MtlsTestServer(responses = objecttypenApiResponses()).use { server ->
            val properties = mtlsProperties() - setOf("clientCertificate", "clientPrivateKey")
            val plugin = objecttypenApiPlugin(server, properties)

            assertThrows<ResourceAccessException> { plugin.getObjecttype(plugin.getObjectTypeUrlById(OBJECTTYPE_ID)) }
            assertThrows<ResourceAccessException> { plugin.getObjecttypes(plugin.getObjectTypesUrl()) }
            assertTrue(server.receivedRequests.isEmpty())
        }
    }

    @Test
    fun `should refuse to save a configuration whose private key does not belong to the client certificate`() {
        val title = "Mismatched key ${UUID.randomUUID()}"

        val exception =
            assertThrows<PluginEventInvocationException> {
                createConfiguration(
                    title,
                    mapOf(
                        "authenticationType" to "NONE",
                        "clientCertificate" to TlsFixtures.CLIENT_CERTIFICATE,
                        "clientPrivateKey" to TlsFixtures.OTHER_PRIVATE_KEY,
                    ),
                    PLUGIN_KEY,
                )
            }

        val causes = generateSequence(exception as Throwable) { it.cause }.mapNotNull { it.message }.toList()
        assertTrue(
            causes.any {
                it.contains("Property 'clientPrivateKey' does not belong to the certificate in 'clientCertificate'")
            },
        )
        assertTrue(pluginConfigurationRepository.findByPluginDefinitionKey(PLUGIN_KEY).none { it.title == title })
    }

    @Test
    fun `should refuse an update that renews the client certificate without its private key`() {
        val configuration = createConfiguration("Renewal ${UUID.randomUUID()}", mtlsProperties(), PLUGIN_KEY)
        val renewedProperties =
            mtlsProperties() + mapOf("clientCertificate" to TlsFixtures.SERVER_CERTIFICATE, "clientPrivateKey" to "")

        val exception =
            assertThrows<PluginEventInvocationException> {
                pluginService.updatePluginConfiguration(
                    configuration.id,
                    configuration.title,
                    objectMapper.valueToTree(renewedProperties),
                )
            }

        assertCausedBy(
            exception,
            "Property 'clientPrivateKey' does not belong to the certificate in 'clientCertificate'",
        )
        val stored = pluginConfigurationRepository.findById(configuration.id).orElseThrow()
        assertEquals(TlsFixtures.CLIENT_CERTIFICATE, stored.properties!!["clientCertificate"].textValue())
    }

    @Test
    fun `should keep the stored private key when an update leaves it empty`() {
        val configuration = createConfiguration("Edit ${UUID.randomUUID()}", mtlsProperties(), PLUGIN_KEY)
        val editedProperties = mtlsProperties() + mapOf("authSecret" to "another-token-value", "clientPrivateKey" to "")

        pluginService.updatePluginConfiguration(
            configuration.id,
            configuration.title,
            objectMapper.valueToTree(editedProperties),
        )

        val plugin = pluginService.createInstance(configuration.id) as HttpClientAuthenticationPlugin
        assertEquals(TlsFixtures.CLIENT_PRIVATE_KEY, plugin.clientPrivateKey)
        plugin.validateConfiguration()
    }

    @Test
    fun `should refuse to autodeploy a configuration whose private key does not belong to the client certificate`() {
        val id = UUID.randomUUID()
        val properties = mtlsProperties() + mapOf("clientPrivateKey" to TlsFixtures.OTHER_PRIVATE_KEY)

        val exception =
            assertThrows<PluginEventInvocationException> {
                pluginService.deployPluginConfigurations(
                    PluginAutoDeploymentDto(
                        id,
                        "Autodeployed ${UUID.randomUUID()}",
                        objectMapper.valueToTree(properties),
                        PLUGIN_KEY,
                    ),
                )
            }

        assertCausedBy(
            exception,
            "Property 'clientPrivateKey' does not belong to the certificate in 'clientCertificate'",
        )
        assertFalse(pluginConfigurationRepository.existsById(PluginConfigurationId.existingId(id)))
    }

    private fun assertCausedBy(
        exception: Throwable,
        message: String,
    ) {
        val messages = generateSequence(exception) { it.cause }.mapNotNull { it.message }.toList()
        assertTrue(messages.any { it.contains(message) }, messages.joinToString())
    }

    private fun mtlsProperties() =
        mapOf(
            "authenticationType" to "TOKEN",
            "authSecret" to "1e2804e1113e083fb1f8258d161a2e222c317987",
            "clientCertificate" to TlsFixtures.CLIENT_CERTIFICATE,
            "clientPrivateKey" to TlsFixtures.CLIENT_PRIVATE_KEY,
            "serverCertificate" to TlsFixtures.CA_CERTIFICATE,
        )

    private fun createConfiguration(
        title: String,
        properties: Map<String, String>,
        pluginDefinitionKey: String,
    ): PluginConfiguration =
        pluginService.createPluginConfiguration(
            title,
            objectMapper.valueToTree<ObjectNode>(properties),
            pluginDefinitionKey,
        )

    private fun notificatiesApiPlugin(
        server: MtlsTestServer,
        authenticationProperties: Map<String, String>,
    ): NotificatiesApiPlugin {
        val authentication =
            createConfiguration("Open Notificaties gateway ${UUID.randomUUID()}", authenticationProperties, PLUGIN_KEY)
        val notificatiesApi =
            createConfiguration(
                "Notificaties API via gateway ${UUID.randomUUID()}",
                mapOf(
                    "url" to "${server.baseUrl}/api/v1/",
                    "callbackUrl" to CALLBACK_URL,
                    "authenticationPluginConfiguration" to authentication.id.id.toString(),
                ),
                "notificatiesapi",
            )
        return pluginService.createInstance(notificatiesApi.id) as NotificatiesApiPlugin
    }

    private fun notificatiesApiResponses() =
        mapOf(
            "GET /api/v1/kanaal" to "[]",
            "POST /api/v1/kanaal" to """{ "naam": "zaken", "filters": [] }""",
            "POST /api/v1/abonnement" to
                """
                {
                  "url": "https://example.com/api/v1/abonnement/$ABONNEMENT_ID",
                  "callbackUrl": "$CALLBACK_URL",
                  "auth": "callback-secret",
                  "kanalen": [{ "naam": "zaken", "filters": {} }]
                }
                """.trimIndent(),
        )

    private fun documentenApiPlugin(
        server: MtlsTestServer,
        authenticationProperties: Map<String, String>,
    ): DocumentenApiPlugin {
        val authentication =
            createConfiguration("Open Zaak gateway ${UUID.randomUUID()}", authenticationProperties, PLUGIN_KEY)
        val documentenApi =
            createConfiguration(
                "Documenten API via gateway ${UUID.randomUUID()}",
                mapOf(
                    "url" to "${server.baseUrl}/documenten/api/v1/",
                    "bronorganisatie" to "051845623",
                    "authenticationPluginConfiguration" to authentication.id.id.toString(),
                ),
                "documentenapi",
            )
        return pluginService.createInstance(documentenApi.id) as DocumentenApiPlugin
    }

    private fun documentUrl(server: MtlsTestServer) =
        "${server.baseUrl}/documenten/api/v1/enkelvoudiginformatieobjecten/$DOCUMENT_ID"

    private fun documentenApiResponses() =
        mapOf(
            "GET /documenten/api/v1/enkelvoudiginformatieobjecten/$DOCUMENT_ID" to
                """
                {
                  "url": "https://example.com/documenten/api/v1/enkelvoudiginformatieobjecten/$DOCUMENT_ID",
                  "bronorganisatie": "051845623",
                  "creatiedatum": "2026-10-22",
                  "titel": "Bijlage bij het verzoek",
                  "auteur": "Valtimo",
                  "taal": "nld",
                  "beginRegistratie": "2026-10-22T10:00:00Z"
                }
                """.trimIndent(),
            "GET /documenten/api/v1/enkelvoudiginformatieobjecten/$DOCUMENT_ID/download" to DOCUMENT_CONTENT,
        )

    private fun objecttypenApiPlugin(
        server: MtlsTestServer,
        authenticationProperties: Map<String, String>,
    ): ObjecttypenApiPlugin {
        val authentication =
            createConfiguration("Objecttypen gateway ${UUID.randomUUID()}", authenticationProperties, PLUGIN_KEY)
        val objecttypenApi =
            createConfiguration(
                "Objecttypen API via gateway ${UUID.randomUUID()}",
                mapOf(
                    "url" to "${server.baseUrl}/api/v2/",
                    "authenticationPluginConfiguration" to authentication.id.id.toString(),
                ),
                "objecttypenapi",
            )
        return pluginService.createInstance(objecttypenApi.id) as ObjecttypenApiPlugin
    }

    private fun objecttypenApiResponses(): Map<String, String> {
        val objecttype =
            """
            {
              "url": "https://example.com/api/v2/objecttypes/$OBJECTTYPE_ID",
              "uuid": "$OBJECTTYPE_ID",
              "name": "Verzoek",
              "namePlural": "Verzoeken",
              "versions": ["https://example.com/api/v2/objecttypes/$OBJECTTYPE_ID/versions/1"]
            }
            """.trimIndent()
        return mapOf(
            "GET /api/v2/objecttypes/$OBJECTTYPE_ID" to objecttype,
            "GET /api/v2/objecttypes" to "[$objecttype]",
        )
    }

    private fun objectResponse() =
        """
        {
          "url": "https://example.com/api/v2/objects/$OBJECT_ID",
          "uuid": "$OBJECT_ID",
          "type": "https://example.com/api/v2/objecttypes/55a89742-6ae0-49bb-a00e-6465b13cfc07",
          "record": { "typeVersion": 1, "data": {}, "startAt": "2026-10-20" }
        }
        """.trimIndent()

    companion object {
        private const val PLUGIN_KEY = "http-client-authentication-plugin"
        private const val OBJECT_ID = "1e9b6d4c-5b1a-4b3e-9f7a-2c8d0e6f4a11"
        private const val ABONNEMENT_ID = "8b3e1c70-6d2f-4a95-b0e4-7c9a1f3d5e28"
        private const val DOCUMENT_ID = "2f7c9e14-8a3b-4d61-b5e2-0c9d7a4f6e83"
        private const val OBJECTTYPE_ID = "a6f2e8b1-6c3d-4f7e-9b2a-1d5c8e0f3a74"
        private const val DOCUMENT_CONTENT = "Inhoud van de bijlage"
        private const val CALLBACK_URL = "https://valtimo.example.com/api/v1/notificatiesapi/callback"
        private val OPEN_NOTIFICATIES_JWT =
            mapOf(
                "authenticationType" to "ZGW_JWT",
                "clientId" to "valtimo",
                "authSecret" to "a7f0c2e9b14d4e6f8a3b5c7d9e1f2a4b",
            )
        private val OPEN_ZAAK_JWT =
            mapOf(
                "authenticationType" to "ZGW_JWT",
                "clientId" to "valtimo",
                "authSecret" to "c3e8a1f5d2b74e9a8f6c0b4d7e2a9f1c",
            )
    }
}
