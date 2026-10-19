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

package com.ritense.valtimoplugins.notifynl.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class NotifyNlTokenGenerationServiceTest {
    private val service = NotifyNlTokenGenerationService()

    @Test
    fun `should generate a token for an api key whose name contains hyphens`() {
        val token = service.generateFullToken("my-notify-nl-key-$SERVICE_ID-$SECRET_KEY")

        assertEquals(SERVICE_ID, issuerOf(token))
    }

    @Test
    fun `should generate a token for an api key whose name contains no hyphens`() {
        val token = service.generateFullToken("mykey-$SERVICE_ID-$SECRET_KEY")

        assertEquals(SERVICE_ID, issuerOf(token))
    }

    @Test
    fun `should not include the api key in the message of the thrown exception`() {
        val apiKey = "my-notify-nl-key-$SERVICE_ID"

        val exception = assertThrows<IllegalArgumentException> { service.generateFullToken(apiKey) }

        assertFalse(
            exception.message!!.contains(apiKey) || exception.message!!.contains(SECRET_KEY),
            "The exception message must not contain the api key, because it is persisted with the incident",
        )
    }

    @Test
    fun `should reject an api key that does not end in a service id and a secret key`() {
        assertThrows<IllegalArgumentException> { service.generateFullToken("no-uuids-here") }
    }

    /**
     * Verifies the signature with the key derived from the secret key, so that this also asserts that the
     * captured groups are not swapped.
     */
    private fun issuerOf(token: String): String =
        Jwts
            .parser()
            .verifyWith(Keys.hmacShaKeyFor(SECRET_KEY.toByteArray(Charsets.UTF_8)))
            .build()
            .parseSignedClaims(token)
            .payload
            .issuer

    companion object {
        private const val SERVICE_ID = "1c4a9b4e-6c1a-4f9e-8c3b-9f0d9f8e7a6b"
        private const val SECRET_KEY = "2b3c4d5e-6f70-4182-9394-a5b6c7d8e9f0"
    }
}
