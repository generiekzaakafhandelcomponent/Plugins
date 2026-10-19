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

package com.ritense.valtimoplugins.publictask.service

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.databind.JsonNode
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.form.domain.FormTaskOpenResultProperties
import com.ritense.form.service.impl.DefaultFormSubmissionService
import com.ritense.processlink.exception.ProcessLinkNotFoundException
import com.ritense.processlink.service.ProcessLinkActivityService
import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.contract.upload.MimeTypeDeniedException
import com.ritense.valtimoplugins.publictask.domain.PublicTaskAttachment
import com.ritense.valtimoplugins.publictask.domain.PublicTaskAttachmentLimits
import com.ritense.valtimoplugins.publictask.domain.PublicTaskBaseUrl
import com.ritense.valtimoplugins.publictask.domain.PublicTaskData
import com.ritense.valtimoplugins.publictask.domain.PublicTaskEntity
import com.ritense.valtimoplugins.publictask.htmlrenderer.service.HtmlRenderService
import com.ritense.valtimoplugins.publictask.repository.PublicTaskRepository
import io.github.oshai.kotlinlogging.KotlinLogging
import org.apache.tika.Tika
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.delegate.DelegateTask
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.util.UriComponentsBuilder
import java.time.LocalDate
import java.time.format.DateTimeParseException
import java.util.UUID

