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
import com.ritense.openzaak.plugin.token.ValtimoOpenZaakPluginTokenGeneratorService
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.valtimo.contract.client.ValtimoHttpRestClientConfigurationProperties
import com.ritense.valtimoplugins.httpclientauthentication.model.AuthenticationType
import com.ritense.valtimoplugins.httpclientauthentication.tls.MtlsTestServer
import com.ritense.valtimoplugins.httpclientauthentication.tls.TlsFixtures
import com.ritense.valtimoplugins.httpclientauthentication.tls.TlsRequestFactoryCache
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Answers
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.client.BufferingClientHttpRequestFactory
import org.springframework.http.client.ClientHttpRequestFactory
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.test.util.ReflectionTestUtils
import org.springframework.web.client.ResourceAccessException
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import org.springframework.web.reactive.function.client.ClientResponse
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import java.time.Duration
import java.util.Base64
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec
import javax.net.ssl.SSLHandshakeException
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertNull
import kotlin.test.assertSame
import kotlin.test.assertTrue

internal class HttpClientAuthenticationPluginTest {
    private val restClientProperties = ValtimoHttpRestClientConfigurationProperties()

    // Built the way Valtimo's shared RestClient.Builder is, and used per request the way the ZGW clients use it
    private val sharedRestClientBuilder =
        RestClient
            .builder()
            .requestFactory(BufferingClientHttpRequestFactory(HttpComponentsClientHttpRequestFactory()))

    @Test
    fun `should send bearer token`() {
        val plugin = plugin(AuthenticationType.BEARER) { authSecret = "secret-bearer-token" }

        assertEquals("Bearer secret-bearer-token", headersOf(plugin).getFirst(HttpHeaders.AUTHORIZATION))
    }

    @Test
    fun `should send custom header`() {
        val plugin =
            plugin(AuthenticationType.HEADER) {
                authHeaderName = "X-Api-Key"
                authSecret = "secret-api-key"
            }

        val headers = headersOf(plugin)

        assertEquals("secret-api-key", headers.getFirst("X-Api-Key"))
        assertNull(headers.getFirst(HttpHeaders.AUTHORIZATION))
    }

    @Test
    fun `should send no authentication header for NONE`() {
        val headers = headersOf(plugin(AuthenticationType.NONE))

        assertTrue(headers.isEmpty())
    }

    @Test
    fun `should send Authorization Token header for TOKEN`() {
        val plugin = plugin(AuthenticationType.TOKEN) { authSecret = "1e2804e1113e083fb1f8258d161a2e222c317987" }

        assertEquals(
            "Token 1e2804e1113e083fb1f8258d161a2e222c317987",
            headersOf(plugin).getFirst(HttpHeaders.AUTHORIZATION),
        )
    }

    @Test
    fun `should send ZGW JWT signed with the client secret for ZGW_JWT`() {
        val clientSecret = "a-client-secret-of-at-least-32-characters"
        val plugin =
            plugin(AuthenticationType.ZGW_JWT) {
                clientId = "valtimo_client"
                authSecret = clientSecret
            }

        val authorization = headersOf(plugin).getFirst(HttpHeaders.AUTHORIZATION)!!

        assertTrue(authorization.startsWith("Bearer "))
        val (header, payload, signature) = authorization.removePrefix("Bearer ").split(".")
        val mac = Mac.getInstance("HmacSHA256").apply { init(SecretKeySpec(clientSecret.toByteArray(), "HmacSHA256")) }
        val expectedSignature =
            Base64.getUrlEncoder().withoutPadding().encodeToString(
                mac.doFinal("$header.$payload".toByteArray()),
            )
        assertEquals(expectedSignature, signature)
        val claims = ObjectMapper().readTree(Base64.getUrlDecoder().decode(payload))
        assertEquals("valtimo_client", claims["client_id"].asText())
        assertEquals("valtimo_client", claims["iss"].asText())
        assertEquals("Valtimo", claims["user_id"].asText())
    }

    @Test
    fun `should require client id for ZGW_JWT`() {
        val plugin =
            plugin(AuthenticationType.ZGW_JWT) { authSecret = "a-client-secret-of-at-least-32-characters" }

        val exception = assertThrows<IllegalArgumentException> { headersOf(plugin) }

        assertEquals("Property 'clientId' is required for authentication type ZGW_JWT", exception.message)
    }

