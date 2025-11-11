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
import org.apache.cxf.frontend.ClientProxy
import org.apache.cxf.transport.http.HTTPConduit
import java.io.FileInputStream
import java.security.KeyStore
import javax.net.ssl.KeyManagerFactory
import javax.net.ssl.TrustManagerFactory

@PluginCategory("authentication")
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


    override fun applyAuth(client: ClientProxy): ClientProxy {

        when(authType) {
            SuwinetAuth.AuthType.MTLS.authType -> return addMtlsAuth(client.)
            SuwinetAuth.AuthType.BASIC.authType -> return addBasicAuth(conduit)
            SuwinetAuth.AuthType.HEADER.authType -> return addHeaderAuth(conduit)
            else -> {
                logger.warn { "Unsupported auth type $authType" }
                return conduit
            }
        }

    }

    private fun addHeaderAuth(conduit: HTTPConduit): HTTPConduit {
        logger.info { "using authorization type ${authType}" }

        var interceptor = HttpHeaderInterceptor(headerName, headerValue)
        conduit.

        return conduit.
    }

    private fun addBasicAuth(conduit: HTTPConduit): HTTPConduit {
        conduit.authorization = basicAuthorization()
        logger.info { "using authorization type ${authType}" }
        logger.info { "set conduit.authorization type to ${conduit.authorization.authorizationType}" }

        return conduit
    }

    private fun addMtlsAuth(conduit: HTTPConduit): HTTPConduit {
        logger.info { "using authorization type ${authType}" }        val tlsParameters = TLSClientParameters()

        buildKeyManagerFactory(keystorePath, keystoreSecret)
        buildTrustManagerFactory(truststorePath, truststoreSecret)

        tlsParameters.keyManagers = keystoreManagerFactory?.keyManagers
        tlsParameters.trustManagers = trustManagerFactory?.trustManagers

        conduit.tlsClientParameters = tlsParameters
        return conduit
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
