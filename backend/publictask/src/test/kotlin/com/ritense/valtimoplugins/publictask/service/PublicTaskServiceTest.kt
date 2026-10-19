/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.publictask.service

import com.fasterxml.jackson.databind.node.JsonNodeFactory
import com.ritense.form.domain.FormTaskOpenResultProperties
import com.ritense.form.service.impl.DefaultFormSubmissionService
import com.ritense.form.web.rest.dto.FormSubmissionResult
import com.ritense.processlink.exception.ProcessLinkNotFoundException
import com.ritense.processlink.service.ProcessLinkActivityService
import com.ritense.processlink.web.rest.dto.ProcessLinkActivityResult
import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.upload.MimeTypeDeniedException
import com.ritense.valtimoplugins.publictask.BaseTest
import com.ritense.valtimoplugins.publictask.domain.PublicTaskAttachment
import com.ritense.valtimoplugins.publictask.domain.PublicTaskAttachmentLimits
import com.ritense.valtimoplugins.publictask.domain.PublicTaskData
import com.ritense.valtimoplugins.publictask.domain.PublicTaskDocumentMetadata
import com.ritense.valtimoplugins.publictask.domain.PublicTaskEntity
import com.ritense.valtimoplugins.publictask.htmlrenderer.service.HtmlRenderService
import com.ritense.valtimoplugins.publictask.repository.PublicTaskRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.reset
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoInteractions
import org.mockito.kotlin.whenever
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.http.HttpStatus
import org.springframework.mock.web.MockMultipartFile
import java.time.LocalDate
import java.util.Optional
import java.util.UUID

internal class PublicTaskServiceTest : BaseTest() {
    private val publicTaskRepository: PublicTaskRepository = mock()
    private val runtimeService: RuntimeService = mock()
    private val processLinkActivityService: ProcessLinkActivityService = mock()
    private val htmlRenderService: HtmlRenderService = mock()
    private val defaultFormSubmissionService: DefaultFormSubmissionService = mock()
    private val temporaryResourceStorageService: TemporaryResourceStorageService = mock()
    private val execution: DelegateExecution = mock()

    private val publicTaskService = publicTaskService()

    private fun publicTaskService(
        containerMaxFileSizeInBytes: Long? = null,
        fallbackBaseUrl: String? = "https://valtimo.example.org",
    ) = PublicTaskService(
        publicTaskRepository = publicTaskRepository,
        runtimeService = runtimeService,
        processLinkActivityService = processLinkActivityService,
        htmlRenderService = htmlRenderService,
        defaultFormSubmissionService = defaultFormSubmissionService,
        temporaryResourceStorageService = temporaryResourceStorageService,
        fallbackBaseUrl = fallbackBaseUrl,
        applicationMaxFileSizeInBytes = containerMaxFileSizeInBytes,
    )

    @Test
    fun `the link starts with the URL of the plugin configuration`() {
        createPublicTaskUrl(configuredBaseUrl = "https://gemeente.example.org")

        assertThat(createdUrl()).isEqualTo("https://gemeente.example.org$PUBLIC_TASK_PATH")
    }

    @Test
    fun `a URL without a scheme is read as an https one`() {
        createPublicTaskUrl(configuredBaseUrl = "gemeente.example.org")

        assertThat(createdUrl()).isEqualTo("https://gemeente.example.org$PUBLIC_TASK_PATH")
    }

    @Test
    fun `a trailing slash does not end up in the link twice`() {
        createPublicTaskUrl(configuredBaseUrl = "https://gemeente.example.org/")

        assertThat(createdUrl()).isEqualTo("https://gemeente.example.org$PUBLIC_TASK_PATH")
    }

    @Test
    fun `a plugin configuration without a URL of its own falls back to the application setting`() {
        createPublicTaskUrl(configuredBaseUrl = null)

        assertThat(createdUrl()).isEqualTo("https://valtimo.example.org$PUBLIC_TASK_PATH")
    }

    @Test
    fun `a link cannot be created when neither the plugin nor the application says where this environment is`() {
        val service = publicTaskService(fallbackBaseUrl = null)

        val thrown =
            assertThrows<IllegalStateException> {
                service.createAndSendPublicTaskUrl(execution, publicTaskData(), null)
            }

        assertThat(thrown).hasMessageContaining("Public Task plugin configuration")
        verify(publicTaskRepository, never()).save(any())
    }

