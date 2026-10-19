/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
import io.github.oshai.kotlinlogging.KotlinLogging
import java.nio.charset.Charset
import java.util.Date
import java.util.UUID

private val logger = KotlinLogging.logger {}

class NotifyNlTokenGenerationService {
    fun generateFullToken(apiKey: String): String {
        logger.debug { "Generating a token for a request to NotifyNL" }

        val match = API_KEY_REGEX.matchEntire(apiKey)
            ?: throw IllegalArgumentException(
                "Invalid API key format. A NotifyNL API key consists of a name, a service id and a " +
                    "secret key, separated by hyphens."
            )

        val (serviceIdStr, secretKeyStr) = match.destructured

        val serviceId = UUID.fromString(serviceIdStr)
        val secretKey = UUID.fromString(secretKeyStr)

        val signingKey = Keys.hmacShaKeyFor(secretKey.toString().toByteArray(Charsets.UTF_8))

        return Jwts.builder()
            .issuer(serviceId.toString())
            .issuedAt(Date())
            .signWith(signingKey)
            .compact()
    }

    companion object {
        private const val UUID_PATTERN = """[0-9a-fA-F]{8}-(?:[0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}"""

        /**
         * A NotifyNL API key is `{name}-{serviceId}-{secretKey}`. The name is chosen by the operator and
         * may itself contain hyphens, so the parse is anchored on the two trailing UUIDs rather than on
         * the name. The name is deliberately not captured, so that the two captured groups remain the
         * service id and the secret key.
         */
        private val API_KEY_REGEX = Regex(
            """^.+-($UUID_PATTERN)-($UUID_PATTERN)$""",
            RegexOption.IGNORE_CASE
        )
    }
}
