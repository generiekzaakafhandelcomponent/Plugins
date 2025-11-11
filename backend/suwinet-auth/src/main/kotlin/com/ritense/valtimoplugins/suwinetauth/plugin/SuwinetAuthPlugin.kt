/*
 *  Copyright 2015-2025 Ritense BV, the Netherlands.
 *
 *  Licensed under EUPL, Version 1.2 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.ritense.valtimoplugins.suwinetauth.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginCategory
import com.ritense.plugin.annotation.PluginProperty
import io.github.oshai.kotlinlogging.KotlinLogging
import org.apache.cxf.configuration.jsse.TLSClientParameters
import org.apache.cxf.configuration.security.AuthorizationPolicy
import org.apache.cxf.endpoint.Client
import org.apache.cxf.frontend.ClientProxy
import org.apache.cxf.message.Message
import org.apache.cxf.transport.http.HTTPConduit
import java.io.FileInputStream
import java.security.KeyStore
import javax.net.ssl.KeyManagerFactory
import javax.net.ssl.TrustManagerFactory
import kotlin.contracts.contract

@PluginCategory("suwinet-authentication")
@Plugin(
    key = "suwinet-auth",
    title = "Suwinet Auth plugin",
    description = "Plugin delivering authentication for Suwinet plugin"
)
open class SuwinetAuthPlugin(): SuwinetAuth {
    @PluginProperty(key = "authType", secret = false, required = true)
    var authType: String? = null

    @PluginProperty(key = "keystorePath", secret = false, required = false)
    var keystorePath: String? = null

    @PluginProperty(key = "keystoreSecret", secret = true, required = false)
    var keystoreSecret: String? = null

    @PluginProperty(key = "truststorePath", secret = false, required = false)
    var truststorePath: String? = null

    @PluginProperty(key = "truststoreSecret", secret = true, required = false)
    var truststoreSecret: String? = null

    @PluginProperty(key = "basicAuthName", secret = false, required = false)
    var basicAuthName: String? = null

    @PluginProperty(key = "basicAuthSecret", secret = true, required = false)
    var basicAuthSecret: String? = null

    @PluginProperty(key = "headerName", secret = false, required = false)
    var headerName: String = ""

    @PluginProperty(key = "headerValue", secret = true, required = false)
    var headerValue: String = ""

    private var keystoreManagerFactory: KeyManagerFactory? = null
    private var trustManagerFactory: TrustManagerFactory? = null


    override fun applyAuth(client: Client) {

        when(authType) {
            SuwinetAuth.AuthType.MTLS.authType ->  addMtlsAuth(client)
            SuwinetAuth.AuthType.BASIC.authType -> addBasicAuth(client)
            SuwinetAuth.AuthType.HEADER.authType -> addHeaderAuth(client)
            else -> {
                logger.warn { "Unsupported auth type $authType" }
            }
        }

    }

    private fun addHeaderAuth(client: Client) {
        logger.info { "using authorization type ${authType}" }

        client.outInterceptors.add(HttpHeaderInterceptor(headerName, headerValue))
    }

    private fun addBasicAuth(client: Client) {
        var conduit = client.conduit as HTTPConduit
        conduit.authorization = basicAuthorization()
        logger.info { "using authorization type ${authType}" }
        logger.info { "set conduit.authorization type to ${conduit.authorization.authorizationType}" }

    }

    private fun addMtlsAuth(client: Client) {
        logger.info { "using authorization type ${authType}" }

        var conduit = client.conduit as HTTPConduit

        val tlsParameters = TLSClientParameters()

        buildKeyManagerFactory(keystorePath, keystoreSecret)
        buildTrustManagerFactory(truststorePath, truststoreSecret)

        tlsParameters.keyManagers = keystoreManagerFactory?.keyManagers
        tlsParameters.trustManagers = trustManagerFactory?.trustManagers

        conduit.tlsClientParameters = tlsParameters
    }

    fun basicAuthorization(): AuthorizationPolicy {
        val authorizationPolicy = AuthorizationPolicy()
        authorizationPolicy.userName = basicAuthName
        authorizationPolicy.password = basicAuthSecret
        authorizationPolicy.authorizationType = "Basic"
        return authorizationPolicy
    }

    private fun buildKeyManagerFactory(
        keystoreCertificate: String? = null,
        keystoreKey: String? = null
    ): KeyManagerFactory? {

        return if (keystoreCertificate.isNullOrEmpty() || keystoreKey.isNullOrEmpty()) {
            logger.info { "Keystore not set" }
            null
        } else {
            logger.info { "wsgKeyManagerFactory certificate: $keystoreCertificate" }
            val keyStore = KeyStore.getInstance("jks")
            keyStore.load(FileInputStream(keystoreCertificate), keystoreKey.toCharArray())
            keystoreManagerFactory = KeyManagerFactory.getInstance("SunX509")
            keystoreManagerFactory?.init(keyStore, keystoreKey.toCharArray())
            keystoreManagerFactory
        }
    }

    private fun buildTrustManagerFactory(
        truststoreCertificate: String? = null,
        truststoreKey: String? = null
    ): TrustManagerFactory? {
        return if (truststoreCertificate.isNullOrEmpty() || truststoreKey.isNullOrEmpty()) {
            logger.info { "Truststore not set." }
            null
        } else {
            val trustStore = KeyStore.getInstance("jks")
            logger.info { "wsgTrustManagerFactory certificate: $truststoreCertificate" }

            trustStore.load(FileInputStream(truststoreCertificate), truststoreKey.toCharArray())
            trustManagerFactory = TrustManagerFactory.getInstance("SunX509")
            trustManagerFactory?.init(trustStore)
            trustManagerFactory
        }
    }

    companion object {
        private val logger = KotlinLogging.logger { }
    }

}
