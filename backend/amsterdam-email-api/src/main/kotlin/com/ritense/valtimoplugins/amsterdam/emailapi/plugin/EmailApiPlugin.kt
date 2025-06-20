package com.ritense.valtimoplugins.amsterdam.emailapi.plugin

import com.github.ksuid.Ksuid
import com.ritense.documentenapi.DocumentenApiAuthentication
import com.ritense.documentenapi.client.DocumentInformatieObject
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.amsterdam.emailapi.client.*
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.util.MimeTypeUtils
import org.springframework.web.client.RestClient
import org.springframework.web.client.body

import java.net.URI
import java.util.Base64

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
        @PluginActionProperty toEmail: String,
        @PluginActionProperty toName: String?,
        @PluginActionProperty fromAddress: String,
        @PluginActionProperty emailSubject: String,
        @PluginActionProperty contentHtml: String,
        @PluginActionProperty attachments: List<String>?,
        @PluginActionProperty ccEmail: String?,
        @PluginActionProperty ccName: String?,
        @PluginActionProperty bccEmail: String?,
        @PluginActionProperty bccName: String?,
    ) {
        val relatieCodesDerived = mutableListOf<String>()

        if(relatieCodes is String) {
            relatieCodesDerived.add(relatieCodes)
        }
        else if( relatieCodes is List<*>) {
            relatieCodesDerived.addAll(relatieCodes as Collection<String>)
        }

        val message = EmailMessage(
            to = setOf(
                Recipient(
                    address = toEmail,
                    name = toName
                )
            ),
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

        if(ccEmail != null) {
            message.cc = setOf(
                Recipient(
                    address = ccEmail,
                    name = ccName
                )
            )

        }

        if(bccEmail != null) {
            message.bcc = setOf(
                Recipient(
                    address = bccEmail,
                    name = bccName
                )
            )
        }

        // send
        emailClient.send(message, URI.create(emailApiBaseUrl), subscriptionKey)
    }

    private fun handleAttachments(message: EmailMessage, documentUrls: List<String>) {
        var restClient = authenticationPluginConfiguration.applyAuth(restClientBuilder).build()

        documentUrls.forEach{
            var informatieObject =  restClient
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

                var downloadURI = URI(informatieObject.url.toString().plus("/download"))
                var content = restClient
                    .get()
                    .uri(downloadURI)
                    .retrieve()
                    .body<ByteArray>()!!

                var attachment: Attachment = Attachment(
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
