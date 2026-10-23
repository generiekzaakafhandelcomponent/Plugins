/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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
 *
 */

package com.ritense.valtimoplugins.httpclientauthentication.plugin

import com.ritense.besluitenapi.BesluitenApiAuthentication
import com.ritense.catalogiapi.CatalogiApiAuthentication
import com.ritense.documentenapi.DocumentenApiAuthentication
import com.ritense.notificatiesapi.NotificatiesApiAuthentication
import com.ritense.objectenapi.ObjectenApiAuthentication
import com.ritense.objecttypenapi.ObjecttypenApiAuthentication
import com.ritense.openzaak.plugin.token.OpenZaakPluginTokenGeneratorService
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginEvent
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.EventType
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.valtimoplugins.httpclientauthentication.HttpClientAuthenticator
import com.ritense.valtimoplugins.httpclientauthentication.model.AuthenticationType
import com.ritense.valtimoplugins.httpclientauthentication.tls.TlsMaterial
import com.ritense.valtimoplugins.httpclientauthentication.tls.TlsRequestFactoryCache
import com.ritense.zakenapi.ZakenApiAuthentication
import mu.KotlinLogging
import org.springframework.http.HttpHeaders
import org.springframework.web.client.RestClient
import org.springframework.web.reactive.function.client.ClientRequest
import org.springframework.web.reactive.function.client.ClientResponse
import org.springframework.web.reactive.function.client.ExchangeFunction
import reactor.core.publisher.Mono

@Plugin(
    key = "http-client-authentication-plugin",
    title = "Http Client Authentication Plugin",
    description = "Provides authentication and mutual TLS for outbound REST clients, including the ZGW API plugins",
)
@Suppress("UNUSED")
class HttpClientAuthenticationPlugin(
    override val configurationId: PluginConfigurationId,
    private val tokenGeneratorService: OpenZaakPluginTokenGeneratorService,
    private val tlsRequestFactoryCache: TlsRequestFactoryCache,
) : HttpClientAuthenticator,
    ZakenApiAuthentication,
    DocumentenApiAuthentication,
    CatalogiApiAuthentication,
    BesluitenApiAuthentication,
    NotificatiesApiAuthentication,
    ObjectenApiAuthentication,
    ObjecttypenApiAuthentication {
    @PluginProperty(key = "authenticationType", secret = false, required = true)
    lateinit var authenticationType: AuthenticationType

    @PluginProperty(key = "authHeaderName", secret = false, required = false)
    var authHeaderName: String? = null

    @PluginProperty(key = "authSecret", secret = true, required = false)
    var authSecret: String? = null

    @PluginProperty(key = "clientId", secret = false, required = false)
    var clientId: String? = null

    @PluginProperty(key = "clientCertificate", secret = false, required = false)
    var clientCertificate: String? = null

    @PluginProperty(key = "clientPrivateKey", secret = true, required = false)
    var clientPrivateKey: String? = null

    @PluginProperty(key = "serverCertificate", secret = false, required = false)
    var serverCertificate: String? = null

    @PluginEvent(invokedOn = [EventType.CREATE, EventType.UPDATE])
    fun validateConfiguration() {
        setAuthHeaders(HttpHeaders())
        tlsMaterial().takeIf { it.isConfigured }?.toSslBundle()
    }

    override fun applyAuth(builder: RestClient.Builder): RestClient.Builder {
        val tlsMaterial = tlsMaterial()
        if (tlsMaterial.isConfigured) {
            builder.requestFactory(tlsRequestFactoryCache.requestFactory(tlsMaterial))
        }
        return builder.defaultHeaders { headers -> setAuthHeaders(headers) }
    }

    override fun filter(
        request: ClientRequest,
        next: ExchangeFunction,
    ): Mono<ClientResponse> {
        val filteredRequest =
            ClientRequest
                .from(request)
                .headers { headers ->
                    setAuthHeaders(headers)
                }.build()
        return next.exchange(filteredRequest)
    }

    private fun setAuthHeaders(headers: HttpHeaders) {
        when (authenticationType) {
            AuthenticationType.BEARER -> {
                headers.setBearerAuth(required(authSecret, "authSecret"))
            }

            AuthenticationType.HEADER -> {
                headers.set(required(authHeaderName, "authHeaderName"), required(authSecret, "authSecret"))
            }

            AuthenticationType.TOKEN -> {
                headers.set(HttpHeaders.AUTHORIZATION, "Token ${required(authSecret, "authSecret")}")
            }

            AuthenticationType.ZGW_JWT -> {
                val secret = required(authSecret, "authSecret")
                headers.setBearerAuth(tokenGeneratorService.generateToken(secret, required(clientId, "clientId")))
            }

            AuthenticationType.NONE -> Unit
        }
    }

    private fun required(value: String?, property: String): String =
        requireNotNull(value?.takeIf { it.isNotBlank() }) {
            "Property '$property' is required for authentication type $authenticationType"
        }

    private fun tlsMaterial() = TlsMaterial(clientCertificate, clientPrivateKey, serverCertificate)

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
