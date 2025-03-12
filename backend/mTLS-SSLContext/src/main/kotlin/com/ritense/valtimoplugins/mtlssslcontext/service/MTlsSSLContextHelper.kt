package com.ritense.valtimoplugins.mtlssslcontext.service

import org.apache.hc.core5.ssl.SSLContextBuilder
import java.io.ByteArrayInputStream
import java.security.KeyFactory
import java.security.KeyStore
import java.security.cert.Certificate
import java.security.cert.CertificateFactory
import java.security.spec.PKCS8EncodedKeySpec
import java.util.Base64
import javax.net.ssl.SSLContext

object MTlsSSLContextHelper {

    private const val PKCS12 = "PKCS12"
    private const val X_509 = "X.509"
    private const val RSA = "RSA"

    fun createSslContext(
        base64PrivateKey: String,
        base64ClientCert: String,
        base64CaCert: String
    ): SSLContext {
        val privateKey = decodePrivateKey(base64PrivateKey)//loadPrivateKeyFromString(base64PrivateKey)
        val clientCert = decodeCertificate(base64ClientCert)
        val caCert = decodeCertificate(base64CaCert)

        val keyStore = KeyStore.getInstance(PKCS12).apply {
            load(null, null) // Initialize empty keystore
            setKeyEntry("client-cert", privateKey, null, arrayOf(clientCert))
        }

        val trustStore = KeyStore.getInstance(PKCS12).apply {
            load(null, null) // Initialize empty truststore
            setCertificateEntry("ca-cert", caCert)
        }

        return SSLContextBuilder.create()
            .loadKeyMaterial(keyStore, null) // No password needed
            .loadTrustMaterial(trustStore, null)
            .build()
    }

    private fun decodeCertificate(base64Cert: String): Certificate =
        CertificateFactory.getInstance(X_509).generateCertificate(
            ByteArrayInputStream(Base64.getDecoder().decode(base64Cert))
        )

    private fun decodePrivateKey(input: String) =
        String(Base64.getDecoder().decode(input)).let { decodedBytes ->
            decodedBytes
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replace("\\s".toRegex(), "")
                .let {
                    Base64.getDecoder().decode(it)
                }
                .let { keyBytes ->
                    KeyFactory.getInstance(RSA).generatePrivate(
                        PKCS8EncodedKeySpec(keyBytes)
                    )
                }
        }
}
