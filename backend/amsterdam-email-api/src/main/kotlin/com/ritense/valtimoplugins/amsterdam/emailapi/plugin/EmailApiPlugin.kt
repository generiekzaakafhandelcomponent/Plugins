package com.ritense.valtimoplugins.amsterdam.emailapi.plugin

import com.github.ksuid.Ksuid
import com.ritense.documentenapi.DocumentenApiAuthentication
import com.ritense.documentenapi.client.DocumentInformatieObject
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.amsterdam.emailapi.client.Attachment
import com.ritense.valtimoplugins.amsterdam.emailapi.client.BodyPart
import com.ritense.valtimoplugins.amsterdam.emailapi.client.EmailClient
import com.ritense.valtimoplugins.amsterdam.emailapi.client.EmailMessage
import com.ritense.valtimoplugins.amsterdam.emailapi.client.Recipient
import io.github.oshai.kotlinlogging.KotlinLogging
import java.net.URI
import java.util.Base64
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.util.MimeTypeUtils
import org.springframework.web.client.RestClient
import org.springframework.web.client.body

private const val UTF8 = "utf-8"
private val logger = KotlinLogging.logger {}


private const val ATTACHMENT = "attachment"

@Plugin(
    key = "amsterdamemailapi",
    title = "Email API Amsterdam",
    description = "Zend emails via Email API"
)
class EmailApiPlugin(
    private val emailClient: EmailClient,
    private val restClientBuilder: RestClient.Builder
    ) {

    @PluginProperty(key = "emailApiBaseUrl", secret = false, required = true)
    lateinit var emailApiBaseUrl: String

    @PluginProperty(key = "subscriptionKey", secret = true, required = true)
    lateinit var subscriptionKey: String

    @PluginProperty(key = "authenticationPluginConfiguration", secret = false)
    lateinit var authenticationPluginConfiguration: DocumentenApiAuthentication

    /**
     * For backwards compatibility, this plugin action supports both the `to` and `toEmail`/`toName` action properties.
     * The `to` action property should be preferred as it allows more than one recipient.
     * When a `to` is provided (= not null), the `toEmail` and `toName` properties will be ignored.
     * The same applies for the `cc` and `bcc` fields.
     */
    @PluginAction(
        key = "zend-email",
        title = "Zend email via API met optioneel zaak ID en relatiecode",
        description = "Zend een email via de Email API waarbij optioneel de zaak ID en relatiecode meegegeven kan worden. Deze worden verwerkt in de messageId.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun sendEmail(
        execution: DelegateExecution,
        @PluginActionProperty zaakId: String,
        @PluginActionProperty relatieCodes: Any?,
        @PluginActionProperty to: List<EmailAddress>?,
        @PluginActionProperty toEmail: String?,
        @PluginActionProperty toName: String?,
        @PluginActionProperty fromAddress: String,
        @PluginActionProperty emailSubject: String,
        @PluginActionProperty contentHtml: String,
        @PluginActionProperty attachments: List<String>?,
        @PluginActionProperty cc: List<EmailAddress>?,
        @PluginActionProperty ccEmail: String?,
        @PluginActionProperty ccName: String?,
        @PluginActionProperty bcc: List<EmailAddress>?,
        @PluginActionProperty bccEmail: String?,
        @PluginActionProperty bccName: String?,
    ) {
        val toRecipients = convertToRecipients(to, toEmail, toName)

        if (toRecipients.isEmpty()) {
            throw IllegalStateException("No 'to' address has been specified.")
        }

        val ccRecipients = convertToRecipients(cc, ccEmail, ccName)
        val bccRecipients = convertToRecipients(bcc, bccEmail, bccName)

        val relatieCodesDerived = mutableListOf<String>()

        if(relatieCodes is String) {
            relatieCodesDerived.add(relatieCodes)
        }
        else if( relatieCodes is List<*>) {
            relatieCodesDerived.addAll(relatieCodes as Collection<String>)
        }

        val message = EmailMessage(
            to = toRecipients,
            cc = ccRecipients,
            bcc = bccRecipients,
            from = Recipient(address = fromAddress),
            content = setOf(
                BodyPart(
                    content = contentHtml,
                    mimeType = MimeTypeUtils.TEXT_HTML.toString(),
                    encoding = UTF8
                )
            ),
            subject = emailSubject,
            zaakId = zaakId,
            relatieCodes = relatieCodesDerived.map { it.toInt() },
            messageId = generateMessageId(zaakId, if(relatieCodesDerived.isEmpty()) "" else relatieCodesDerived.get(0)),
        )

        // set optional values
        if(!attachments.isNullOrEmpty()) {
                handleAttachments(message, attachments)
        }

        // send
        emailClient.send(message, URI.create(emailApiBaseUrl), subscriptionKey)
    }

    private fun convertToRecipients(
        recipients: List<EmailAddress>?,
        recipientEmail: String?,
        recipientName: String?
    ): Set<Recipient> {
        return if (recipients != null) {
            recipients.map { (address, name) ->
                Recipient(
                    address = address,
                    name = name
                )
            }.toSet()
        } else if (recipientEmail != null) {
            setOf(
                Recipient(
                    address = recipientEmail,
                    name = recipientName
                )
            )
        } else {
            emptySet()
        }
    }

    private fun handleAttachments(message: EmailMessage, documentUrls: List<String>) {
        val restClient = authenticationPluginConfiguration.applyAuth(restClientBuilder).build()

        documentUrls.forEach{
            val informatieObject =  restClient
                .get()
                .uri(it)
                .retrieve()
                .body<DocumentInformatieObject>()!!
            logger.debug { "found object for url:" + it }

            if(tooBigAsAttachment(informatieObject.bestandsomvang!!)) {
                logger.info(it + "is too big. Size is " + informatieObject.bestandsomvang)
            }
            else {
                logger.debug { "adding attachment: " +  informatieObject.bestandsnaam}

                val downloadURI = URI(informatieObject.url.toString().plus("/download"))
                val content = restClient
                    .get()
                    .uri(downloadURI)
                    .retrieve()
                    .body<ByteArray>()!!

                val attachment: Attachment = Attachment(
                    ATTACHMENT,
                    informatieObject.bestandsnaam,
                    Base64.getEncoder().encodeToString(content),
                    informatieObject.formaat,
                    downloadURI
                )
                message.attachments.add(attachment)
            }
        }

    }

    private fun tooBigAsAttachment(bestandsomvang: Long): Boolean {
        return bestandsomvang/(1024*1024) > 20
    }

    private fun generateMessageId(zaakId: String, relatieCode: String?) = listOfNotNull(zaakId, relatieCode, Ksuid.newKsuid()).joinToString(separator = "-")
}