    @Test
    fun `should require auth secret for TOKEN`() {
        val plugin = plugin(AuthenticationType.TOKEN)

        val exception = assertThrows<IllegalArgumentException> { plugin.validateConfiguration() }

        assertEquals("Property 'authSecret' is required for authentication type TOKEN", exception.message)
    }

    @Test
    fun `should refuse a client secret shorter than 32 characters for ZGW_JWT`() {
        val plugin =
            plugin(AuthenticationType.ZGW_JWT) {
                clientId = "valtimo_client"
                authSecret = "shorter-than-32-characters"
            }

        val exception = assertThrows<IllegalStateException> { plugin.validateConfiguration() }

        assertEquals("SecretKey needs to be at least 32 in length", exception.message)
    }

    @Test
    fun `should apply the same headers through the WebClient filter`() {
        val plugin = plugin(AuthenticationType.TOKEN) { authSecret = "secret-token" }
        var sentAuthorization: String? = null

        WebClient
            .builder()
            .filter(plugin)
            .exchangeFunction { request ->
                sentAuthorization = request.headers().getFirst(HttpHeaders.AUTHORIZATION)
                Mono.just(
                    ClientResponse.create(HttpStatus.OK).build(),
                )
            }.build()
            .get()
            .uri("http://localhost/")
            .retrieve()
            .toBodilessEntity()
            .block()

        assertEquals("Token secret-token", sentAuthorization)
    }

    @Test
    fun `should not replace the request factory without certificates`() {
        listOf(AuthenticationType.NONE, AuthenticationType.BEARER, AuthenticationType.HEADER).forEach { type ->
            val plugin =
                plugin(type) {
                    authHeaderName = "X-Api-Key"
                    authSecret = "secret"
                }
            val builder = mock<RestClient.Builder>(defaultAnswer = Answers.RETURNS_SELF)

            plugin.applyAuth(builder)

            verify(builder, never()).requestFactory(any())
        }
    }

    @Test
    fun `should ignore a stored private key without client certificate`() {
        val plugin = plugin(AuthenticationType.NONE) { clientPrivateKey = TlsFixtures.CLIENT_PRIVATE_KEY }
        val builder = mock<RestClient.Builder>(defaultAnswer = Answers.RETURNS_SELF)

        plugin.validateConfiguration()
        plugin.applyAuth(builder)

        verify(builder, never()).requestFactory(any())
    }

    @Test
    fun `should present client certificate and token to a server that requires mutual TLS`() {
        MtlsTestServer().use { server ->
            val plugin =
                plugin(AuthenticationType.TOKEN) {
                    authSecret = "1e2804e1113e083fb1f8258d161a2e222c317987"
                    clientCertificate = TlsFixtures.CLIENT_CERTIFICATE
                    clientPrivateKey = TlsFixtures.CLIENT_PRIVATE_KEY
                    serverCertificate = TlsFixtures.CA_CERTIFICATE
                }

            val body = call(plugin, server.baseUrl)

            assertEquals("{}", body)
            assertEquals(TlsFixtures.CLIENT_SUBJECT, server.receivedClientCertificateSubject)
            assertEquals("Token 1e2804e1113e083fb1f8258d161a2e222c317987", server.receivedAuthorization)
        }
    }

    @Test
    fun `should read a PKCS1 private key`() {
        MtlsTestServer().use { server ->
            val plugin =
                plugin(AuthenticationType.NONE) {
                    clientCertificate = TlsFixtures.CLIENT_CERTIFICATE
                    clientPrivateKey = TlsFixtures.CLIENT_PRIVATE_KEY_PKCS1
                    serverCertificate = TlsFixtures.CA_CERTIFICATE
                }

            call(plugin, server.baseUrl)

            assertEquals(TlsFixtures.CLIENT_SUBJECT, server.receivedClientCertificateSubject)
        }
    }

    @Test
    fun `should be rejected by a server that requires mutual TLS when no client certificate is configured`() {
        MtlsTestServer().use { server ->
            val plugin = plugin(AuthenticationType.NONE) { serverCertificate = TlsFixtures.CA_CERTIFICATE }

            assertThrows<ResourceAccessException> { call(plugin, server.baseUrl) }
            assertNull(server.receivedClientCertificateSubject)
        }
    }

