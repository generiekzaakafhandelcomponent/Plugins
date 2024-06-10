package com.ritense.spotler.plugin

import com.ritense.mail.flowmailer.service.FlowmailerMailDispatcher
import com.ritense.mail.flowmailer.service.FlowmailerTokenService
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginEvent
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.ActivityType
import com.ritense.plugin.domain.EventType
import com.ritense.spotler.config.FlowmailerProperties
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

    private lateinit var flowmailerMailDispatcher: FlowmailerMailDispatcher

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
        @PluginActionProperty mailTemplateIdentifier: String
    ) {
        val flowMailerProperties = FlowmailerProperties(
            clientId,
            clientSecret,
            accountId
        )
        val flowmailerTokenService = FlowmailerTokenService(
            flowMailerProperties,
            restTemplate
        )
        flowmailerMailDispatcher = FlowmailerMailDispatcher(
            flowMailerProperties,
            flowmailerTokenService,
            restTemplate,
            MapperSingleton.get()
        )

        val recipientCollection = RecipientCollection.from(
            recipients.map {
                val emailAddress = EmailAddress.from(it.email)
                val name = SimpleName.from(it.name)
                when(it.type) {
                    RecipientType.TO -> Recipient.to(emailAddress, name)
                    RecipientType.CC -> Recipient.cc(emailAddress, name)
                    RecipientType.BCC -> Recipient.bcc(emailAddress, name)
                }
            }
        )
        val mailTemplateIdentifier = MailTemplateIdentifier.from(mailTemplateIdentifier)
        val sender = Sender.from(EmailAddress.from(senderEmail), SimpleName.from(senderName))
        val subject = Subject.from(subject)

        val statuses = flowmailerMailDispatcher.send(
            TemplatedMailMessage
                .with(recipientCollection, mailTemplateIdentifier)
                .sender(sender)
                .subject(subject)
                .build()
        )
        statuses.filter {
            it.status != "SENT"
        }.forEach {
            logger.error { "Failed to send email to ${it.email} (${it.status}): ${it.rejectReason}" }
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }

}
