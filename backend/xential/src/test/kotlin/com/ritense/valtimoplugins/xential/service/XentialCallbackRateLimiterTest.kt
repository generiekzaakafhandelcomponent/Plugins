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
 */

package com.ritense.valtimoplugins.xential.service

import com.ritense.valtimoplugins.xential.autoconfiguration.XentialCallbackProperties
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset

class XentialCallbackRateLimiterTest {
    private var now: Instant = Instant.parse("2026-01-01T12:00:00Z")
    private val clock =
        object : Clock() {
            override fun instant() = now

            override fun getZone() = ZoneOffset.UTC

            override fun withZone(zone: java.time.ZoneId?) = this
        }

    @Test
    fun `should absorb unverified callbacks up to the configured budget and refuse the rest`() {
        val rateLimiter = rateLimiter(limit = 3)

        assertTrue(rateLimiter.recordUnverifiedCallback())
        assertTrue(rateLimiter.recordUnverifiedCallback())
        assertTrue(rateLimiter.recordUnverifiedCallback())
        assertFalse(rateLimiter.recordUnverifiedCallback())
        assertFalse(rateLimiter.recordUnverifiedCallback())
    }

    @Test
    fun `should replenish the budget once the window has passed`() {
        val rateLimiter = rateLimiter(limit = 2)

        assertTrue(rateLimiter.recordUnverifiedCallback())
        assertTrue(rateLimiter.recordUnverifiedCallback())
        assertFalse(rateLimiter.recordUnverifiedCallback())

        now = now.plusSeconds(61)

        assertTrue(rateLimiter.recordUnverifiedCallback())
    }

    @Test
    fun `should not limit anything when the budget is disabled`() {
        val rateLimiter = rateLimiter(limit = 0)

        repeat(100) {
            assertTrue(rateLimiter.recordUnverifiedCallback())
        }
    }

    private fun rateLimiter(limit: Int) =
        XentialCallbackRateLimiter(
            XentialCallbackProperties(
                rateLimit = limit,
                rateLimitWindow = Duration.ofMinutes(1),
            ),
            clock,
        )
}
