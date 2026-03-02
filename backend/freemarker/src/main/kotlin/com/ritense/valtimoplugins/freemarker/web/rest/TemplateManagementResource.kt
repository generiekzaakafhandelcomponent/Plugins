/*
 * Copyright 2015-2023 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.web.rest

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimo.contract.buildingblock.BuildingBlockDefinitionId
import com.ritense.valtimo.contract.case_.CaseDefinitionId
import com.ritense.valtimo.contract.domain.ValtimoMediaType.APPLICATION_JSON_UTF8_VALUE
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import com.ritense.valtimoplugins.freemarker.web.rest.dto.CreateTemplateRequest
import com.ritense.valtimoplugins.freemarker.web.rest.dto.DeleteTemplateRequest
import com.ritense.valtimoplugins.freemarker.web.rest.dto.TemplateListItemResponse
import com.ritense.valtimoplugins.freemarker.web.rest.dto.TemplateResponse
import com.ritense.valtimoplugins.freemarker.web.rest.dto.UpdateTemplateRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@SkipComponentScan
@RequestMapping("/api/management", produces = [APPLICATION_JSON_UTF8_VALUE])
class TemplateManagementResource(
    private val templateService: TemplateService,
) {

    @GetMapping("/v1/template")
    fun getTemplates(
        @RequestParam(value = "templateKey", required = false) templateKey: String?,
        @RequestParam(value = "caseDefinitionKey", required = false) caseDefinitionKey: String?,
        @RequestParam(value = "caseDefinitionVersionTag", required = false) caseDefinitionVersionTag: String?,
        @RequestParam(value = "buildingBlockDefinitionKey", required = false) buildingBlockDefinitionKey: String?,
        @RequestParam(value = "buildingBlockDefinitionVersionTag", required = false) buildingBlockDefinitionVersionTag: String?,
        @RequestParam(value = "templateType", required = false) templateType: String?,
        @RequestParam(value = "templateTypes", required = false) templateTypes: List<String>?,
        pageable: Pageable,
    ): ResponseEntity<Page<TemplateListItemResponse>> {
        val caseDefinitionId = caseDefinitionKey?.let {
            CaseDefinitionId(caseDefinitionKey, caseDefinitionVersionTag!!)
        }
        val buildingBlockDefinitionId = buildingBlockDefinitionKey?.let {
            BuildingBlockDefinitionId(buildingBlockDefinitionKey, buildingBlockDefinitionVersionTag!!)
        }
        val templates = templateService.findTemplates(
            templateKey = templateKey,
            caseDefinitionId = caseDefinitionId,
            buildingBlockDefinitionId = buildingBlockDefinitionId,
            templateType = templateType,
            templateTypes = templateTypes,
            pageable = pageable
        )
        return ResponseEntity.ok(templates.map { TemplateListItemResponse.of(it) })
    }

    @GetMapping("/v1/template-type/{templateType}/template/{key}")
    fun getTemplate(
        @RequestParam(value = "caseDefinitionKey", required = false) caseDefinitionKey: String?,
        @RequestParam(value = "caseDefinitionVersionTag", required = false) caseDefinitionVersionTag: String?,
        @RequestParam(value = "buildingBlockDefinitionKey", required = false) buildingBlockDefinitionKey: String?,
        @RequestParam(value = "buildingBlockDefinitionVersionTag", required = false) buildingBlockDefinitionVersionTag: String?,
        @PathVariable templateType: String,
        @PathVariable key: String,
    ): ResponseEntity<TemplateResponse> {
        val caseDefinitionId = caseDefinitionKey?.let {
            CaseDefinitionId(caseDefinitionKey, caseDefinitionVersionTag!!)
        }
        val buildingBlockDefinitionId = buildingBlockDefinitionKey?.let {
            BuildingBlockDefinitionId(buildingBlockDefinitionKey, buildingBlockDefinitionVersionTag!!)
        }
        require(caseDefinitionId != null || buildingBlockDefinitionId != null) { "Either caseDefinitionKey or buildingBlockDefinitionKey must be provided" }
        val template = templateService.getTemplate(key, caseDefinitionId, buildingBlockDefinitionId, templateType)
        return ResponseEntity.ok(TemplateResponse.of(template))
    }

    @PostMapping("/v1/template")
    fun createTemplate(
        @RequestBody request: CreateTemplateRequest,
    ): ResponseEntity<TemplateResponse> {
        val template = templateService.createTemplate(
            templateKey = request.key,
            caseDefinitionId = request.caseDefinitionId(),
            buildingBlockDefinitionId = request.buildingBlockDefinitionId(),
            templateType = request.type,
            metadata = request.metadata,
        )
        return ResponseEntity.ok(TemplateResponse.of(template))
    }

    @PutMapping("/v1/template")
    fun updateTemplate(
        @RequestBody request: UpdateTemplateRequest,
    ): ResponseEntity<TemplateResponse> {
        val template = templateService.saveTemplate(
            templateKey = request.key,
            caseDefinitionId = request.caseDefinitionId(),
            buildingBlockDefinitionId = request.buildingBlockDefinitionId(),
            templateType = request.type,
            metadata = request.metadata,
            content = request.content
        )
        return ResponseEntity.ok(TemplateResponse.of(template))
    }

    @DeleteMapping("/v1/template")
    fun deleteTemplates(
        @RequestBody request: DeleteTemplateRequest,
    ): ResponseEntity<Unit> {
        templateService.deleteTemplates(request.caseDefinitionId(), request.buildingBlockDefinitionId(), request.templates)
        return ResponseEntity.ok().build()
    }
}
