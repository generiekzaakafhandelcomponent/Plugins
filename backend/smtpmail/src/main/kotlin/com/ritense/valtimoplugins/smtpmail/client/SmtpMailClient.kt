/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailContentDto
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailContextDto
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailPluginPropertyDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.mail.Session
import jakarta.mail.internet.MimeMessage
import org.springframework.mail.MailSendException
import org.springframework.mail.javamail.JavaMailSenderImpl
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Component
import java.io.ByteArrayOutputStream
import java.io.OutputStream
import java.io.PrintStream
import java.nio.charset.StandardCharsets

@SkipComponentScan
@Component
class SmtpMailClient(
    private val storageService: TemporaryResourceStorageService,
) {
    fun sendEmail(
        connection: SmtpMailPluginPropertyDto,
        mailContext: SmtpMailContextDto,
        mailContent: SmtpMailContentDto,
    ) {
        try {
            val javaMailSender = javaMailSender(connection)

            val message: MimeMessage = javaMailSender.createMimeMessage()

            with(MimeMessageHelper(message, true)) {
                setFrom(mailContext.sender.address, mailContext.fromName)
                mailContext.recipients.forEach { addTo(it.address) }
                mailContext.ccList.forEach { addCc(it.address) }
                mailContext.bccList.forEach { addBcc(it.address) }
                setSubject(mailContext.subject)
                setText(mailContent.mailMessage, true)
                mailContent.attachments.forEach {
                    addAttachment(it.fileName) { storageService.getResourceContentAsInputStream(it.fileResourceId) }
                }

                javaMailSender.send(message)
            }
        } catch (e: Exception) {
            throw MailSendException("Failed to send mail", e)
        }
    }

    internal fun javaMailSender(connection: SmtpMailPluginPropertyDto): JavaMailSenderImpl =
        JavaMailSenderImpl().apply {
            with(connection) {
                this@apply.host = host
                this@apply.port = port
                if (!username.isNullOrBlank()) this@apply.username = username
                if (!password.isNullOrBlank()) this@apply.password = password
                this@apply.protocol = protocol
                this@apply.javaMailProperties["mail.transport.protocol"] = protocol
                this@apply.javaMailProperties["mail.smtp.auth"] = auth
                if (startTlsEnable) {
                    this@apply.javaMailProperties["mail.smtp.starttls.enable"] = true
                    this@apply.javaMailProperties["mail.smtp.socketFactory.class"] = "javax.net.ssl.SSLSocketFactory"
                    this@apply.javaMailProperties["mail.smtp.socketFactory.port"] = port.toString()
                }
                // Keep the AUTH exchange out of the trace even when debug is on. This is the
                // JavaMail default; set explicitly so ambient configuration cannot flip it.
                this@apply.javaMailProperties["mail.debug.auth"] = "false"
            }

            // Build the session ourselves so that the protocol trace is written through the
            // logger instead of stdout, where it would bypass log level, appender and
            // retention configuration entirely.
            //
            // Debug is switched on through Session.setDebug rather than the `mail.debug`
            // property, for two reasons: the property is read with Properties.getProperty and
            // therefore only honours String values, and setting it up front would make the
            // Session constructor itself trace to stdout before we can redirect it.
            session =
                Session.getInstance(javaMailProperties).apply {
                    debugOut = PrintStream(LineLoggingOutputStream(), true, StandardCharsets.UTF_8)
                    setDebug(connection.debug)
                }

            if (connection.debug) {
                logger.warn {
                    "SMTP debug tracing is enabled for host '${connection.host}'. " +
                        "The full SMTP dialogue - envelope recipients including Bcc, headers and message content - " +
                        "is written to logger '$DEBUG_LOGGER_NAME' at DEBUG level."
                }
            }
        }

    /**
     * Collects JavaMail's protocol trace line by line and hands each line to the logger.
     */
    private class LineLoggingOutputStream : OutputStream() {
        private val line = ByteArrayOutputStream(INITIAL_LINE_BUFFER_SIZE)

        override fun write(b: Int) {
            when (b) {
                '\n'.code -> flushLine()
                '\r'.code -> Unit
                else -> line.write(b)
            }
        }

        override fun flush() = flushLine()

        override fun close() = flushLine()

        private fun flushLine() {
            if (line.size() == 0) return
            val message = line.toString(StandardCharsets.UTF_8)
            line.reset()
            logger.debug { message }
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}

        private val DEBUG_LOGGER_NAME = SmtpMailClient::class.java.name

        private const val INITIAL_LINE_BUFFER_SIZE = 256
    }
}
