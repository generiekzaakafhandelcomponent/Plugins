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

package com.ritense.valtimoplugins.smtpmail.plugin

import com.ritense.valtimoplugins.smtpmail.BaseTest
import com.ritense.valtimoplugins.smtpmail.dto.Email
import com.ritense.valtimoplugins.smtpmail.dto.EmailList
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailContextDto
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailPluginPropertyDto
import com.ritense.valtimoplugins.smtpmail.service.SmtpMailService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.camunda.bpm.engine.delegate.DelegateExecution

class SmtpMailPluginTest : BaseTest() {
    private lateinit var smtpMailService: SmtpMailService
    private lateinit var execution: DelegateExecution
    private lateinit var plugin: SmtpMailPlugin

    @BeforeEach
    fun setUp() {
        smtpMailService = mock()
        execution = mock()
        plugin =
            SmtpMailPlugin(smtpMailService).apply {
                host = "smtp.transactional.test"
                port = 587
                username = "transactional-user"
                password = "transactional-secret"
            }
    }

    // -- Debug default (CWE-532) -------------------------------------------------------

    @Test
    fun `debug is disabled by default`() {
        assertFalse(plugin.debug!!)
    }

    @Test
    fun `passes the configured debug setting to the service`() {
        sendMail()

        assertFalse(captureConnection().debug)
    }

    // -- Explicit configuration selection ---------------------------------------------

    @Test
    fun `passes its own plugin configuration to the service instead of an arbitrary one`() {
        sendMail()

        with(captureConnection()) {
            assertEquals("smtp.transactional.test", host)
            assertEquals(587, port)
            assertEquals("transactional-user", username)
            assertEquals("transactional-secret", password)
        }
    }

    @Test
    fun `falls back to the property defaults when a configuration leaves them empty`() {
        plugin.port = null
        plugin.protocol = null
        plugin.debug = null
        plugin.auth = null
        plugin.startTlsEnable = null

        sendMail()

        with(captureConnection()) {
            assertEquals(25, port)
            assertEquals("smtp", protocol)
            assertFalse(debug)
            assertEquals(true, auth)
            assertEquals(true, startTlsEnable)
        }
    }

    // -- CRLF / header injection guards (server side defence in depth) ------------------

    @Test
    fun `rejects CR in subject`() {
        assertThrows<IllegalArgumentException> { sendMail(subject = "phishy\rBcc: evil@example.com") }
        verifyNothingSent()
    }

    @Test
    fun `rejects LF in subject`() {
        assertThrows<IllegalArgumentException> { sendMail(subject = "phishy\nBcc: evil@example.com") }
        verifyNothingSent()
    }

    @Test
    fun `rejects CRLF in fromName`() {
        assertThrows<IllegalArgumentException> { sendMail(fromName = "Gemeente\r\nBcc: evil@example.com") }
        verifyNothingSent()
    }

    @Test
    fun `rejects CRLF in sender`() {
        assertThrows<IllegalArgumentException> { sendMail(sender = "ok@example.com\rfoo") }
        verifyNothingSent()
    }

    @Test
    fun `rejects CRLF in recipients`() {
        assertThrows<IllegalArgumentException> { sendMail(recipients = listOf("ok@example.com\nevil@example.com")) }
        verifyNothingSent()
    }

    @Test
    fun `rejects CRLF in cc`() {
        assertThrows<IllegalArgumentException> { sendMail(cc = listOf("ok@example.com\revil@example.com")) }
        verifyNothingSent()
    }

    @Test
    fun `rejects CRLF in bcc`() {
        assertThrows<IllegalArgumentException> { sendMail(bcc = listOf("ok@example.com\nevil@example.com")) }
        verifyNothingSent()
    }

    @Test
    fun `rejects a malformed recipient address`() {
        assertThrows<IllegalArgumentException> { sendMail(recipients = listOf("not-an-address")) }
        verifyNothingSent()
    }

    @Test
    fun `rejects a recipient address without an at sign`() {
        assertThrows<IllegalArgumentException> { sendMail(recipients = listOf("ontvanger.example.com")) }
        verifyNothingSent()
    }

    @Test
    fun `rejects an empty recipient address`() {
        assertThrows<IllegalArgumentException> { sendMail(recipients = listOf("")) }
        verifyNothingSent()
    }

    @Test
    fun `accepts a valid mail`() {
        sendMail()

        verify(smtpMailService).sendSmtpMail(any(), any())
    }

    // -- Hosts without a dot, such as a local mail catcher (regression) ------------------

    @Test
    fun `accepts a recipient on a host without a dot - dev at localhost`() {
        sendMail(recipients = listOf("dev@localhost"))

        verify(smtpMailService).sendSmtpMail(any(), any())
    }

