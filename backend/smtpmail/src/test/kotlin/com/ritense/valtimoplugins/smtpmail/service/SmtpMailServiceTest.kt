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

package com.ritense.valtimoplugins.smtpmail.service

import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.smtpmail.BaseTest
import com.ritense.valtimoplugins.smtpmail.client.SmtpMailClient
import com.ritense.valtimoplugins.smtpmail.dto.Email
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailContentDto
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailContextDto
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailPluginPropertyDto
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever

class SmtpMailServiceTest : BaseTest() {
    private lateinit var smtpMailClient: SmtpMailClient
    private lateinit var storageService: TemporaryResourceStorageService
    private lateinit var service: SmtpMailService

    @BeforeEach
    fun setUp() {
        smtpMailClient = mock()
        storageService = mock()
        service = SmtpMailService(smtpMailClient, storageService)
    }

    @Test
    fun `sends the content from the temporary file`() {
        whenever(storageService.getResourceContentAsInputStream("content-resource-id"))
            .doReturn("<p>Uit bestand</p>".byteInputStream())

        service.sendSmtpMail(mailContext(contentResourceId = "content-resource-id"), connection)

        assertEquals("<p>Uit bestand</p>", captureMailContent().mailMessage)
    }

    @Test
    fun `sends the content directly without reading a temporary file`() {
        service.sendSmtpMail(mailContext(content = "<p>Uit variabele</p>"), connection)

        assertEquals("<p>Uit variabele</p>", captureMailContent().mailMessage)
        verify(storageService, never()).getResourceContentAsInputStream(any())
    }

    private fun mailContext(
        contentResourceId: String? = null,
        content: String? = null,
    ) = SmtpMailContextDto(
        sender = Email("afzender@example.com"),
        fromName = "Gemeente",
        recipients = listOf(Email("ontvanger@example.com")),
        ccList = emptyList(),
        bccList = emptyList(),
        subject = "Uw aanvraag",
        contentResourceId = contentResourceId,
        attachmentResourceIds = emptyList(),
        content = content,
    )

    private fun captureMailContent(): SmtpMailContentDto {
        val captor = argumentCaptor<SmtpMailContentDto>()
        verify(smtpMailClient).sendEmail(any(), any(), captor.capture())
        return captor.firstValue
    }

    private val connection =
        SmtpMailPluginPropertyDto(
            host = "smtp.example.com",
            port = 25,
            username = null,
            password = null,
            protocol = "smtp",
            debug = false,
            auth = false,
            startTlsEnable = false,
        )
}
