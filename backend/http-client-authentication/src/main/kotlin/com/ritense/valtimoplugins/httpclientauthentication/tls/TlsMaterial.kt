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

package com.ritense.valtimoplugins.httpclientauthentication.tls

import org.springframework.boot.ssl.SslBundle
import org.springframework.boot.ssl.pem.PemContent
import org.springframework.boot.ssl.pem.PemSslStore
import org.springframework.boot.ssl.pem.PemSslStoreBundle
import java.security.MessageDigest
import java.security.PrivateKey
import java.security.Signature
import java.security.cert.X509Certificate
import java.security.interfaces.RSAPrivateKey
import java.security.interfaces.RSAPublicKey
import java.util.HexFormat

class TlsMaterial(
    clientCertificate: String?,
    clientPrivateKey: String?,
    serverCertificate: String?,
) {
    private val clientCertificate = clientCertificate?.takeIf { it.isNotBlank() }

    // The client certificate switches mTLS on: a stored key without certificate is ignored
    private val clientPrivateKey = clientPrivateKey?.takeIf { it.isNotBlank() && this.clientCertificate != null }
    private val serverCertificate = serverCertificate?.takeIf { it.isNotBlank() }

    val isConfigured: Boolean
        get() = clientCertificate != null || serverCertificate != null

    val digest: String by lazy {
        val sha256 = MessageDigest.getInstance("SHA-256")
        listOf(clientCertificate, clientPrivateKey, serverCertificate).forEach {
            sha256.update((it ?: "").toByteArray())
            sha256.update(0)
        }
        HexFormat.of().formatHex(sha256.digest())
    }

    fun toSslBundle(): SslBundle {
        val keyStore =
            clientCertificate?.let { certificateText ->
                val keyText =
                    clientPrivateKey
                        ?: throw IllegalArgumentException(
                            "Property 'clientPrivateKey' is required when 'clientCertificate' is set",
                        )
                val certificates = readCertificates(certificateText, CLIENT_CERTIFICATE)
                val privateKey = readPrivateKey(keyText)
                require(keyMatchesCertificate(privateKey, certificates.first())) {
                    "Property 'clientPrivateKey' does not belong to the certificate in 'clientCertificate'"
                }
                PemSslStore.of(certificates, privateKey)
            }
        val trustStore =
            serverCertificate?.let {
                PemSslStore.of(readCertificates(it, SERVER_CERTIFICATE), null)
            }
        return SslBundle.of(PemSslStoreBundle(keyStore, trustStore))
    }

    private fun readCertificates(
        text: String,
        property: String,
    ): List<X509Certificate> {
        val certificates =
            try {
                PemContent.of(text.trim()).certificates
            } catch (e: Exception) {
                null
            }
        require(!certificates.isNullOrEmpty()) { "Property '$property' does not contain a valid PEM certificate" }
        return certificates
    }

    private fun readPrivateKey(text: String): PrivateKey {
        val privateKey =
            try {
                PemContent.of(text.trim()).privateKey
            } catch (e: Exception) {
                null
            }
        return requireNotNull(
            privateKey,
        ) { "Property 'clientPrivateKey' does not contain a valid unencrypted PEM private key" }
    }

    private fun keyMatchesCertificate(
        privateKey: PrivateKey,
        certificate: X509Certificate,
    ): Boolean {
        val publicKey = certificate.publicKey
        if (privateKey.algorithm != publicKey.algorithm) {
            return false
        }
        // Covers RSA and RSASSA-PSS, whose signatures cannot be made without parameters
        if (privateKey is RSAPrivateKey && publicKey is RSAPublicKey) {
            return privateKey.modulus == publicKey.modulus
        }
        val algorithm = if (privateKey.algorithm == "EC") "SHA256withECDSA" else privateKey.algorithm
        val challenge = "http-client-authentication".toByteArray()
        val signed =
            Signature.getInstance(algorithm).run {
                initSign(privateKey)
                update(challenge)
                sign()
            }
        return Signature.getInstance(algorithm).run {
            initVerify(publicKey)
            update(challenge)
            verify(signed)
        }
    }

    companion object {
        private const val CLIENT_CERTIFICATE = "clientCertificate"
        private const val SERVER_CERTIFICATE = "serverCertificate"
    }
}