    @Test
    fun `a URL that is not a web address is refused rather than sent out`() {
        assertThrows<IllegalArgumentException> {
            publicTaskService.createAndSendPublicTaskUrl(execution, publicTaskData(), "javascript://alert(1)")
        }

        verify(publicTaskRepository, never()).save(any())
    }

    @Test
    fun `the URL the link was built with stays with the task`() {
        createPublicTaskUrl(configuredBaseUrl = "https://gemeente.example.org")

        assertThat(savedPublicTask().baseUrl).isEqualTo("https://gemeente.example.org")
    }

    @Test
    fun `the form addresses the environment its own link was built with`() {
        givenPublicTask(baseUrl = "https://gemeente.example.org")
        givenAFormWithUploadField()

        publicTaskService.createPublicTaskHtml(PUBLIC_TASK_ID)

        assertThat(renderedVariables())
            .containsEntry("public_task_url", "https://gemeente.example.org$PUBLIC_TASK_PATH")
            .containsEntry("public_task_attachment_url", "https://gemeente.example.org$PUBLIC_TASK_PATH/attachment")
    }

    @Test
    fun `a task from before the URL was kept with it falls back to the application setting`() {
        givenPublicTask(baseUrl = "")
        givenAFormWithUploadField()

        publicTaskService.createPublicTaskHtml(PUBLIC_TASK_ID)

        assertThat(renderedVariables())
            .containsEntry("public_task_url", "https://valtimo.example.org$PUBLIC_TASK_PATH")
    }

    @Test
    fun `a form with nothing to fall back on addresses the environment it was served from`() {
        givenPublicTask(baseUrl = "")
        givenAFormWithUploadField()

        publicTaskService(fallbackBaseUrl = null).createPublicTaskHtml(PUBLIC_TASK_ID)

        assertThat(renderedVariables()).containsEntry("public_task_url", PUBLIC_TASK_PATH)
    }

    @Test
    fun `rendering the form is refused once the task has expired`() {
        givenPublicTask(expirationDate = LocalDate.now().minusDays(1))

        val response = publicTaskService.createPublicTaskHtml(PUBLIC_TASK_ID)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(processLinkActivityService, htmlRenderService)
    }

    @Test
    fun `rendering the form is refused once the task has been completed`() {
        givenPublicTask(completed = true)

        val response = publicTaskService.createPublicTaskHtml(PUBLIC_TASK_ID)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(processLinkActivityService, htmlRenderService)
    }

    @Test
    fun `rendering the form is refused when the expiration date cannot be read`() {
        givenPublicTask(expirationDate = null)

        val response = publicTaskService.createPublicTaskHtml(PUBLIC_TASK_ID)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(processLinkActivityService, htmlRenderService)
    }

    @Test
    fun `a task that is open and expires today is still rendered`() {
        givenPublicTask(expirationDate = LocalDate.now())

        // The lookup proves the availability check did not short-circuit.
        publicTaskService.createPublicTaskHtml(PUBLIC_TASK_ID)

        verify(processLinkActivityService).openTask(USER_TASK_ID)
    }

