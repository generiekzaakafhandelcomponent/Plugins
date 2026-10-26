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

package com.ritense.valtimoplugins.httpclientauthentication.tls

import com.sun.net.httpserver.HttpsConfigurator
import com.sun.net.httpserver.HttpsExchange
import com.sun.net.httpserver.HttpsParameters
import com.sun.net.httpserver.HttpsServer
import org.springframework.boot.ssl.SslBundle
import org.springframework.boot.ssl.pem.PemSslStoreBundle
import org.springframework.boot.ssl.pem.PemSslStoreDetails
import java.net.InetSocketAddress
import java.security.cert.X509Certificate
import java.util.concurrent.CopyOnWriteArrayList

// An HTTPS server on a free port that demands a client certificate signed by the test CA, like Den Bosch's gateway.
// Answers with the body in [responses] for "<method> <path>", or with [responseBody] when there is none.
class MtlsTestServer(
    private val responseBody: String = "{}",
    private val responses: Map<String, String> = emptyMap(),
) : AutoCloseable {
    @Volatile
    var receivedAuthorization: String? = null

    @Volatile
    var receivedClientCertificateSubject: String? = null

    val receivedRequests: MutableList<ReceivedRequest> = CopyOnWriteArrayList()

    private val server: HttpsServer = HttpsServer.create(InetSocketAddress("127.0.0.1", 0), 0)

    init {
        val sslContext =
            SslBundle
                .of(
                    PemSslStoreBundle(
                        PemSslStoreDetails
                            .forCertificate(
                                TlsFixtures.SERVER_CERTIFICATE,
                            ).withPrivateKey(TlsFixtures.SERVER_PRIVATE_KEY),
                        PemSslStoreDetails.forCertificate(TlsFixtures.CA_CERTIFICATE),
                    ),
                ).createSslContext()
        server.httpsConfigurator =
            object : HttpsConfigurator(sslContext) {
                override fun configure(params: HttpsParameters) {
                    params.setSSLParameters(sslContext.defaultSSLParameters.apply { needClientAuth = true })
                }
            }
        server.createContext("/") { exchange ->
            receivedAuthorization = exchange.requestHeaders.getFirst("Authorization")
            receivedClientCertificateSubject =
                ((exchange as HttpsExchange).sslSession.peerCertificates.first() as X509Certificate)
                    .subjectX500Principal.name
            val request = "${exchange.requestMethod} ${exchange.requestURI.path}"
            receivedRequests.add(
                ReceivedRequest(request, receivedClientCertificateSubject, receivedAuthorization, exchange.remoteAddress.port),
            )
            val body = (responses[request] ?: responseBody).toByteArray()
            exchange.responseHeaders.add("Content-Type", "application/json")
            exchange.sendResponseHeaders(200, body.size.toLong())
            exchange.responseBody.use { it.write(body) }
        }
        server.start()
    }

    val baseUrl: String
        get() = "https://127.0.0.1:${server.address.port}"

    override fun close() {
        server.stop(0)
    }

    data class ReceivedRequest(
        val request: String,
        val clientCertificateSubject: String?,
        val authorization: String?,
        val clientPort: Int,
    )
}
