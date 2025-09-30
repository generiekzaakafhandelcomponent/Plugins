/*
 *  Copyright 2015-2025 Ritense BV, the Netherlands.
 *
 *  Licensed under EUPL, Version 1.2 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package com.ritense.valtimoplugins.valuemapper.web


import com.ritense.valtimo.web.rest.error.BadRequestAlertException
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperTemplate
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperLoadingService
import com.ritense.valtimoplugins.valuemapper.service.ValueMapperTemplateService
import jakarta.ws.rs.core.MediaType.APPLICATION_JSON
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
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/management", produces = [APPLICATION_JSON])
class ValueMapperResource(
    private val loadingService: ValueMapperLoadingService,
    private val valueMapperTemplateService: ValueMapperTemplateService
) {

    @GetMapping("/v1/value-mapper/definitions")
    fun getMappingDefinitions(): Set<String> {
        return valueMapperTemplateService.getTemplatesKeys()
    }

    @GetMapping("/v1/value-mapper/definitionsPage")
    fun getMappingDefinitionsPage(pageable: Pageable,
    ): ResponseEntity<Page<TemplateListItemResponse>> {
        val templates = valueMapperTemplateService.getTemplatesKeysPaged(pageable)
        return ResponseEntity.ok(templates.map { TemplateListItemResponse( it, isReadOnly(it)) })
    }

    @GetMapping("/v1/value-mapper/definitions/{key}")
    fun getMappingDefinition(
        @PathVariable key: String,
    ): ResponseEntity<ValueMapperTemplateDTO> {
        val template = valueMapperTemplateService.getTemplate(key)
        return ResponseEntity.ok(ValueMapperTemplateDTO.of(template, isReadOnly(key)))
    }

    @PostMapping("/v1/value-mapper/definitions")
    fun createTemplate(
        @RequestBody template: CreateValueMapperDTO,
    ): ResponseEntity<ValueMapperTemplateDTO> {
        if (valueMapperTemplateService.getTemplatesKeys().contains(template.key)) {
            throw BadRequestAlertException("The key ${template.key} already exists", ValueMapperTemplate::class.simpleName, "keyExists")
        }

        val template = valueMapperTemplateService.saveUpdate(
            template.key,
            ""
        )

        return ResponseEntity.ok(ValueMapperTemplateDTO.of(template, isReadOnly(template.key)))
    }

    @PutMapping("/v1/value-mapper/definitions/{key}")
    fun updateTemplate(
        @PathVariable key: String,
        @RequestBody template: ValueMapperTemplateDTO,
    ): ResponseEntity<ValueMapperTemplateDTO> {
        if (template.key.isBlank() || key != template.key) {
            throw BadRequestAlertException("The template key ${template.key} is not equal to the path variabele", ValueMapperTemplate::class.simpleName, "keyNOtEqual")
        }

        val template = valueMapperTemplateService.saveUpdate(
            template.key,
            template.content
        )
        return ResponseEntity.ok(ValueMapperTemplateDTO.of(template, isReadOnly(key)))
    }

    @DeleteMapping("/v1/value-mapper/definitions")
    fun deleteTemplates(
        @RequestBody request: DeleteTemplateRequest
    ): ResponseEntity<Unit> {
        valueMapperTemplateService.removeTemplate(request.templates)
        return ResponseEntity.ok().build()
    }

    private fun isReadOnly(key: String) = loadingService.resourceExists(key)

}
