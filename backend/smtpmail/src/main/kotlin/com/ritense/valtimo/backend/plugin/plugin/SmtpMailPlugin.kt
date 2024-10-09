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

package com.ritense.valtimo.backend.plugin.plugin


import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.valtimo.backend.plugin.dto.Email
import com.ritense.valtimo.backend.plugin.dto.SmtpMailContextDto
import com.ritense.valtimo.backend.plugin.service.SmtpMailService
import com.ritense.valueresolver.ValueResolverService
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "smtp-mail",
    title = "SMTP mail Plugin",
    description = "Send mail through SMTP with the SMTP mail plugin"
)
class SmtpMailPlugin(
    private val smtpMailService: SmtpMailService,
    private val valueResolverService: ValueResolverService
) {

    @PluginProperty(key = "host", secret = false, required = true)
    lateinit var host: String

    @PluginProperty(key = "port", secret = false, required = true)
    lateinit var port: String

    @PluginProperty(key = "username", required = false, secret = false)
    var username: String? = null

    @PluginProperty(key = "password", required = false, secret = true)
    var password: String? = null

    @PluginProperty(key = "protocol", required = false, secret = false)
    var protocol: String? = "smtp"

    @PluginProperty(key = "debug", required = false, secret = false)
    var debug: Boolean? = true

    @PluginProperty(key = "auth", required = false, secret = false)
    var auth: Boolean? = true

    @PluginProperty(key = "startTlsEnable", required = false, secret = false)
    var startTlsEnable: Boolean? = true

    @PluginAction(
        key = "send-mail",
        title = "Send mail",
        description = "Send an email",
        activityTypes = [SERVICE_TASK_START]
    )

    @Suppress("UNCHECKED_CAST")
    fun sendMail(
        execution: DelegateExecution,
        @PluginActionProperty sender: String,
        @PluginActionProperty recipients: String,
        @PluginActionProperty cc: String?,
        @PluginActionProperty bcc: String?,
        @PluginActionProperty subject: String,
        @PluginActionProperty contentId: String,
        @PluginActionProperty attachmentIds: String?,
    ) {
        val recipientList: List<String> = (resolveValue(execution, recipients)) as List<String>? ?: emptyList()
        val ccList: List<String> = (resolveValue(execution, cc)) as List<String>? ?: emptyList()
        val bccList: List<String> = (resolveValue(execution, bcc)) as List<String>? ?: emptyList()
        val attachmentIdList: List<String> = (resolveValue(execution, attachmentIds)) as List<String>? ?: emptyList()

        smtpMailService.sendSmtpMail(
            mailContext = SmtpMailContextDto(
                sender = Email(resolveValue(execution, sender) as String),
                recipients = recipientList.map { Email(it) },
                ccList = ccList.map { Email(it) },
                bccList = bccList.map { Email(it) },
                subject = resolveValue(execution, subject) as String,
                contentResourceId = resolveValue(execution, contentId) as String,
                attachmentResourceIds = attachmentIdList
            )
        )
    }

    private fun resolveValue(execution: DelegateExecution, value: String?): Any? {
        return if (value == null) {
            null
        } else {
            val resolvedValues = valueResolverService.resolveValues(
                execution.processInstanceId,
                execution,
                listOf(value)
            )
            resolvedValues[value]
        }
    }
}