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

package com.ritense.valtimoplugins.publictask.web.rest

import com.fasterxml.jackson.databind.JsonNode
import com.ritense.valtimoplugins.publictask.service.PublicTaskService
import org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile
import java.util.UUID

@RestController
@RequestMapping(value = ["/api/v1/public-task"])
class PublicTaskResource(
    private val publicTaskService: PublicTaskService,
) {
    @GetMapping("/{publicTaskId}")
    fun sendPublicTaskHtml(
        @PathVariable publicTaskId: UUID,
    ): ResponseEntity<String> = publicTaskService.createPublicTaskHtml(publicTaskId)

    @PostMapping("/{publicTaskId}")
    fun completeUserTask(
        @PathVariable publicTaskId: UUID,
        @RequestBody submission: JsonNode,
    ): ResponseEntity<String> = publicTaskService.completeUserTaskWithPublicTaskSubmission(publicTaskId, submission)

    /** Receives a file chosen in the public form. `componentKey` names the upload field and is optional. */
    @PostMapping("/{publicTaskId}/attachment", consumes = [MULTIPART_FORM_DATA_VALUE])
    fun uploadAttachment(
        @PathVariable publicTaskId: UUID,
        @RequestParam("file") file: MultipartFile,
        @RequestParam(value = "componentKey", required = false) componentKey: String?,
    ): ResponseEntity<out Any> = publicTaskService.storePublicTaskAttachment(publicTaskId, componentKey, file)

    /** Kept so links sent out before the id moved into the path keep working. */
    @Deprecated("Use GET /api/v1/public-task/{publicTaskId}")
    @GetMapping(params = ["publicTaskId"])
    fun sendPublicTaskHtmlForQueryParameter(
        @RequestParam publicTaskId: UUID,
    ): ResponseEntity<String> = publicTaskService.createPublicTaskHtml(publicTaskId)

    @Deprecated("Use POST /api/v1/public-task/{publicTaskId}")
    @PostMapping(params = ["publicTaskId"])
    fun completeUserTaskForQueryParameter(
        @RequestParam publicTaskId: UUID,
        @RequestBody submission: JsonNode,
    ): ResponseEntity<String> = publicTaskService.completeUserTaskWithPublicTaskSubmission(publicTaskId, submission)
}
