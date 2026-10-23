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

// Throwaway test CA with a server certificate for localhost and a client certificate; never used outside tests
object TlsFixtures {
    val CA_CERTIFICATE = read("ca.pem")
    val SERVER_CERTIFICATE = read("server.pem")
    val SERVER_PRIVATE_KEY = read("server-key.pem")
    val CLIENT_CERTIFICATE = read("client.pem")
    val CLIENT_PRIVATE_KEY = read("client-key.pem")
    val CLIENT_PRIVATE_KEY_PKCS1 = read("client-key-pkcs1.pem")
    val OTHER_PRIVATE_KEY = read("other-key.pem")
    val PSS_CLIENT_CERTIFICATE = read("pss-client.pem")
    val PSS_CLIENT_PRIVATE_KEY = read("pss-client-key.pem")
    val PSS_OTHER_PRIVATE_KEY = read("pss-other-key.pem")

    const val CLIENT_SUBJECT = "CN=gzac-test-client"

    private fun read(name: String): String =
        requireNotNull(TlsFixtures::class.java.getResource("/tls/$name")).readText()
}
