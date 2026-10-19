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

package com.ritense.valtimoplugins.freemarker.plugin.documentgenerator

import org.junit.jupiter.api.Assertions.assertTimeoutPreemptively
import org.junit.jupiter.api.Test
import org.xhtmlrenderer.pdf.ITextOutputDevice
import org.xhtmlrenderer.pdf.ITextRenderer
import java.net.ServerSocket
import java.time.Duration

class TimeoutUserAgentTest {
    @Test
    fun `should give up on a host that does not respond`() {
        // Accepts the connection (via the backlog) but never sends a response
        ServerSocket(0).use { server ->
            val outputDevice = ITextOutputDevice(ITextRenderer.DEFAULT_DOTS_PER_POINT)
            val userAgent =
                TimeoutUserAgent(
                    outputDevice,
                    ITextRenderer.DEFAULT_DOTS_PER_PIXEL,
                    readTimeout = Duration.ofMillis(200),
                )

            assertTimeoutPreemptively(Duration.ofSeconds(5)) {
                userAgent.getCSSResource("http://localhost:${server.localPort}/style.css")
            }
        }
    }
}
