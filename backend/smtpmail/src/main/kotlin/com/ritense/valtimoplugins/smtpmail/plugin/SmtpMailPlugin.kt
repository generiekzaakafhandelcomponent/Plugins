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

package com.ritense.valtimoplugins.smtpmail.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.valtimoplugins.smtpmail.dto.Email
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailContextDto
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailPluginPropertyDto
import com.ritense.valtimoplugins.smtpmail.service.SmtpMailService
import com.ritense.valtimoplugins.smtpmail.validation.requireNoControlChars
import com.ritense.valtimoplugins.smtpmail.validation.requireValidEmail
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "smtp-mail",
    title = "SMTP mail Plugin",
    description = "Send mail through SMTP with the SMTP mail plugin",
)
class SmtpMailPlugin(
    private val smtpMailService: SmtpMailService,
) {
    @PluginProperty(key = "host", secret = false, required = true)
    lateinit var host: String

    @PluginProperty(key = "port", secret = false, required = true)
    var port: Int? = DEFAULT_PORT

    @PluginProperty(key = "username", required = false, secret = false)
    var username: String? = null

    @PluginProperty(key = "password", required = false, secret = true)
    var password: String? = null

    @PluginProperty(key = "protocol", required = false, secret = false)
    var protocol: String? = DEFAULT_PROTOCOL

    // Off by default: enabling this writes the entire SMTP dialogue — envelope recipients
    // (including Bcc), headers and the full message body — to the application log.
    @PluginProperty(key = "debug", required = false, secret = false)
    var debug: Boolean? = DEFAULT_DEBUG

    @PluginProperty(key = "auth", required = false, secret = false)
    var auth: Boolean? = DEFAULT_AUTH

    @PluginProperty(key = "startTlsEnable", required = false, secret = false)
    var startTlsEnable: Boolean? = DEFAULT_START_TLS_ENABLE

    @PluginAction(
        key = "send-mail",
        title = "Send mail",
        description = "Send an email",
        activityTypes = [SERVICE_TASK_START],
    )
    fun sendMail(
        execution: DelegateExecution,
        @PluginActionProperty sender: Email,
        @PluginActionProperty fromName: String?,
        @PluginActionProperty recipients: List<Email>,
        @PluginActionProperty cc: List<Email>?,
        @PluginActionProperty bcc: List<Email>?,
        @PluginActionProperty subject: String,
        @PluginActionProperty contentId: String,
        @PluginActionProperty attachmentIds: List<String>?,
    ) {
        // Header injection guard, re-checked server side for defence in depth.
        requireNoControlChars(subject, "subject")
        requireNoControlChars(fromName, "fromName")

        requireValidEmail(sender.address, "sender")
        recipients.forEach { requireValidEmail(it.address, "recipients") }
        cc?.forEach { requireValidEmail(it.address, "cc") }
        bcc?.forEach { requireValidEmail(it.address, "bcc") }

        smtpMailService.sendSmtpMail(
            mailContext =
                SmtpMailContextDto(
                    sender = sender,
                    fromName = fromName.takeIf { !it.isNullOrBlank() } ?: sender.address,
                    recipients = recipients,
                    ccList = cc ?: emptyList(),
                    bccList = bcc ?: emptyList(),
                    subject = subject,
                    contentResourceId = contentId,
                    attachmentResourceIds = attachmentIds ?: emptyList(),
                ),
            // Taken from this instance, whose properties Valtimo injected from the plugin
            // configuration bound to the process link. Never looked up again downstream.
            connection = connectionProperties(),
        )
    }

    private fun connectionProperties() =
        SmtpMailPluginPropertyDto(
            host = host,
            port = port ?: DEFAULT_PORT,
            username = username,
            password = password,
            protocol = protocol ?: DEFAULT_PROTOCOL,
            debug = debug ?: DEFAULT_DEBUG,
            auth = auth ?: DEFAULT_AUTH,
            startTlsEnable = startTlsEnable ?: DEFAULT_START_TLS_ENABLE,
        )

    companion object {
        private const val DEFAULT_PORT = 25
        private const val DEFAULT_PROTOCOL = "smtp"
        private const val DEFAULT_DEBUG = false
        private const val DEFAULT_AUTH = true
        private const val DEFAULT_START_TLS_ENABLE = true
    }
}
