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

package com.ritense.plugin.sandbox.other

import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.annotation.ProcessBean
import java.io.ByteArrayInputStream
import java.io.InputStream
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.Resource
import org.springframework.stereotype.Service

@ProcessBean
@Service
class SmtpProcessVariableService(
    private val storageService: TemporaryResourceStorageService,
    @Value("classpath:file.txt")
    private val resourceFile: Resource
) {

    //Here you can set the variables to test the SmtpMail plugin action
    fun setVariablesForSmtpMail(execution: DelegateExecution) {

        val resourceId = storageService.store(
            inputStream = getContentInputStream(),
        )

        val attachmentId1 = storageService.store(
            inputStream =
            resourceFile.inputStream,
            mapOf(
                MetadataType.FILE_NAME.key to "TestFile",
                MetadataType.CONTENT_TYPE.key to "txt"
            )
        )
        val attachmentId2 = storageService.store(
            inputStream =
            resourceFile.inputStream,
            mapOf(
                MetadataType.FILE_NAME.key to "anotherTestFile",
                MetadataType.CONTENT_TYPE.key to "txt"
            )
        )

        execution.setVariable(SENDER_PROCESS_VAR, "")
        execution.setVariable(RECIPIENTS_PROCESS_VAR, listOf(""))
        execution.setVariable(CC_PROCESS_VAR, listOf(""))
        execution.setVariable(BCC_PROCESS_VAR, listOf(""))
        execution.setVariable(SUBJECT_PROCESS_VAR, "SMTP mail test")
        execution.setVariable(RESOURCE_ID_PROCESS_VAR, resourceId)
        execution.setVariable(ATTACHMENTS_PROCESS_VAR, listOf(attachmentId1, attachmentId2))
    }

    // Write your own testmail
    private fun getContentInputStream(): InputStream {
        val htmlString = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Sample Email</title>
        </head>
        <body>
            <p>Hello,</p>
        <p>Dit is een testmailtje voor de SMTP mail plugin :) .</p>
        <p>Sincerely,<br></p>
        </body>
        </html>
    """.trimIndent()

        return ByteArrayInputStream(htmlString.toByteArray())
    }

    companion object {
        const val SENDER_PROCESS_VAR = "sender"
        const val RECIPIENTS_PROCESS_VAR = "recipients"
        const val CC_PROCESS_VAR = "cc"
        const val BCC_PROCESS_VAR = "bcc"
        const val SUBJECT_PROCESS_VAR = "subject"
        const val RESOURCE_ID_PROCESS_VAR = "resourceId"
        const val ATTACHMENTS_PROCESS_VAR = "attachments"
    }
}