    @Test
    fun `should not trust a server whose CA is not in the JVM trust store when no server certificate is configured`() {
        MtlsTestServer().use { server ->
            val plugin =
                plugin(AuthenticationType.NONE) {
                    clientCertificate = TlsFixtures.CLIENT_CERTIFICATE
                    clientPrivateKey = TlsFixtures.CLIENT_PRIVATE_KEY
                }

            val exception = assertThrows<ResourceAccessException> { call(plugin, server.baseUrl) }

            val causes = generateSequence(exception as Throwable) { it.cause }.toList()
            assertTrue(
                causes.any { it is SSLHandshakeException && it.message!!.contains("PKIX path building failed") },
                causes.joinToString { "${it.javaClass.name}: ${it.message}" },
            )
        }
    }

    @Test
    fun `should trust the server's own certificate as server certificate`() {
        MtlsTestServer().use { server ->
            val plugin =
                plugin(AuthenticationType.NONE) {
                    clientCertificate = TlsFixtures.CLIENT_CERTIFICATE
                    clientPrivateKey = TlsFixtures.CLIENT_PRIVATE_KEY
                    serverCertificate = TlsFixtures.SERVER_CERTIFICATE
                }

            call(plugin, server.baseUrl)

            assertEquals(TlsFixtures.CLIENT_SUBJECT, server.receivedClientCertificateSubject)
        }
    }

    @Test
    fun `should refuse a client certificate without private key`() {
        val plugin = plugin(AuthenticationType.NONE) { clientCertificate = TlsFixtures.CLIENT_CERTIFICATE }

        assertTlsError(plugin, "Property 'clientPrivateKey' is required when 'clientCertificate' is set")
    }

    @Test
    fun `should refuse a private key that does not belong to the client certificate`() {
        val plugin =
            plugin(AuthenticationType.NONE) {
                clientCertificate = TlsFixtures.CLIENT_CERTIFICATE
                clientPrivateKey = TlsFixtures.OTHER_PRIVATE_KEY
            }

        assertTlsError(plugin, "Property 'clientPrivateKey' does not belong to the certificate in 'clientCertificate'")
    }

    @Test
    fun `should accept an RSASSA-PSS client certificate and key`() {
        val plugin =
            plugin(AuthenticationType.NONE) {
                clientCertificate = TlsFixtures.PSS_CLIENT_CERTIFICATE
                clientPrivateKey = TlsFixtures.PSS_CLIENT_PRIVATE_KEY
            }

        plugin.validateConfiguration()
    }

    @Test
    fun `should refuse an RSASSA-PSS private key that does not belong to the client certificate`() {
        val plugin =
            plugin(AuthenticationType.NONE) {
                clientCertificate = TlsFixtures.PSS_CLIENT_CERTIFICATE
                clientPrivateKey = TlsFixtures.PSS_OTHER_PRIVATE_KEY
            }

        assertTlsError(plugin, "Property 'clientPrivateKey' does not belong to the certificate in 'clientCertificate'")
    }

    @Test
    fun `should refuse text that is not PEM, naming the field without echoing it`() {
        val notPem = "not-a-certificate-secret-content"
        assertTlsError(
            plugin(AuthenticationType.NONE) {
                clientCertificate = notPem
                clientPrivateKey = TlsFixtures.CLIENT_PRIVATE_KEY
            },
            "Property 'clientCertificate' does not contain a valid PEM certificate",
        )
        assertTlsError(
            plugin(AuthenticationType.NONE) {
                clientCertificate = TlsFixtures.CLIENT_CERTIFICATE
                clientPrivateKey = notPem
            },
            "Property 'clientPrivateKey' does not contain a valid unencrypted PEM private key",
        )
        assertTlsError(
            plugin(AuthenticationType.NONE) { serverCertificate = notPem },
            "Property 'serverCertificate' does not contain a valid PEM certificate",
        )
        assertTlsError(
            plugin(AuthenticationType.NONE) {
                clientCertificate = TlsFixtures.CLIENT_PRIVATE_KEY
                clientPrivateKey = TlsFixtures.CLIENT_PRIVATE_KEY
            },
            "Property 'clientCertificate' does not contain a valid PEM certificate",
        )
    }

