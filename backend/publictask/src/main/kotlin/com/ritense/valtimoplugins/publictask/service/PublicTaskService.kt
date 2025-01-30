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

import com.fasterxml.jackson.databind.JsonNode
import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.form.domain.FormTaskOpenResultProperties
import com.ritense.form.service.impl.DefaultFormSubmissionService
import com.ritense.processlink.exception.ProcessLinkNotFoundException
import com.ritense.processlink.service.ProcessLinkActivityService
import com.ritense.valtimoplugins.publictask.domain.PublicTaskData
import com.ritense.valtimoplugins.publictask.domain.PublicTaskEntity
import com.ritense.valtimoplugins.publictask.htmlrenderer.service.HtmlRenderService
import com.ritense.valtimoplugins.publictask.repository.PublicTaskRepository
import java.time.LocalDate
import java.util.UUID
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.delegate.DelegateTask
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class PublicTaskService(
    private val publicTaskRepository: PublicTaskRepository,
    private val runtimeService: RuntimeService,
    private val processLinkActivityService: ProcessLinkActivityService,
    private val htmlRenderService: HtmlRenderService,
    private val defaultFormSubmissionService: DefaultFormSubmissionService,
    private val baseUrl: String
) {

    fun startNotifyAssigneeCandidateProcess(task: DelegateTask) {
        runtimeService.createMessageCorrelation(NOTIFY_ASSIGNEE_PROCESS_MESSAGE_NAME)
            .processInstanceId(task.processInstanceId)
            .setVariables(mapOf("userTaskId" to task.id))
            .processInstanceBusinessKey(task.execution.processBusinessKey)
            .correlateAll()
    }

    fun createAndSendPublicTaskUrl(
        execution: DelegateExecution,
        publicTaskData: PublicTaskData
    ) {
        val publicTaskUrl = "$baseUrl/$PUBLIC_TASK_URL?publicTaskId=${publicTaskData.publicTaskId}"

        execution.setVariable("assigneeCandidateContactData", publicTaskData.assigneeCandidateContactData)
        execution.setVariable("url", publicTaskUrl)

        savePublicTaskEntity(publicTaskData)
    }

    fun createPublicTaskHtml(publicTaskId: String): ResponseEntity<String> {
        val formHtml = try {
            val userTaskId = publicTaskRepository.getReferenceById(UUID.fromString(publicTaskId)).userTaskId
            val camundaTaskData = runWithoutAuthorization {
                processLinkActivityService.openTask(userTaskId).properties as FormTaskOpenResultProperties
            }
            htmlRenderService.generatePublicTaskHtml(
                fileName = PUBLIC_TASK_FILE_NAME,
                variables = mapOf(
                    "form_io_form" to camundaTaskData.prefilledForm.toPrettyString(),
                    "public_task_url" to "$baseUrl$PUBLIC_TASK_URL?publicTaskId=$publicTaskId"
                )
            )
        } catch (e: Exception) {
            return taskNotAvailableResponse(e)
        }

        return ResponseEntity(formHtml, HttpStatus.OK)
    }

    fun completeUserTaskWithPublicTaskSubmission(
        publicTaskId: String,
        submission: JsonNode
    ): ResponseEntity<String> {

        val publicTaskEntity = publicTaskRepository.getReferenceById(UUID.fromString(publicTaskId))

        if (LocalDate.parse(publicTaskEntity.taskExpirationDate)
                .isBefore(LocalDate.now())
        ) return TASK_NOT_AVAILABLE_ERROR

        val camundaTask = try {
            runWithoutAuthorization {
                processLinkActivityService.openTask(publicTaskEntity.userTaskId)
            }
        } catch (e: Exception) {
            return taskNotAvailableResponse(e)
        }

        publicTaskRepository.save(publicTaskEntity.copy(isCompletedByPublicTask = true))

        val formSubmissionResult = runWithoutAuthorization {
            defaultFormSubmissionService.handleSubmission(
                processLinkId = camundaTask.processLinkId,
                formData = submission,
                documentId = publicTaskEntity.processBusinessKey,
                documentDefinitionName = null,
                taskInstanceId = publicTaskEntity.userTaskId.toString(),
            )
        }

        if (formSubmissionResult.errors().isNotEmpty()) {
            publicTaskRepository.save(publicTaskEntity.copy(isCompletedByPublicTask = false))
            return SERVER_SIDE_ERROR
        }

        return ResponseEntity("Your response has been submitted", HttpStatus.OK)
    }

    private fun savePublicTaskEntity(publicTaskData: PublicTaskData) {
        publicTaskRepository.save(
            PublicTaskEntity(
                publicTaskId = publicTaskData.publicTaskId,
                userTaskId = publicTaskData.userTaskId,
                processBusinessKey = publicTaskData.processBusinessKey,
                assigneeCandidateContactData = publicTaskData.assigneeCandidateContactData,
                taskExpirationDate = publicTaskData.taskExpirationDate,
                isCompletedByPublicTask = publicTaskData.isCompletedByPublicTask
            )
        )
    }

    private fun taskNotAvailableResponse(e: Exception): ResponseEntity<String> = when (e) {
        is ProcessLinkNotFoundException, is NullPointerException -> TASK_NOT_AVAILABLE_ERROR
        else -> SERVER_SIDE_ERROR
    }

    companion object {
        val logger = KotlinLogging.logger {}

        private const val PUBLIC_TASK_URL = "/api/v1/public-task"

        private const val NOTIFY_ASSIGNEE_PROCESS_MESSAGE_NAME = "startNotifyAssigneeMessage"

        private const val PUBLIC_TASK_FILE_NAME = "public_task_html"

        private val SERVER_SIDE_ERROR = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body("Something went wrong, try again (later) or contact your administrator")

        private val TASK_NOT_AVAILABLE_ERROR = ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body("This task does not exist (anymore) or is already completed.")
    }
}
