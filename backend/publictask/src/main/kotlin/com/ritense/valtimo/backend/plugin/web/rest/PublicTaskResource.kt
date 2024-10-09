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

package com.ritense.valtimo.backend.plugin.web.rest

import com.fasterxml.jackson.databind.JsonNode
import com.ritense.valtimo.backend.plugin.service.PublicTaskService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(value = ["/api/v1/public-task"])
class PublicTaskResource(
    private val publicTaskService: PublicTaskService
) {

    @GetMapping
    fun sendPublicTaskHtml(@RequestParam publicTaskId: String): ResponseEntity<String> =
        publicTaskService.createPublicTaskHtml(publicTaskId)

    @PostMapping
    fun completeUserTask(
        @RequestParam publicTaskId: String,
        @RequestBody submission: JsonNode
    ): ResponseEntity<String> = publicTaskService.completeUserTaskWithPublicTaskSubmission(publicTaskId, submission)
}