class PublicTaskService(
    private val publicTaskRepository: PublicTaskRepository,
    private val runtimeService: RuntimeService,
    private val processLinkActivityService: ProcessLinkActivityService,
    private val htmlRenderService: HtmlRenderService,
    private val defaultFormSubmissionService: DefaultFormSubmissionService,
    private val temporaryResourceStorageService: TemporaryResourceStorageService,
    private val fallbackBaseUrl: String?,
    // 'spring.servlet.multipart.max-file-size': the ceiling on every size limit here. Positive, or absent.
    private val applicationMaxFileSizeInBytes: Long?,
) {
    // Built once: constructing a Tika scans the classpath for every parser and detector it can find.
    private val tika = Tika()

    fun startNotifyAssigneeCandidateProcess(task: DelegateTask) {
        runtimeService
            .createMessageCorrelation(NOTIFY_ASSIGNEE_PROCESS_MESSAGE_NAME)
            .processInstanceId(task.processInstanceId)
            .setVariables(mapOf("userTaskId" to task.id))
            .processInstanceBusinessKey(task.execution.processBusinessKey)
            .correlateAll()
    }

    /** [configuredBaseUrl] is what the plugin configuration holds; empty means the application setting. */
    fun createAndSendPublicTaskUrl(
        execution: DelegateExecution,
        publicTaskData: PublicTaskData,
        configuredBaseUrl: String? = null,
    ) {
        val baseUrl = baseUrlFor(configuredBaseUrl)
        val publicTaskUrl = publicTaskUrl(baseUrl, publicTaskData.publicTaskId)

        execution.setVariable("assigneeCandidateContactData", publicTaskData.assigneeCandidateContactData)
        execution.setVariable("url", publicTaskUrl)

        savePublicTaskEntity(publicTaskData, baseUrl)
    }

    /** The address this link starts with; raised here rather than kept from starting up. */
    private fun baseUrlFor(configuredBaseUrl: String?): String =
        PublicTaskBaseUrl.of(configuredBaseUrl)
            ?: fallbackBaseUrl
            ?: error(
                "The public task URL has no address to start with. Fill in the URL of this environment in the " +
                    "Public Task plugin configuration, or set 'valtimo.url' or 'valtimo.app.hostname'.",
            )

    fun createPublicTaskHtml(publicTaskId: UUID): ResponseEntity<String> {
        val publicTaskEntity = findAvailablePublicTask(publicTaskId) ?: return TASK_NOT_AVAILABLE_ERROR

        val formHtml =
            try {
                val userTaskId = publicTaskEntity.userTaskId
                val camundaTaskData =
                    runWithoutAuthorization {
                        processLinkActivityService.openTask(userTaskId).properties as FormTaskOpenResultProperties
                    }
                val form = PublicTaskFormRewriter.rewriteUploadComponents(camundaTaskData.prefilledForm)
                // The address the link was built with; empty leaves the page calling back to its own path.
                val baseUrl = publicTaskEntity.baseUrl.ifBlank { fallbackBaseUrl.orEmpty() }
                htmlRenderService.generatePublicTaskHtml(
                    fileName = PUBLIC_TASK_FILE_NAME,
                    variables =
                        mapOf(
                            "form_io_form" to form.toPrettyString(),
                            "public_task_url" to publicTaskUrl(baseUrl, publicTaskId),
                            "public_task_attachment_url" to
                                publicTaskUrl(baseUrl, publicTaskId, ATTACHMENT_PATH_SEGMENT),
                            "max_attachment_size_in_bytes" to maxAttachmentSizeFor(publicTaskEntity.attachmentLimits()),
                        ),
                )
            } catch (e: Exception) {
                return taskNotAvailableResponse(e)
            }

        return ResponseEntity(formHtml, HttpStatus.OK)
    }

    /** Stores an attachment and returns the value it takes in the submission. [componentKey] is optional. */
    fun storePublicTaskAttachment(
        publicTaskId: UUID,
        componentKey: String?,
        file: MultipartFile,
    ): ResponseEntity<out Any> {
        val publicTaskEntity = findAvailablePublicTask(publicTaskId) ?: return TASK_NOT_AVAILABLE_ERROR

        if (file.isEmpty) {
            return ResponseEntity.badRequest().body("The uploaded file is empty")
        }
        val limits = publicTaskEntity.attachmentLimits()
        // Checked before the limit of the field, which has to resolve the form first.
        val maxSizeForTask = maxAttachmentSizeFor(limits)
        if (file.size > maxSizeForTask) {
            return tooLargeResponse(maxSizeForTask)
        }

        val fileName = sanitizedFileName(file.originalFilename)
        // Detected once, and only where a limit or a refusal asks for it.
        val mimeType = lazy { detectedMimeType(file, fileName) }

        return withAttachmentSlot(publicTaskId, limits.maxAttachments) {
            val refusal =
                try {
                    attachmentRefusal(
                        publicTaskEntity = publicTaskEntity,
                        componentKey = componentKey,
                        fileName = fileName,
                        fileSize = file.size,
                        limits = limits,
                        maxSizeForTask = maxSizeForTask,
                        mimeType = mimeType,
                    )
                } catch (e: Exception) {
                    logger.warn(e) {
                        "Could not establish what user task ${publicTaskEntity.userTaskId} accepts, so an " +
                            "attachment for it was refused"
                    }
                    return@withAttachmentSlot taskNotAvailableResponse(e)
                }
            if (refusal != null) {
                return@withAttachmentSlot refusal
            }

            val resourceId =
                try {
                    temporaryResourceStorageService.store(
                        inputStream = file.inputStream,
                        metadata =
                            buildMap {
                                // From the process link. Put first, so the keys below win.
                                putAll(publicTaskEntity.documentMetadata().fields)
                                put(MetadataType.FILE_NAME.key, fileName)
                                file.contentType?.let { put(MetadataType.CONTENT_TYPE.key, it) }
                                // There is no logged in user, so the origin is recorded instead.
                                put(MetadataType.USER.key, PUBLIC_TASK_UPLOAD_USER)
                                put(MetadataType.DOCUMENT_ID.key, publicTaskEntity.processBusinessKey)
                            },
                    )
                } catch (e: Exception) {
                    return@withAttachmentSlot attachmentRefusedResponse(e, mimeType, publicTaskEntity.userTaskId)
                }

            logger.debug { "Stored an attachment for user task ${publicTaskEntity.userTaskId}" }

            ResponseEntity.ok(
                PublicTaskAttachment(
                    id = resourceId,
                    originalName = fileName,
                    name = fileName,
                    size = file.size,
                    type = file.contentType ?: "",
                ),
            )
        }
    }

    /** Claims a slot up front so simultaneous uploads cannot pass the limit; releases it on any non-2xx. */
    private fun withAttachmentSlot(
        publicTaskId: UUID,
        maxAttachments: Int,
        body: () -> ResponseEntity<out Any>,
    ): ResponseEntity<out Any> {
        if (publicTaskRepository.reserveAttachmentSlot(publicTaskId) == 0) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body("No more than $maxAttachments files can be added to this task")
        }
        return body().also {
            if (!it.statusCode.is2xxSuccessful) {
                publicTaskRepository.releaseAttachmentSlot(publicTaskId)
            }
        }
    }

    /** The response for a file the task or its upload field does not accept, or `null` when it does. */
    private fun attachmentRefusal(
        publicTaskEntity: PublicTaskEntity,
        componentKey: String?,
        fileName: String,
        fileSize: Long,
        limits: PublicTaskAttachmentLimits,
        maxSizeForTask: Long,
        mimeType: Lazy<String>,
    ): ResponseEntity<out Any>? {
        val fieldLimits =
            if (componentKey == null) {
                null
            } else {
                uploadFieldLimits(publicTaskEntity, componentKey)
                    ?: return refusedResponse(
                        publicTaskEntity,
                        HttpStatus.BAD_REQUEST,
                        "This file was not chosen in a field of this form",
                        "an attachment for upload field '$componentKey', which this form does not have",
                    )
            }

        val maxSize = minOf(maxSizeForTask, fieldLimits?.maxSizeInBytes ?: Long.MAX_VALUE)
        if (fileSize > maxSize) {
            return tooLargeResponse(maxSize)
        }

        val filePattern = fieldLimits?.filePattern
        if (limits.acceptedMimeTypes.isEmpty() && filePattern == null) {
            // Nothing narrows the type; 'valtimo.upload.accepted-mime-types' still applies in storage.
            return null
        }

        val detected = mimeType.value
        if (!limits.accepts(detected)) {
            return refusedResponse(
                publicTaskEntity,
                HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                unacceptedTypeMessage(detected),
                "an attachment detected as '$detected', which this task does not accept",
            )
        }
        if (filePattern != null && !FormIoFilePattern.matches(filePattern, fileName, detected)) {
            return refusedResponse(
                publicTaskEntity,
                HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                unacceptedTypeMessage(detected),
                "an attachment detected as '$detected' against file pattern '$filePattern'",
            )
        }
        return null
    }

    /** Names the detected type, never what the task accepts: that is configuration and this endpoint is open. */
    private fun unacceptedTypeMessage(mimeType: String): String =
        if (MIME_TYPE.matches(mimeType)) {
            "A file of type $mimeType cannot be uploaded"
        } else {
            UNACCEPTED_TYPE_MESSAGE
        }

    private fun uploadFieldLimits(
        publicTaskEntity: PublicTaskEntity,
        componentKey: String,
    ): PublicTaskUploadFieldLimits? {
        val taskData =
            runWithoutAuthorization {
                processLinkActivityService.openTask(publicTaskEntity.userTaskId).properties
                    as FormTaskOpenResultProperties
            }
        return PublicTaskUploadField.limitsOf(taskData.prefilledForm, componentKey)
    }

    /** The type the content is, not the type the request claims. [fileName] is only a fallback hint. */
    private fun detectedMimeType(
        file: MultipartFile,
        fileName: String,
    ): String =
        file.inputStream
            .use { tika.detect(it, fileName) }
            .substringBefore(';')
            .trim()
            .lowercase()

    private fun maxAttachmentSizeFor(limits: PublicTaskAttachmentLimits): Long =
        minOf(limits.maxSizeInBytes, applicationMaxFileSizeInBytes ?: Long.MAX_VALUE)

    private fun tooLargeResponse(maxSizeInBytes: Long): ResponseEntity<out Any> =
        ResponseEntity
            .status(HttpStatus.PAYLOAD_TOO_LARGE)
            .body("This file is larger than the maximum of $maxSizeInBytes bytes")

    /** [message] is for the applicant, [reason] only for the log: it describes configuration. */
    private fun refusedResponse(
        publicTaskEntity: PublicTaskEntity,
        status: HttpStatus,
        message: String,
        reason: String,
    ): ResponseEntity<out Any> {
        logger.info { "Refused $reason for user task ${publicTaskEntity.userTaskId}" }
        return ResponseEntity.status(status).body(message)
    }

    fun completeUserTaskWithPublicTaskSubmission(
        publicTaskId: UUID,
        submission: JsonNode,
    ): ResponseEntity<String> {
        val publicTaskEntity = findAvailablePublicTask(publicTaskId) ?: return TASK_NOT_AVAILABLE_ERROR

        if (!attachmentsWereUploadedForThisTask(submission, publicTaskEntity)) {
            return ATTACHMENT_NOT_AVAILABLE_ERROR
        }

        val camundaTask =
            try {
                runWithoutAuthorization {
                    processLinkActivityService.openTask(publicTaskEntity.userTaskId)
                }
            } catch (e: Exception) {
                return taskNotAvailableResponse(e)
            }

        // Marked before submitting: PublicTaskCompletedListener reads this flag while the task completes,
        // which happens inside handleSubmission. Cleared again when the submission does not go through.
        publicTaskRepository.save(publicTaskEntity.copy(isCompletedByPublicTask = true))

        val formSubmissionResult =
            try {
                runWithoutAuthorization {
                    defaultFormSubmissionService.handleSubmission(
                        processLinkId = camundaTask.processLinkId,
                        formData = submission,
                        documentId = publicTaskEntity.processBusinessKey,
                        documentDefinitionName = null,
                        taskInstanceId = publicTaskEntity.userTaskId.toString(),
                    )
                }
            } catch (e: Exception) {
                publicTaskRepository.save(publicTaskEntity.copy(isCompletedByPublicTask = false))
                throw e
            }

        if (formSubmissionResult.errors().isNotEmpty()) {
            publicTaskRepository.save(publicTaskEntity.copy(isCompletedByPublicTask = false))
            return SERVER_SIDE_ERROR
        }

        return ResponseEntity("Your response has been submitted", HttpStatus.OK)
    }

    /**
     * Whether every file the submission points at may be used by this task. Valtimo 12's UploadField reads a
     * temporary resource from `/id` and a stored resource from `/data/resourceId`, which it parses as a UUID.
     */
    private fun attachmentsWereUploadedForThisTask(
        submission: JsonNode,
        publicTaskEntity: PublicTaskEntity,
    ): Boolean {
        val references = submittedFileReferences(submission)
        return references.storedResourceIds.all { isExistingValtimoResourceId(it) } &&
            references.uploadedHere.all { isUsableAttachmentOfThisCase(it, publicTaskEntity) } &&
            references.temporaryResourceIds.none { isThisCasesAttachment(it, publicTaskEntity) == false } &&
            wereShownInThePrefilledForm(references.storedResourceIds, publicTaskEntity)
    }

    /**
     * An existing Valtimo resource may only come back when the public page was given it: a prefilled field
     * holds the case's files under its `defaultValue`. Any other resource would let the link holder attach a
     * file of another case to this one.
     */
    private fun wereShownInThePrefilledForm(
        storedResourceIds: Set<String>,
        publicTaskEntity: PublicTaskEntity,
    ): Boolean {
        if (storedResourceIds.isEmpty()) {
            return true
        }
        val prefilledResourceIds =
            try {
                val taskData =
                    runWithoutAuthorization {
                        processLinkActivityService.openTask(publicTaskEntity.userTaskId).properties
                            as FormTaskOpenResultProperties
                    }
                storedResourceIdsIn(taskData.prefilledForm)
            } catch (e: Exception) {
                logger.info(e) { "Refused a submission for user task ${publicTaskEntity.userTaskId}: form not available" }
                return false
            }
        val allShown = prefilledResourceIds.containsAll(storedResourceIds)
        if (!allShown) {
            logger.info {
                "Refused a submission for user task ${publicTaskEntity.userTaskId}: " +
                    "a stored file reference that was not in the prefilled form"
            }
        }
        return allShown
    }

    private fun storedResourceIdsIn(form: JsonNode): Set<String> {
        val resourceIds = mutableSetOf<String>()

        fun collectFrom(node: JsonNode) {
            if (node.isObject) {
                node.at(RESOURCE_ID_POINTER).takeIf { it.isTextual }?.let { resourceIds.add(it.textValue()) }
            }
            node.forEach { collectFrom(it) }
        }
        collectFrom(form)
        return resourceIds
    }

    /** The ids UploadField acts on, kept apart because they are held to different standards. */
    private fun submittedFileReferences(submission: JsonNode): SubmittedFileReferences {
        // Sets: the same file chosen in two fields is one id to check, not two.
        val storedResourceIds = mutableSetOf<String>()
        val temporaryResourceIds = mutableSetOf<String>()
        val uploadedHere = mutableSetOf<String>()

        fun collectFrom(node: JsonNode) {
            if (node.isObject) {
                node.at(RESOURCE_ID_POINTER).takeIf { it.isTextual }?.let { storedResourceIds.add(it.textValue()) }
                node.at(ID_POINTER).takeIf { it.isTextual }?.let { id ->
                    temporaryResourceIds.add(id.textValue())
                    if (node.path(STORAGE_FIELD).textValue() == PublicTaskAttachment.STORAGE_PROVIDER_NAME) {
                        uploadedHere.add(id.textValue())
                    }
                }
            }
            node.forEach { collectFrom(it) }
        }
        collectFrom(submission)

        return SubmittedFileReferences(
            storedResourceIds = storedResourceIds,
            temporaryResourceIds = temporaryResourceIds,
            uploadedHere = uploadedHere,
        )
    }

    /** UploadField parses `/data/resourceId` as a UUID and fails the whole submission on anything else. */
    private fun isExistingValtimoResourceId(resourceId: String): Boolean {
        val isUuid = runCatching { UUID.fromString(resourceId) }.isSuccess
        if (!isUuid) {
            logger.info { "Refused a submission: a stored file reference that is not a UUID" }
        }
        return isUuid
    }

    /** `true` when this case uploaded the file, `false` when someone else did, `null` when storage has none. */
    private fun isThisCasesAttachment(
        resourceId: String,
        publicTaskEntity: PublicTaskEntity,
    ): Boolean? =
        try {
            val metadata = temporaryResourceStorageService.getResourceMetadata(resourceId)
            metadata[MetadataType.USER.key] == PUBLIC_TASK_UPLOAD_USER &&
                metadata[MetadataType.DOCUMENT_ID.key] == publicTaskEntity.processBusinessKey
        } catch (e: Exception) {
            null
        }

    /** Whether this case uploaded the file. A reference storage does not know is refused too. */
    private fun isUsableAttachmentOfThisCase(
        resourceId: String,
        publicTaskEntity: PublicTaskEntity,
    ): Boolean {
        val isThisCases = isThisCasesAttachment(resourceId, publicTaskEntity)
        if (isThisCases == null) {
            logger.info { "Refused a submission for user task ${publicTaskEntity.userTaskId}: unusable file reference" }
        }
        return isThisCases == true
    }

    /**
     * [temporaryResourceIds] is every `/id`, which any component may store a value under; [uploadedHere] the
     * ones carried by a file uploaded through the public page, which have to be this case's own.
     */
    private data class SubmittedFileReferences(
        val storedResourceIds: Set<String>,
        val temporaryResourceIds: Set<String>,
        val uploadedHere: Set<String>,
    )

    /** The public task only while it is available: not completed, and not past its expiration date. */
    private fun findAvailablePublicTask(publicTaskId: UUID): PublicTaskEntity? =
        publicTaskRepository
            .findById(publicTaskId)
            .orElse(null)
            ?.takeIf { it.isAvailable() }

    private fun PublicTaskEntity.isAvailable(): Boolean {
        if (isCompletedByPublicTask) {
            return false
        }
        val expirationDate =
            try {
                LocalDate.parse(taskExpirationDate)
            } catch (e: DateTimeParseException) {
                logger.warn(e) { "Public task has an unusable expiration date and is treated as expired" }
                return false
            }
        return !expirationDate.isBefore(LocalDate.now())
    }

    private fun publicTaskUrl(
        baseUrl: String,
        publicTaskId: UUID,
        vararg pathSegments: String,
    ): String =
        UriComponentsBuilder
            .fromUriString(baseUrl.removeSuffix("/"))
            .path(PUBLIC_TASK_URL)
            .pathSegment(publicTaskId.toString(), *pathSegments)
            .build()
            .toUriString()

    /** The name arrives from an anonymous browser and ends up in case metadata, so it is stripped. */
    private fun sanitizedFileName(originalFilename: String?): String {
        val name =
            originalFilename
                ?.substringAfterLast('/')
                ?.substringAfterLast('\\')
                ?.filterNot { it.isInvisible() }
                ?.trim()
                ?.take(MAX_FILE_NAME_LENGTH)
                .orEmpty()
        return name.ifBlank { FALLBACK_FILE_NAME }
    }

    // Format category too: U+202E alone makes 'factuur\u202Efdp.exe' read as 'factuurexe.pdf'.
    private fun Char.isInvisible(): Boolean = isISOControl() || category == CharCategory.FORMAT

    private fun attachmentRefusedResponse(
        e: Exception,
        mimeType: Lazy<String>,
        userTaskId: UUID,
    ): ResponseEntity<out Any> =
        when (e) {
            is MimeTypeDeniedException -> {
                logger.info { "Refused an attachment of an unaccepted type for user task $userTaskId" }
                ResponseEntity
                    .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    // Refused by 'valtimo.upload.accepted-mime-types' rather than here; named all the same.
                    .body(unacceptedTypeMessage(mimeType.value))
            }

            else -> {
                logger.error(e) { "Could not store an attachment for user task $userTaskId" }
                SERVER_SIDE_ERROR
            }
        }

    private fun savePublicTaskEntity(
        publicTaskData: PublicTaskData,
        baseUrl: String,
    ) {
        val limits = publicTaskData.attachmentLimits
        warnWhenTheContainerAllowsLess(limits.maxSizeInBytes)
        publicTaskRepository
            .save(
                PublicTaskEntity(
                    publicTaskId = publicTaskData.publicTaskId,
                    userTaskId = publicTaskData.userTaskId,
                    processBusinessKey = publicTaskData.processBusinessKey,
                    assigneeCandidateContactData = publicTaskData.assigneeCandidateContactData,
                    taskExpirationDate = publicTaskData.taskExpirationDate,
                    isCompletedByPublicTask = publicTaskData.isCompletedByPublicTask,
                    maxAttachments = limits.maxAttachments,
                    maxAttachmentSizeInBytes = limits.maxSizeInBytes,
                    acceptedMimeTypes = limits.acceptedMimeTypes.joinToString(","),
                    documentMetadataJson = publicTaskData.documentMetadata.toJson(),
                    baseUrl = baseUrl,
                ),
            ).also {
                // Not the public task id: it grants access to the form, so it stays out of logs.
                logger.debug { "Saved public task entity for user task ${it.userTaskId}" }
            }
    }

    private fun warnWhenTheContainerAllowsLess(requestedMaxSizeInBytes: Long) {
        val containerLimit = applicationMaxFileSizeInBytes ?: return
        if (containerLimit >= requestedMaxSizeInBytes) {
            return
        }
        logger.warn {
            "Attachments of this public task are capped at $containerLimit bytes instead of the " +
                "$requestedMaxSizeInBytes its process link asks for, because " +
                "'spring.servlet.multipart.max-file-size' does not allow more. Raise it (and " +
                "'spring.servlet.multipart.max-request-size' with it) to accept larger attachments."
        }
    }

    private fun taskNotAvailableResponse(e: Exception): ResponseEntity<String> =
        when (e) {
            is ProcessLinkNotFoundException, is NullPointerException -> TASK_NOT_AVAILABLE_ERROR
            else -> SERVER_SIDE_ERROR
        }

    companion object {
        val logger = KotlinLogging.logger {}

        private const val PUBLIC_TASK_URL = "/api/v1/public-task"

        const val ATTACHMENT_PATH_SEGMENT = "attachment"

        private const val NOTIFY_ASSIGNEE_PROCESS_MESSAGE_NAME = "startNotifyAssigneeMessage"

        private const val PUBLIC_TASK_FILE_NAME = "public_task_html"

        private const val PUBLIC_TASK_UPLOAD_USER = "public-task"

        private const val FALLBACK_FILE_NAME = "attachment"

        private const val MAX_FILE_NAME_LENGTH = 200

        // Used when the type could not be established, or is not one that can be shown as it is.
        private const val UNACCEPTED_TYPE_MESSAGE = "This type of file cannot be uploaded"

        private val MIME_TYPE = Regex("[a-z0-9][a-z0-9!#$&^_.+-]{0,126}/[a-z0-9][a-z0-9!#$&^_.+-]{0,126}")

        // Both pointers UploadField reads.
        private val ID_POINTER: JsonPointer = JsonPointer.compile("/id")

        private val RESOURCE_ID_POINTER: JsonPointer = JsonPointer.compile("/data/resourceId")

        // Set on the value of every file uploaded through the public page; see PublicTaskAttachment.
        private const val STORAGE_FIELD = "storage"

        private val SERVER_SIDE_ERROR =
            ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Something went wrong, try again (later) or contact your administrator")

        private val TASK_NOT_AVAILABLE_ERROR =
            ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("This task does not exist (anymore) or is already completed.")

        private val ATTACHMENT_NOT_AVAILABLE_ERROR =
            ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("This submission refers to a file that was not uploaded for this task")
    }
}
