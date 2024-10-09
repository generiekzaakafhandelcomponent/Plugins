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

package com.ritense.valtimo.backend.plugin.client

import com.ritense.plugin.service.PluginService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.backend.plugin.dto.SmtpMailContentDto
import com.ritense.valtimo.backend.plugin.dto.SmtpMailContextDto
import com.ritense.valtimo.backend.plugin.dto.SmtpMailPluginPropertyDto
import com.ritense.valtimo.backend.plugin.plugin.SmtpMailPlugin
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import jakarta.mail.internet.MimeMessage
import org.springframework.mail.MailSendException
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Component

@SkipComponentScan
@Component
class SmtpMailClient(
    private val pluginService: PluginService,
    private val storageService: TemporaryResourceStorageService
) {

    fun sendEmail(
        mailContext: SmtpMailContextDto,
        mailContent: SmtpMailContentDto
    ) {
        try {
            val javaMailSender = javaMailSender()

            val message: MimeMessage = javaMailSender.createMimeMessage()

            with(MimeMessageHelper(message, true)) {
                setFrom(mailContext.sender.address)
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
            throw MailSendException("mail has failed to send. Cause: ${e.message}")
        }
    }

    private fun javaMailSender(): JavaMailSender = JavaMailSenderImpl().apply {
        with(getSmtpMailPluginData()) {
            this@apply.host = host
            this@apply.port = port.toInt()
            if (username != null) this@apply.username = username
            if (password != null) this@apply.password = password
            this@apply.protocol = protocol
            this@apply.javaMailProperties["mail.transport.protocol"] = protocol
            this@apply.javaMailProperties["mail.smtp.auth"] = auth
            this@apply.javaMailProperties["mail.smtp.starttls.enable"] = startTlsEnable
            this@apply.javaMailProperties["mail.debug"] = debug
        }
    }

    private fun getSmtpMailPluginData(): SmtpMailPluginPropertyDto {
        val pluginInstance = pluginService
            .createInstance(SmtpMailPlugin::class.java) { true }

        requireNotNull(pluginInstance) { "No plugin found" }

        return SmtpMailPluginPropertyDto(
            host = pluginInstance.host,
            port = pluginInstance.port,
            username = pluginInstance.username,
            password = pluginInstance.password,
            protocol = pluginInstance.protocol!!,
            debug = pluginInstance.debug!!,
            auth = pluginInstance.auth!!,
            startTlsEnable = pluginInstance.startTlsEnable!!
        )
    }
}