    @Test
    fun `submitting the form is refused once the task has expired`() {
        givenPublicTask(expirationDate = LocalDate.now().minusDays(1))

        val response = publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, SUBMISSION)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(processLinkActivityService, defaultFormSubmissionService)
    }

    @Test
    fun `submitting the form is refused once the task has been completed`() {
        givenPublicTask(completed = true)

        val response = publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, SUBMISSION)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(processLinkActivityService, defaultFormSubmissionService)
    }

    @Test
    fun `an unknown task is not available`() {
        whenever(publicTaskRepository.findById(PUBLIC_TASK_ID)).thenReturn(Optional.empty())

        val response = publicTaskService.createPublicTaskHtml(PUBLIC_TASK_ID)

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(processLinkActivityService, htmlRenderService)
    }

    @Test
    fun `an attachment is stored in temporary resource storage and reported back for the submission`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        val attachment = response.body as PublicTaskAttachment
        // Where Valtimo 12's UploadField reads a temporary resource from when the form is submitted.
        assertThat(attachment.id).isEqualTo(RESOURCE_ID)
        assertThat(attachment.storage).isEqualTo(PublicTaskAttachment.STORAGE_PROVIDER_NAME)
        assertThat(attachment.originalName).isEqualTo("bijlage.pdf")
        assertThat(attachment.size).isEqualTo(CONTENT.size.toLong())
    }

    @Test
    fun `an attachment is filed against the case document, without a user, so its origin stays visible`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        val metadata = argumentCaptor<Map<String, Any>>()
        verify(temporaryResourceStorageService).store(any(), metadata.capture())
        assertThat(metadata.firstValue)
            .containsEntry(MetadataType.FILE_NAME.key, "bijlage.pdf")
            .containsEntry(MetadataType.CONTENT_TYPE.key, "application/pdf")
            .containsEntry(MetadataType.USER.key, "public-task")
            .containsEntry(MetadataType.DOCUMENT_ID.key, BUSINESS_KEY)
    }

    @Test
    fun `an attachment is filed with the metadata its process link configured`() {
        // Without this the Documenten API has no informatieobjecttype or titel to file the document under.
        givenPublicTask(
            documentMetadata =
                mapOf(
                    "informatieobjecttype" to "https://catalogi.example.org/informatieobjecttypen/1",
                    "titel" to "Bijlage bij de aanvraag",
                ),
        )
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(storedMetadata())
            .containsEntry("informatieobjecttype", "https://catalogi.example.org/informatieobjecttypen/1")
            .containsEntry("titel", "Bijlage bij de aanvraag")
    }

    @Test
    fun `configured metadata cannot take over the keys a submission is checked against`() {
        // Stored unfiltered, as an older or hand-written row would be: the keys below still have to win.
        givenPublicTask(
            documentMetadataJson =
                """
                {"user":"a-logged-in-user","documentId":"a-different-case","filename":"iets-anders.pdf"}
                """.trimIndent(),
        )
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(storedMetadata())
            .containsEntry(MetadataType.USER.key, "public-task")
            .containsEntry(MetadataType.DOCUMENT_ID.key, BUSINESS_KEY)
            .containsEntry(MetadataType.FILE_NAME.key, "bijlage.pdf")
    }

    @Test
    fun `a filename cannot carry a path into the metadata`() {
        assertThat(fileNameStoredFor("../../etc/passwd.pdf")).isEqualTo("passwd.pdf")
        assertThat(fileNameStoredFor("""..\..\Windows\System32\config.pdf""")).isEqualTo("config.pdf")
    }

    @Test
    fun `a filename cannot carry control characters into the metadata`() {
        assertThat(fileNameStoredFor("bij\u0000lage\u001B[31m.pdf")).isEqualTo("bijlage[31m.pdf")
    }

    @Test
    fun `a filename cannot disguise what the file is with a direction override`() {
        // U+202E is not a control character, so it survives an isISOControl filter.
        assertThat(fileNameStoredFor("factuur‮fdp.exe")).isEqualTo("factuurfdp.exe")
        assertThat(fileNameStoredFor("bij​lage⁦.pdf")).isEqualTo("bijlage.pdf")
    }

    @Test
    fun `a filename that is left with nothing usable falls back to a placeholder`() {
        assertThat(fileNameStoredFor("   ")).isEqualTo("attachment")
        assertThat(fileNameStoredFor(null)).isEqualTo("attachment")
    }

    @Test
    fun `an overlong filename is cut back`() {
        assertThat(fileNameStoredFor("a".repeat(500))).hasSize(200)
    }

    @Test
    fun `uploading an attachment is refused once the task has expired`() {
        givenPublicTask(expirationDate = LocalDate.now().minusDays(1))

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `uploading an attachment is refused once the task has been completed`() {
        givenPublicTask(completed = true)

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `uploading an attachment to an unknown task is refused`() {
        whenever(publicTaskRepository.findById(PUBLIC_TASK_ID)).thenReturn(Optional.empty())

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `an attachment over the size limit is refused before it is read`() {
        givenPublicTask()

        val response =
            publicTaskService.storePublicTaskAttachment(
                PUBLIC_TASK_ID,
                null,
                aFile(content = ByteArray(MAX_ATTACHMENT_SIZE.toInt() + 1)),
            )

        assertThat(response.statusCode).isEqualTo(HttpStatus.PAYLOAD_TOO_LARGE)
        verifyNoInteractions(temporaryResourceStorageService)
        verify(publicTaskRepository, never()).reserveAttachmentSlot(any())
    }

    @Test
    fun `the size limit of the task is the one its process link asked for`() {
        givenPublicTask(maxAttachmentSizeInBytes = 8)
        givenAFreeAttachmentSlot()

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile(content = ByteArray(9)))

        assertThat(response.statusCode).isEqualTo(HttpStatus.PAYLOAD_TOO_LARGE)
        assertThat(response.body?.toString()).contains("8 bytes")
    }

    @Test
    fun `a task cannot accept more than the servlet container will receive`() {
        // A larger file never reaches this plugin, so a process link asking for more has to be capped.
        givenPublicTask(maxAttachmentSizeInBytes = 1_000_000)
        givenAFreeAttachmentSlot()

        val response =
            publicTaskService(containerMaxFileSizeInBytes = 16)
                .storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile(content = ByteArray(17)))

        assertThat(response.statusCode).isEqualTo(HttpStatus.PAYLOAD_TOO_LARGE)
        assertThat(response.body?.toString()).contains("16 bytes")
    }

    @Test
    fun `an attachment over the size limit of the field it was chosen in is refused`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        givenAFormWithUploadField(fileMaxSize = "16B")

        val response =
            publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, COMPONENT_KEY, aFile(content = ByteArray(17)))

        assertThat(response.statusCode).isEqualTo(HttpStatus.PAYLOAD_TOO_LARGE)
        assertThat(response.body?.toString()).contains("16 bytes")
        verifyNoInteractions(temporaryResourceStorageService)
        verify(publicTaskRepository).releaseAttachmentSlot(PUBLIC_TASK_ID)
    }

    @Test
    fun `a field cannot accept more than the task it is in`() {
        givenPublicTask(maxAttachmentSizeInBytes = 16)
        givenAFreeAttachmentSlot()
        givenAFormWithUploadField(fileMaxSize = "1GB")

        val response =
            publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, COMPONENT_KEY, aFile(content = ByteArray(17)))

        assertThat(response.statusCode).isEqualTo(HttpStatus.PAYLOAD_TOO_LARGE)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `an attachment of a type the field it was chosen in does not accept is refused`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        givenAFormWithUploadField(filePattern = "application/pdf")

        // Named like a pdf, but the content is plain text, which is what the pattern is held against.
        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, COMPONENT_KEY, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
        // The applicant is told what their file is; what the task accepts is configuration and stays back.
        assertThat(response.body?.toString()).isEqualTo("A file of type text/plain cannot be uploaded")
        verifyNoInteractions(temporaryResourceStorageService)
        verify(publicTaskRepository).releaseAttachmentSlot(PUBLIC_TASK_ID)
    }

    @Test
    fun `an attachment of a type the field it was chosen in accepts is stored`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        givenAFormWithUploadField(filePattern = "text/plain")
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, COMPONENT_KEY, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
    }

    @Test
    fun `an attachment of a type the task does not accept is refused`() {
        givenPublicTask(acceptedMimeTypes = "application/pdf,image/jpeg")
        givenAFreeAttachmentSlot()

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
        assertThat(response.body?.toString()).isEqualTo("A file of type text/plain cannot be uploaded")
        verifyNoInteractions(temporaryResourceStorageService)
        verify(publicTaskRepository).releaseAttachmentSlot(PUBLIC_TASK_ID)
    }

    @Test
    fun `the type the task accepts is the one the content was detected as, not the one that was claimed`() {
        givenPublicTask(acceptedMimeTypes = "application/pdf")
        givenAFreeAttachmentSlot()

        // The request and the name say pdf; the bytes say otherwise, and the bytes are what counts.
        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `renaming an executable does not make it the type it was renamed to`() {
        givenPublicTask(acceptedMimeTypes = "application/pdf")
        givenAFreeAttachmentSlot()

        // The name is only a hint, and never one that can talk over the content.
        val response =
            publicTaskService.storePublicTaskAttachment(
                PUBLIC_TASK_ID,
                null,
                aFile(fileName = "factuur.pdf", content = EXECUTABLE),
            )

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
        assertThat(response.body?.toString()).isEqualTo("A file of type application/x-msdownload cannot be uploaded")
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `a type that only its name can tell apart is still the type it is`() {
        // A CSV is plain text by content, so a task accepting 'text/csv' needs the name read as well.
        givenPublicTask(acceptedMimeTypes = "text/csv")
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        val response =
            publicTaskService.storePublicTaskAttachment(
                PUBLIC_TASK_ID,
                null,
                aFile(fileName = "bezwaar.csv", content = "id,naam\n1,Ruben\n".toByteArray()),
            )

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
    }

    @Test
    fun `an upload naming a field this form does not have is refused`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        givenAFormWithUploadField(componentKey = "bijlagen")

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, "iets-anders", aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        verifyNoInteractions(temporaryResourceStorageService)
        verify(publicTaskRepository).releaseAttachmentSlot(PUBLIC_TASK_ID)
    }

    @Test
    fun `an upload that does not name a field is held to the limits of the task alone`() {
        // A template written before the field name was sent along: the form is not resolved at all.
        givenPublicTask()
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        verifyNoInteractions(processLinkActivityService)
    }

    @Test
    fun `the type is not detected when neither the task nor the field narrows it`() {
        givenPublicTask(acceptedMimeTypes = "")
        givenAFreeAttachmentSlot()
        givenAFormWithUploadField()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, COMPONENT_KEY, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
    }

    @Test
    fun `an upload is refused when what its form accepts cannot be established`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        whenever(processLinkActivityService.openTask(USER_TASK_ID))
            .thenThrow(ProcessLinkNotFoundException("no process link for this task"))

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, COMPONENT_KEY, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
        verifyNoInteractions(temporaryResourceStorageService)
        verify(publicTaskRepository).releaseAttachmentSlot(PUBLIC_TASK_ID)
    }

    @Test
    fun `an empty attachment is refused`() {
        givenPublicTask()

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile(content = ByteArray(0)))

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `an attachment is refused once the task has used up its slots`() {
        givenPublicTask()
        whenever(publicTaskRepository.reserveAttachmentSlot(PUBLIC_TASK_ID)).thenReturn(0)

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.CONFLICT)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `a slot is claimed before the file is written, so that simultaneous uploads cannot pass the limit`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        val order = org.mockito.Mockito.inOrder(publicTaskRepository, temporaryResourceStorageService)
        order.verify(publicTaskRepository).reserveAttachmentSlot(PUBLIC_TASK_ID)
        order.verify(temporaryResourceStorageService).store(any(), any())
    }

    @Test
    fun `an attachment of a type that is not accepted is refused and does not cost a slot`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any()))
            .thenThrow(MimeTypeDeniedException("application/x-dosexec is not whitelisted for uploads."))

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
        // Refused by the application rather than by the task, and named the same way all the same.
        assertThat(response.body?.toString()).isEqualTo("A file of type text/plain cannot be uploaded")
        verify(publicTaskRepository).releaseAttachmentSlot(PUBLIC_TASK_ID)
    }

    @Test
    fun `a failure to store an attachment does not leak the reason to the applicant`() {
        givenPublicTask()
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any()))
            .thenThrow(IllegalStateException("/var/valtimo/temp is not writable"))

        val response = publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile())

        assertThat(response.statusCode).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR)
        assertThat(response.body?.toString()).doesNotContain("/var/valtimo/temp")
        verify(publicTaskRepository).releaseAttachmentSlot(PUBLIC_TASK_ID)
    }

    @Test
    fun `a submission may only point at files this public task uploaded for this case`() {
        givenPublicTask()
        givenAStoredAttachment(documentId = BUSINESS_KEY)
        givenAnOpenTask()

        val submission = submissionWith(RESOURCE_ID)
        val response = publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, submission)

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        verify(defaultFormSubmissionService).handleSubmission(
            processLinkId = PROCESS_LINK_ID,
            formData = submission,
            documentDefinitionName = null,
            documentId = BUSINESS_KEY,
            taskInstanceId = USER_TASK_ID.toString(),
        )
    }

    @Test
    fun `a submission pointing at a file uploaded for another case is refused`() {
        givenPublicTask()
        givenAStoredAttachment(documentId = "a-different-case")

        val response =
            publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, submissionWith(RESOURCE_ID))

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        verifyNoInteractions(processLinkActivityService, defaultFormSubmissionService)
    }

    @Test
    fun `a submission pointing at a file that was not uploaded through the public endpoint is refused`() {
        givenPublicTask()
        givenAStoredAttachment(documentId = BUSINESS_KEY, user = "a-logged-in-user")

        val response =
            publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, submissionWith(RESOURCE_ID))

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        verifyNoInteractions(processLinkActivityService, defaultFormSubmissionService)
    }

    @Test
    fun `a submission pointing at a file storage does not know is refused`() {
        givenPublicTask()
        whenever(temporaryResourceStorageService.getResourceMetadata(RESOURCE_ID))
            .thenThrow(IllegalArgumentException("No resource found with id '$RESOURCE_ID'"))

        val response =
            publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, submissionWith(RESOURCE_ID))

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        verifyNoInteractions(processLinkActivityService, defaultFormSubmissionService)
    }

    @Test
    fun `a file reference nested in a submission is checked too`() {
        givenPublicTask()
        givenAStoredAttachment(documentId = "a-different-case")

        val submission =
            JsonNodeFactory.instance.objectNode().apply {
                putObject("panel")
                    .putArray("bijlagen")
                    .addObject()
                    .put("id", RESOURCE_ID)
                    .put("storage", PublicTaskAttachment.STORAGE_PROVIDER_NAME)
            }

        val response = publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, submission)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
    }

    @Test
    fun `a submission without any file reference is passed on untouched`() {
        givenPublicTask()
        givenAnOpenTask()

        val response = publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, SUBMISSION)

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `a submission that parks another case's file under 'id' is refused`() {
        givenPublicTask()
        givenAStoredAttachment(documentId = "a-different-case")

        // Not marked as uploaded through the public page, but UploadField acts on '/id' all the same.
        val submission =
            JsonNodeFactory.instance.objectNode().apply {
                putArray("bijlagen").addObject().put("id", RESOURCE_ID)
            }

        val response = publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, submission)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        verifyNoInteractions(processLinkActivityService, defaultFormSubmissionService)
    }

    @Test
    fun `a submission that hides another case's file behind an acceptable resource id is refused`() {
        givenPublicTask()
        givenAStoredAttachment(resourceId = OTHER_RESOURCE_ID, documentId = "a-different-case")

        // Valtimo 12's UploadField acts on both, so the check must not stop at the acceptable 'data.resourceId'.
        val submission =
            JsonNodeFactory.instance.objectNode().apply {
                putArray("bijlagen")
                    .addObject()
                    .put("id", OTHER_RESOURCE_ID)
                    .putObject("data")
                    .put("resourceId", UUID.randomUUID().toString())
            }

        val response = publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, submission)

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        verifyNoInteractions(processLinkActivityService, defaultFormSubmissionService)
    }

    @Test
    fun `a value under 'id' that is no file at all is passed on untouched`() {
        givenPublicTask()
        givenAnOpenTask()
        whenever(temporaryResourceStorageService.getResourceMetadata("gemeente-1234"))
            .thenThrow(IllegalArgumentException("No resource found with id 'gemeente-1234'"))

        // 'id' is a key any component may carry: a select storing the whole record it was given, here.
        val submission =
            JsonNodeFactory.instance.objectNode().apply {
                putObject("gemeente").put("id", "gemeente-1234").put("naam", "Den Haag")
            }

        val response = publicTaskService.completeUserTaskWithPublicTaskSubmission(PUBLIC_TASK_ID, submission)

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
    }

    @Test
    fun `an existing Valtimo resource in a prefilled form is accepted on its UUID form alone`() {
        givenPublicTask()
        givenAnOpenTask()

        // A resource id in UUID form is an existing Valtimo resource, which is how a prefilled field arrives.
        val response =
            publicTaskService.completeUserTaskWithPublicTaskSubmission(
                PUBLIC_TASK_ID,
                submissionWithStoredResource(UUID.randomUUID().toString()),
            )

        assertThat(response.statusCode).isEqualTo(HttpStatus.OK)
        verifyNoInteractions(temporaryResourceStorageService)
    }

    @Test
    fun `a stored resource id that is not a UUID is refused before UploadField fails on it`() {
        givenPublicTask()
        givenAStoredAttachment(documentId = BUSINESS_KEY)

        // Valtimo 12's UploadField parses 'data.resourceId' as a UUID, so this would fail the submission halfway.
        val response =
            publicTaskService.completeUserTaskWithPublicTaskSubmission(
                PUBLIC_TASK_ID,
                submissionWithStoredResource(RESOURCE_ID),
            )

        assertThat(response.statusCode).isEqualTo(HttpStatus.BAD_REQUEST)
        verifyNoInteractions(processLinkActivityService, defaultFormSubmissionService)
    }

    private fun createPublicTaskUrl(configuredBaseUrl: String?) {
        publicTaskService.createAndSendPublicTaskUrl(execution, publicTaskData(), configuredBaseUrl)
    }

    private fun publicTaskData() =
        PublicTaskData(
            publicTaskId = PUBLIC_TASK_ID,
            userTaskId = USER_TASK_ID,
            processBusinessKey = BUSINESS_KEY,
            assigneeCandidateContactData = "citizen@example.org",
            taskExpirationDate = LocalDate.now().plusDays(1).toString(),
            isCompletedByPublicTask = false,
            attachmentLimits = PublicTaskAttachmentLimits.of(null, null, null),
            documentMetadata = PublicTaskDocumentMetadata.of(null),
        )

    /** The link as the process receives it. */
    private fun createdUrl(): String {
        val captor = argumentCaptor<String>()
        verify(execution).setVariable(eq("url"), captor.capture())
        return captor.lastValue
    }

    private fun savedPublicTask(): PublicTaskEntity {
        val captor = argumentCaptor<PublicTaskEntity>()
        verify(publicTaskRepository).save(captor.capture())
        return captor.lastValue
    }

    private fun renderedVariables(): Map<String, Any> {
        val captor = argumentCaptor<Map<String, Any>>()
        verify(htmlRenderService).generatePublicTaskHtml(any(), captor.capture())
        return captor.lastValue
    }

    /** A submission holding a file as the public page reports it back, see [PublicTaskAttachment]. */
    private fun submissionWith(resourceId: String) =
        JsonNodeFactory.instance.objectNode().apply {
            putArray("bijlagen")
                .addObject()
                .put("id", resourceId)
                .put("storage", PublicTaskAttachment.STORAGE_PROVIDER_NAME)
        }

    private fun submissionWithStoredResource(resourceId: String) =
        JsonNodeFactory.instance.objectNode().apply {
            putArray("bijlagen").addObject().putObject("data").put("resourceId", resourceId)
        }

    private fun givenAnOpenTask() {
        whenever(processLinkActivityService.openTask(USER_TASK_ID))
            .thenReturn(ProcessLinkActivityResult(PROCESS_LINK_ID, "form", Any()))
        val submissionResult: FormSubmissionResult = mock()
        whenever(submissionResult.errors()).thenReturn(emptyList())
        whenever(
            defaultFormSubmissionService.handleSubmission(any(), any(), anyOrNull(), anyOrNull(), anyOrNull()),
        ).thenReturn(submissionResult)
    }

    private fun givenAStoredAttachment(
        documentId: String,
        user: String = "public-task",
        resourceId: String = RESOURCE_ID,
    ) {
        whenever(temporaryResourceStorageService.getResourceMetadata(resourceId)).thenReturn(
            mapOf(
                MetadataType.USER.key to user,
                MetadataType.DOCUMENT_ID.key to documentId,
                MetadataType.FILE_NAME.key to "bijlage.pdf",
            ),
        )
    }

    private fun givenAFreeAttachmentSlot() {
        whenever(publicTaskRepository.reserveAttachmentSlot(PUBLIC_TASK_ID)).thenReturn(1)
    }

    private fun givenAFormWithUploadField(
        componentKey: String = COMPONENT_KEY,
        fileMaxSize: String? = null,
        filePattern: String? = null,
    ) {
        val component =
            JsonNodeFactory.instance.objectNode().apply {
                put("key", componentKey)
                put("type", "valtimo-file")
                put("input", true)
                fileMaxSize?.let { put("fileMaxSize", it) }
                filePattern?.let { put("filePattern", it) }
            }
        val form = JsonNodeFactory.instance.objectNode().apply { putArray("components").add(component) }
        whenever(processLinkActivityService.openTask(USER_TASK_ID)).thenReturn(
            ProcessLinkActivityResult(
                PROCESS_LINK_ID,
                "form",
                FormTaskOpenResultProperties(formDefinitionId = FORM_DEFINITION_ID, prefilledForm = form),
            ),
        )
    }

    private fun fileNameStoredFor(fileName: String?): String {
        reset(temporaryResourceStorageService, publicTaskRepository)
        givenPublicTask()
        givenAFreeAttachmentSlot()
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn(RESOURCE_ID)

        publicTaskService.storePublicTaskAttachment(PUBLIC_TASK_ID, null, aFile(fileName = fileName))

        return storedMetadata()[MetadataType.FILE_NAME.key] as String
    }

    private fun storedMetadata(): Map<String, Any> {
        val metadata = argumentCaptor<Map<String, Any>>()
        verify(temporaryResourceStorageService).store(any(), metadata.capture())
        return metadata.firstValue
    }

    private fun aFile(
        fileName: String? = "bijlage.pdf",
        content: ByteArray = CONTENT,
    ) = MockMultipartFile("file", fileName, "application/pdf", content)

    private fun givenPublicTask(
        expirationDate: LocalDate? = LocalDate.now().plusDays(1),
        completed: Boolean = false,
        maxAttachmentSizeInBytes: Long = MAX_ATTACHMENT_SIZE,
        acceptedMimeTypes: String = "",
        documentMetadata: Map<String, String> = emptyMap(),
        documentMetadataJson: String = PublicTaskDocumentMetadata.of(documentMetadata).toJson(),
        baseUrl: String = "",
    ) {
        whenever(publicTaskRepository.findById(PUBLIC_TASK_ID)).thenReturn(
            Optional.of(
                PublicTaskEntity(
                    publicTaskId = PUBLIC_TASK_ID,
                    userTaskId = USER_TASK_ID,
                    processBusinessKey = BUSINESS_KEY,
                    assigneeCandidateContactData = "citizen@example.org",
                    taskExpirationDate = expirationDate?.toString() ?: "",
                    isCompletedByPublicTask = completed,
                    maxAttachments = MAX_ATTACHMENTS,
                    maxAttachmentSizeInBytes = maxAttachmentSizeInBytes,
                    acceptedMimeTypes = acceptedMimeTypes,
                    documentMetadataJson = documentMetadataJson,
                    baseUrl = baseUrl,
                ),
            ),
        )
    }

    companion object {
        private val PUBLIC_TASK_ID = UUID.fromString("3f2a1c4e-0b7d-4a19-9c5e-8d6f0a1b2c3d")

        private const val PUBLIC_TASK_PATH = "/api/v1/public-task/3f2a1c4e-0b7d-4a19-9c5e-8d6f0a1b2c3d"

        private val USER_TASK_ID = UUID.fromString("a0d1f5c2-1e3b-4a67-8c9d-0e1f2a3b4c5d")

        private val PROCESS_LINK_ID = UUID.fromString("6f2b1c8e-4d3a-4a1b-9c7e-2f5a8d0b3e6c")

        private val FORM_DEFINITION_ID = UUID.fromString("b3c0d1e2-4f56-4a78-9b0c-1d2e3f4a5b6c")

        private const val BUSINESS_KEY = "3e6b0dd5-3b4b-4bd4-a1ea-b9f0e4e1c7cb"

        private const val RESOURCE_ID = "8402349873245-1234"

        private const val OTHER_RESOURCE_ID = "1298347981234-5678"

        private const val MAX_ATTACHMENT_SIZE = 64L

        private const val MAX_ATTACHMENTS = 3

        private const val COMPONENT_KEY = "bijlagen"

        private val CONTENT = "a small pdf".toByteArray()

        // 'MZ' makes a Windows executable. Under MAX_ATTACHMENT_SIZE, so the type refuses it and not the size.
        private val EXECUTABLE = byteArrayOf(0x4D, 0x5A) + ByteArray(30)

        private val SUBMISSION = JsonNodeFactory.instance.objectNode().put("naam", "Ruben")
    }
}
