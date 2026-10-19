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

package com.ritense.valtimoplugins.smtpmail.client

import com.ritense.valtimoplugins.smtpmail.BaseTest
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailPluginPropertyDto
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotSame
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import java.io.ByteArrayOutputStream
import java.io.PrintStream
import java.nio.charset.StandardCharsets

class SmtpMailClientTest : BaseTest() {
    private val client = SmtpMailClient(storageService = mock())

    @Test
    fun `does not enable the JavaMail protocol trace when debug is off`() {
        val sender = client.javaMailSender(connection(debug = false))

        assertFalse(sender.session.debug)
    }

    @Test
    fun `enables the JavaMail protocol trace when debug is on`() {
        val sender = client.javaMailSender(connection(debug = true))

        // Set on the Session, not through the `mail.debug` property: Session reads that one
        // with Properties.getProperty, which ignores the boxed Boolean the plugin holds.
        assertTrue(sender.session.debug)
    }

    @Test
    fun `never writes the protocol trace to stdout`() {
        listOf(false, true).forEach { debug ->
            val sender = client.javaMailSender(connection(debug = debug))

            assertNotSame(System.out, sender.session.debugOut)
        }
    }

    @Test
    fun `writes the protocol trace to the logger and not to stdout`() {
        val sender = client.javaMailSender(connection(debug = true))
        val stdout = ByteArrayOutputStream()
        val originalOut = System.out

        try {
            System.setOut(PrintStream(stdout, true, StandardCharsets.UTF_8))
            sender.session.debugOut.println("DEBUG SMTP: RCPT TO:<geheim@example.com>")
            sender.session.debugOut.flush()
        } finally {
            System.setOut(originalOut)
        }

        assertEquals("", stdout.toString(StandardCharsets.UTF_8))
    }

    @Test
    fun `keeps the AUTH exchange out of the protocol trace`() {
        val sender = client.javaMailSender(connection(debug = true))

        assertEquals("false", sender.javaMailProperties["mail.debug.auth"])
    }

    @Test
    fun `applies the supplied connection properties`() {
        val sender = client.javaMailSender(connection(debug = false))

        assertEquals("smtp.example.com", sender.host)
        assertEquals(587, sender.port)
        assertEquals("mail-user", sender.username)
        assertEquals("mail-secret", sender.password)
    }

    private fun connection(debug: Boolean) =
        SmtpMailPluginPropertyDto(
            host = "smtp.example.com",
            port = 587,
            username = "mail-user",
            password = "mail-secret",
            protocol = "smtp",
            debug = debug,
            auth = true,
            startTlsEnable = true,
        )
}