    @Test
    fun `accepts a recipient on a host without a dot - test at mailhog`() {
        sendMail(recipients = listOf("test@mailhog"))

        verify(smtpMailService).sendSmtpMail(any(), any())
    }

    @Test
    fun `accepts a sender, cc and bcc on a host without a dot`() {
        sendMail(
            sender = "dev@localhost",
            recipients = listOf("test@mailhog"),
            cc = listOf("cc@mailpit"),
            bcc = listOf("bcc@localhost"),
        )

        verify(smtpMailService).sendSmtpMail(any(), any())
    }

    @Test
    fun `still rejects CRLF in a recipient on a host without a dot`() {
        assertThrows<IllegalArgumentException> { sendMail(recipients = listOf("dev@localhost\nBcc: evil@example.com")) }
        verifyNothingSent()
    }

    // -- Comma and semicolon separated address lists ------------------------------------

    @Test
    fun `splits a comma separated recipient value into separate addresses`() {
        sendMail(recipients = listOf("jan@example.com,piet@example.com"))

        assertEquals(
            listOf(Email("jan@example.com"), Email("piet@example.com")),
            captureContext().recipients,
        )
    }

    @Test
    fun `splits a semicolon separated recipient value into separate addresses`() {
        sendMail(recipients = listOf("jan@example.com;piet@example.com"))

        assertEquals(
            listOf(Email("jan@example.com"), Email("piet@example.com")),
            captureContext().recipients,
        )
    }

    @Test
    fun `trims surrounding whitespace and drops empty entries while splitting`() {
        sendMail(recipients = listOf(" jan@example.com , , piet@example.com; "))

        assertEquals(
            listOf(Email("jan@example.com"), Email("piet@example.com")),
            captureContext().recipients,
        )
    }

    @Test
    fun `splits a separated value in a list that also holds single addresses`() {
        sendMail(recipients = listOf("jan@example.com", "piet@example.com;klaas@example.com"))

        assertEquals(
            listOf(Email("jan@example.com"), Email("piet@example.com"), Email("klaas@example.com")),
            captureContext().recipients,
        )
    }

    @Test
    fun `splits separated values in cc and bcc`() {
        sendMail(
            cc = listOf("cc1@example.com,cc2@example.com"),
            bcc = listOf("bcc1@example.com;bcc2@example.com"),
        )

        with(captureContext()) {
            assertEquals(listOf(Email("cc1@example.com"), Email("cc2@example.com")), ccList)
            assertEquals(listOf(Email("bcc1@example.com"), Email("bcc2@example.com")), bccList)
        }
    }

    @Test
    fun `leaves a single address and an already separate list untouched`() {
        sendMail(recipients = listOf("jan@example.com", "piet@example.com"))

        assertEquals(
            listOf(Email("jan@example.com"), Email("piet@example.com")),
            captureContext().recipients,
        )
    }

    @Test
    fun `validates every address of a separated value`() {
        assertThrows<IllegalArgumentException> {
            sendMail(recipients = listOf("jan@example.com,not-an-address"))
        }
        verifyNothingSent()
    }

    @Test
    fun `rejects a recipients value that holds nothing but separators`() {
        val exception =
            assertThrows<IllegalArgumentException> { sendMail(recipients = listOf(" , ; ")) }

        assertTrue(exception.message!!.contains("recipients"))
        verifyNothingSent()
    }

    @Test
    fun `rejects an empty recipients list`() {
        assertThrows<IllegalArgumentException> { sendMail(recipients = emptyList()) }
        verifyNothingSent()
    }

    @Test
    fun `still rejects CRLF hidden in a separated value`() {
        assertThrows<IllegalArgumentException> {
            sendMail(recipients = listOf("jan@example.com,evil@example.com\r\nBcc: evil@example.com"))
        }
        verifyNothingSent()
    }

    @Test
    fun `does not split the sender`() {
        assertThrows<IllegalArgumentException> {
            sendMail(sender = "afzender@example.com,tweede@example.com")
        }
        verifyNothingSent()
    }

    // -- Sending without a process, such as from a scheduled job ------------------------

    @Test
    fun `sends without a DelegateExecution through the same configuration`() {
        sendMailWithoutExecution()

        with(captureConnection()) {
            assertEquals("smtp.transactional.test", host)
            assertEquals(587, port)
            assertEquals("transactional-user", username)
            assertEquals("transactional-secret", password)
        }
    }

    @Test
    fun `applies the same validation when sending without a DelegateExecution`() {
        assertThrows<IllegalArgumentException> {
            sendMailWithoutExecution(subject = "phishy\r\nBcc: evil@example.com")
        }
        verifyNothingSent()
    }

