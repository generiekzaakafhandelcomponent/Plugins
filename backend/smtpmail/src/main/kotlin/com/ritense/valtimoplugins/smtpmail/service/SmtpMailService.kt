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
package com.ritense.valtimoplugins.smtpmail.service

import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.ResourceStorageDelegate
import com.ritense.valtimoplugins.smtpmail.client.SmtpMailClient
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailContentDto
import com.ritense.valtimoplugins.smtpmail.dto.SmtpMailContextDto
import java.io.InputStream
import mu.KotlinLogging
import org.pf4j.Extension
import org.pf4j.ExtensionPoint
import org.springframework.stereotype.Service

@Extension(ordinal = 1)
@Service
class SmtpMailService(
    private val smtpMailClient: SmtpMailClient,
    private val storageService: ResourceStorageDelegate
) : ExtensionPoint {

    fun sendSmtpMail(
        mailContext: SmtpMailContextDto
    ) {
        val mailContent = prepareMailContent(
            contentResourceId = mailContext.contentResourceId,
            attachmentResourceIds = mailContext.attachmentResourceIds
        )

        smtpMailClient.sendEmail(mailContext, mailContent).also {
            logger.info { "Attempted to send SMTP mail with subject ${mailContext.subject}" }
        }
    }

    private fun prepareMailContent(
        contentResourceId: String,
        attachmentResourceIds: List<String>
    ): SmtpMailContentDto {
        val attachments: MutableList<SmtpMailContentDto.Attachment> = mutableListOf()

        var totalAttachmentsSize = 0

        attachmentResourceIds.forEach { attachmentResourceId ->
            totalAttachmentsSize += checkForMaxAttachmentSize(
                storageService.getResourceContentAsInputStream(attachmentResourceId),
                totalAttachmentsSize
            )

            val fileNameMetadata = storageService.getMetadata(attachmentResourceId, MetadataType.FILE_NAME.key)
            val contentTypeMetadata = storageService.getMetadata(attachmentResourceId, MetadataType.CONTENT_TYPE.key)
            val fileName = "$fileNameMetadata.$contentTypeMetadata"

            attachments.add(SmtpMailContentDto.Attachment(fileName, attachmentResourceId))
        }

        val mailMessageAsInputStream = storageService.getResourceContentAsInputStream(contentResourceId).also {
            logger.debug { "Fetching mail message with resourceId '$contentResourceId" }
        }

        return SmtpMailContentDto(
            mailMessage = mailMessageAsInputStream.toPlainText(),
            attachments = attachments
        )
    }

    private fun checkForMaxAttachmentSize(attachment: InputStream, totalAttachmentSize: Int): Int {
        val attachmentSize = attachment.readAllBytes().size

        if (totalAttachmentSize + attachmentSize > MAX_SIZE_EMAIL_BODY_IN_BYTES) {
            throw IllegalStateException("Email exceeds max size of 25 mb")
        }

        return attachmentSize
    }

    private fun InputStream.toPlainText(): String = use { stream ->
        stream.bufferedReader().readText()
    }

    companion object {
        val logger = KotlinLogging.logger {}

        private const val MAX_SIZE_EMAIL_BODY_IN_BYTES: Int = 25000000  // 25mb
    }
}