/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.spotler.plugin

import com.ritense.spotler.service.SpotlerMailDispatcher
import com.ritense.spotler.service.SpotlerTokenService
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.ActivityType
import com.ritense.spotler.domain.SpotlerProperties
import com.ritense.spotler.domain.Placeholder
import com.ritense.spotler.domain.RecipientType
import com.ritense.spotler.domain.SpotlerRecipient
import com.ritense.valtimo.contract.basictype.EmailAddress
import com.ritense.valtimo.contract.basictype.SimpleName
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.contract.mail.model.TemplatedMailMessage
import com.ritense.valtimo.contract.mail.model.value.MailTemplateIdentifier
import com.ritense.valtimo.contract.mail.model.value.Recipient
import com.ritense.valtimo.contract.mail.model.value.RecipientCollection
import com.ritense.valtimo.contract.mail.model.value.Sender
import com.ritense.valtimo.contract.mail.model.value.Subject
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.web.client.RestTemplate

@Plugin(
    key = "spotler",
    title = "Spotler Plugin",
    description = "This plugin allows you to send emails from within a process"
)
class SpotlerPlugin(
    val restTemplate: RestTemplate
) {

    @PluginProperty(key = "clientId", secret = false)
    private lateinit var clientId: String

    @PluginProperty(key = "accountId", secret = false)
    private lateinit var accountId: String

    @PluginProperty(key = "clientSecret", secret = true)
    private lateinit var clientSecret: String

    private lateinit var spotlerMailDispatcher: SpotlerMailDispatcher

    @PluginAction(
        key = "sendMail",
        title = "Send an Email",
        description = "Use a spotler template to send an email",
        activityTypes = [ActivityType.SERVICE_TASK_START]
    )
    fun sendMail(
        execution: DelegateExecution,
        @PluginActionProperty subject: String,
        @PluginActionProperty senderEmail: String,
        @PluginActionProperty senderName: String,
        @PluginActionProperty recipients: Array<SpotlerRecipient>,
        @PluginActionProperty placeholders: Array<Placeholder>,
        @PluginActionProperty mailTemplateIdentifier: String
    ) {
        val spotlerProperties = SpotlerProperties(
            clientId,
            clientSecret,
            accountId
        )
        val spotlerTokenService = SpotlerTokenService(
            spotlerProperties,
            restTemplate
        )
        spotlerMailDispatcher = SpotlerMailDispatcher(
            spotlerProperties,
            spotlerTokenService,
            restTemplate,
            MapperSingleton.get()
        )

        val recipientCollection = RecipientCollection.from(
            recipients.map {
                val emailAddress = EmailAddress.from(it.email.resolve(execution))
                val name = SimpleName.from(it.name.resolve(execution))
                when(it.type) {
                    RecipientType.TO -> Recipient.to(emailAddress, name)
                    RecipientType.CC -> Recipient.cc(emailAddress, name)
                    RecipientType.BCC -> Recipient.bcc(emailAddress, name)
                }
            }
        )
        val mailTemplateIdentifier = MailTemplateIdentifier.from(mailTemplateIdentifier.resolve(execution))
        val sender = Sender.from(EmailAddress.from(senderEmail.resolve(execution)), SimpleName.from(senderName.resolve(execution)))
        val subject = Subject.from(subject.resolve(execution))

        val statuses = spotlerMailDispatcher.send(
            TemplatedMailMessage
                .with(recipientCollection, mailTemplateIdentifier)
                .sender(sender)
                .subject(subject)
                .placeholders(
                    placeholders.map {
                        it.key to it.value.resolve(execution)
                    }.toMap()
                )
                .build()
        )
        statuses.filter {
            it.status != "SENT"
        }.forEach {
            logger.error { "Failed to send email to ${it.email} (${it.status}): ${it.rejectReason}" }
        }
    }

    private fun String.resolve(execution: DelegateExecution): String {
        return if (this.startsWith("pv:")) {
            resolveFromProcessVariable(this.substring("pv:".length), execution)
        } else {
            this
        }
    }

    private fun resolveFromProcessVariable(value: String, execution: DelegateExecution): String {
        return execution.variables[value].toString()
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }

}