    @Test
    fun `builds the same mail context with and without a DelegateExecution`() {
        sendMail()
        val fromAction = captureContext()

        setUp()
        sendMailWithoutExecution()

        assertEquals(fromAction, captureContext())
    }

    // -- Content from a file or directly as text ----------------------------------------

    @Test
    fun `passes the content id to the service`() {
        sendMail()

        with(captureContext()) {
            assertEquals("content-resource-id", contentResourceId)
            assertNull(content)
        }
    }

    @Test
    fun `passes the content to the service`() {
        sendMail(contentId = null, content = "<p>Beste meneer</p>")

        with(captureContext()) {
            assertNull(contentResourceId)
            assertEquals("<p>Beste meneer</p>", content)
        }
    }

    @Test
    fun `treats a blank content id as absent when content is given`() {
        sendMail(contentId = " ", content = "<p>Beste meneer</p>")

        with(captureContext()) {
            assertNull(contentResourceId)
            assertEquals("<p>Beste meneer</p>", content)
        }
    }

    @Test
    fun `passes the content when sending without a DelegateExecution`() {
        sendMailWithoutExecution(contentId = null, content = "<p>Beste meneer</p>")

        assertEquals("<p>Beste meneer</p>", captureContext().content)
    }

    @Test
    fun `still accepts the positional arguments from before content was added`() {
        val sender = Email("afzender@example.com")
        val recipients = listOf(Email("ontvanger@example.com"))

        plugin.sendMail(execution, sender, null, EmailList(recipients), null, null, "Onderwerp", "content-id", null)
        plugin.sendMail(sender, null, recipients, null, null, "Onderwerp", "content-id", null)

        val captor = argumentCaptor<SmtpMailContextDto>()
        verify(smtpMailService, times(2)).sendSmtpMail(captor.capture(), any<SmtpMailPluginPropertyDto>())
        captor.allValues.forEach { assertEquals("content-id", it.contentResourceId) }
    }

    @Test
    fun `rejects a mail without content and content id`() {
        val exception = assertThrows<IllegalArgumentException> { sendMail(contentId = null, content = null) }

        assertTrue(exception.message!!.contains("content"))
        verifyNothingSent()
    }

    @Test
    fun `rejects a mail with blank content and no content id`() {
        assertThrows<IllegalArgumentException> { sendMail(contentId = null, content = "  ") }
        verifyNothingSent()
    }

    @Test
    fun `rejects a mail with both content and content id`() {
        assertThrows<IllegalArgumentException> { sendMail(content = "<p>Beste meneer</p>") }
        verifyNothingSent()
    }

    private fun sendMail(
        sender: String = "afzender@example.com",
        fromName: String? = "Gemeente",
        recipients: List<String> = listOf("ontvanger@example.com"),
        cc: List<String>? = null,
        bcc: List<String>? = null,
        subject: String = "Uw aanvraag",
        contentId: String? = "content-resource-id",
        content: String? = null,
    ) = plugin.sendMail(
        execution = execution,
        sender = Email(sender),
        fromName = fromName,
        recipients = EmailList(recipients.map { Email(it) }),
        cc = cc?.let { list -> EmailList(list.map { Email(it) }) },
        bcc = bcc?.let { list -> EmailList(list.map { Email(it) }) },
        subject = subject,
        contentId = contentId,
        content = content,
        attachmentIds = null,
    )

    private fun sendMailWithoutExecution(
        sender: String = "afzender@example.com",
        fromName: String? = "Gemeente",
        recipients: List<String> = listOf("ontvanger@example.com"),
        cc: List<String>? = null,
        bcc: List<String>? = null,
        subject: String = "Uw aanvraag",
        contentId: String? = "content-resource-id",
        content: String? = null,
    ) = plugin.sendMail(
        sender = Email(sender),
        fromName = fromName,
        recipients = recipients.map { Email(it) },
        cc = cc?.map { Email(it) },
        bcc = bcc?.map { Email(it) },
        subject = subject,
        contentId = contentId,
        attachmentIds = null,
        content = content,
    )

    private fun captureConnection(): SmtpMailPluginPropertyDto {
        val captor = argumentCaptor<SmtpMailPluginPropertyDto>()
        verify(smtpMailService).sendSmtpMail(any<SmtpMailContextDto>(), captor.capture())
        return captor.firstValue
    }

    private fun captureContext(): SmtpMailContextDto {
        val captor = argumentCaptor<SmtpMailContextDto>()
        verify(smtpMailService).sendSmtpMail(captor.capture(), any<SmtpMailPluginPropertyDto>())
        return captor.firstValue
    }

    private fun verifyNothingSent() {
        verify(smtpMailService, never()).sendSmtpMail(any(), any())
    }
}
