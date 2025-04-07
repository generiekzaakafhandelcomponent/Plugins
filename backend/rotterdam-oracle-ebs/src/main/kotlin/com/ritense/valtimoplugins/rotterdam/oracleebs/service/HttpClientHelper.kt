package com.ritense.valtimoplugins.rotterdam.oracleebs.service

import com.ritense.valtimoplugins.mtlssslcontext.MTlsSslContext
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient
import org.apache.hc.client5.http.impl.classic.HttpClients
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder
import org.apache.hc.core5.ssl.SSLContextBuilder
import java.io.ByteArrayInputStream
import java.security.KeyFactory
import java.security.KeyStore
import java.security.PrivateKey
import java.security.cert.Certificate
import java.security.cert.CertificateFactory
import java.security.spec.PKCS8EncodedKeySpec
import java.util.Base64
import javax.net.ssl.SSLContext

object HttpClientHelper {

    private const val PKCS12 = "PKCS12"
    private const val X_509 = "X.509"
    private const val RSA = "RSA"

    fun createDefaultHttpClient(): CloseableHttpClient {
        return HttpClients.createDefault()
    }

    fun createSecureHttpClient(mTlsSslContext: MTlsSslContext): CloseableHttpClient =
        mTlsSslContext.createSslContext().let { sslContext ->
            PoolingHttpClientConnectionManagerBuilder.create()
                .setSSLSocketFactory(
                    SSLConnectionSocketFactoryBuilder.create()
                        .setSslContext(sslContext)
                        .build()
                )
                .build().let { connectionManager ->
                    HttpClients.custom()
                        .setConnectionManager(connectionManager)
                        .build()
                }
        }

    fun createSecureHttpClient(
        base64PrivateKey: String,
        base64ClientCert: String,
        base64CaCert: String
    ): CloseableHttpClient =
        createSslContext(base64PrivateKey, base64ClientCert, base64CaCert).let { sslContext ->
            PoolingHttpClientConnectionManagerBuilder.create()
                .setSSLSocketFactory(
                    SSLConnectionSocketFactoryBuilder.create()
                        .setSslContext(sslContext)
                        .build()
                )
                .build().let { connectionManager ->
                    HttpClients.custom()
                        .setConnectionManager(connectionManager)
                        .build()
                }
        }

    private fun createSslContext(
        base64PrivateKey: String,
        base64ClientCert: String,
        base64CaCert: String
    ): SSLContext {
        val privateKey = decodePrivateKey(base64PrivateKey)
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

    private fun decodePrivateKey(base64Key: String): PrivateKey =
        Base64.getDecoder().decode(prepareBase64PrivateKey(base64Key)).let { keyBytes ->
            KeyFactory.getInstance(RSA).generatePrivate(PKCS8EncodedKeySpec(keyBytes))
        }

    private fun prepareBase64PrivateKey(base64Key: String): String =
        base64Key
            .replace("-----BEGIN PRIVATE KEY-----", "")
            .replace("-----END PRIVATE KEY-----", "")
            .replace("\\s".toRegex(), "")
}