    @Test
    fun `should install Valtimo's timeouts and buffering on the mTLS request factory`() {
        val properties =
            ValtimoHttpRestClientConfigurationProperties(
                connectTimeout = 7,
                connectionRequestTimeout = 8,
            )
        val cache = TlsRequestFactoryCache(properties)
        val plugin = plugin(AuthenticationType.NONE, cache) { serverCertificate = TlsFixtures.CA_CERTIFICATE }
        val builder = mock<RestClient.Builder>(defaultAnswer = Answers.RETURNS_SELF)

        plugin.applyAuth(builder)

        val requestFactory =
            argumentCaptor<ClientHttpRequestFactory>()
                .apply { verify(builder).requestFactory(capture()) }
                .firstValue
        assertTrue(requestFactory is BufferingClientHttpRequestFactory)
        val wrapped =
            ReflectionTestUtils.getField(
                requestFactory,
                "requestFactory",
            ) as HttpComponentsClientHttpRequestFactory
        assertEquals(Duration.ofSeconds(7).toMillis(), ReflectionTestUtils.getField(wrapped, "connectTimeout"))
        assertEquals(
            Duration.ofSeconds(8).toMillis(),
            ReflectionTestUtils.getField(wrapped, "connectionRequestTimeout"),
        )
    }

    @Test
    fun `should reuse one request factory per set of certificates`() {
        val cache = TlsRequestFactoryCache(restClientProperties)

        fun requestFactoryOf(plugin: HttpClientAuthenticationPlugin) =
            argumentCaptor<ClientHttpRequestFactory>()
                .apply {
                    val builder = mock<RestClient.Builder>(defaultAnswer = Answers.RETURNS_SELF)
                    plugin.applyAuth(builder)
                    verify(builder).requestFactory(capture())
                }.firstValue

        val first =
            requestFactoryOf(
                plugin(AuthenticationType.NONE, cache) {
                    serverCertificate =
                        TlsFixtures.CA_CERTIFICATE
                },
            )
        val second =
            requestFactoryOf(
                plugin(AuthenticationType.BEARER, cache) {
                    authSecret = "other"
                    serverCertificate = TlsFixtures.CA_CERTIFICATE
                },
            )
        val third =
            requestFactoryOf(
                plugin(AuthenticationType.NONE, cache) {
                    serverCertificate =
                        TlsFixtures.SERVER_CERTIFICATE
                },
            )

        assertSame(first, second)
        assertFalse(first === third)
    }

    private fun assertTlsError(
        plugin: HttpClientAuthenticationPlugin,
        message: String,
    ) {
        val onSave = assertThrows<IllegalArgumentException> { plugin.validateConfiguration() }
        val onUse = assertThrows<IllegalArgumentException> { plugin.applyAuth(RestClient.builder()) }

        assertEquals(message, onSave.message)
        assertEquals(message, onUse.message)
    }

    private fun call(
        plugin: HttpClientAuthenticationPlugin,
        url: String,
    ): String? =
        sharedRestClientBuilder
            .clone()
            .apply { plugin.applyAuth(it) }
            .build()
            .get()
            .uri(url)
            .retrieve()
            .body<String>()

    private fun headersOf(plugin: HttpClientAuthenticationPlugin): HttpHeaders {
        val headers = HttpHeaders()
        val builder = RestClient.builder()
        plugin.applyAuth(builder)
        builder.build().mutate().defaultHeaders { headers.addAll(it) }
        return headers
    }

    private fun plugin(
        type: AuthenticationType,
        cache: TlsRequestFactoryCache = TlsRequestFactoryCache(restClientProperties),
        configure: HttpClientAuthenticationPlugin.() -> Unit = {},
    ) = HttpClientAuthenticationPlugin(
        PluginConfigurationId.newId(),
        ValtimoOpenZaakPluginTokenGeneratorService(),
        cache,
    ).also {
        // Not apply: the plugin is an ExchangeFilterFunction, whose own apply(ExchangeFunction) would win
        it.authenticationType = type
        it.configure()
    }
}
