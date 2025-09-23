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

package com.ritense.valtimoplugins.valuemapper.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperCommand
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperDefinition
import com.ritense.valtimoplugins.valuemapper.domain.ValueMapperTemplate
import com.ritense.valtimoplugins.valuemapper.repository.ValueMapperTemplateRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class ValueMapperTemplateService(
    private val templateRepository: ValueMapperTemplateRepository,
    private val objectMapper: ObjectMapper
) {

    fun getTemplatesKeys(): Set<String> {
        return templateRepository.getAll()
    }

    fun getTemplatesKeysPaged(pageable: Pageable): Page<String> {
        return templateRepository.findAllKeysPaged(pageable)
    }

    fun getTemplate(key: String): ValueMapperTemplate {
        return templateRepository.findByKey(key)!!
    }

    fun getDefinition(key: String): ValueMapperDefinition {
        val template = getTemplate(key);
        val commands: List<ValueMapperCommand> = objectMapper.readValue(template.content)

        return ValueMapperDefinition(template.key, commands)
    }

    fun saveUpdate(template: ValueMapperTemplate): ValueMapperTemplate {
        return templateRepository.save(template)
    }

    fun saveUpdate(key: String, content: String): ValueMapperTemplate {
        val existingTemplate = templateRepository.findByKey(key);

        if (existingTemplate == null) {
            val newTemplate = ValueMapperTemplate(UUID.randomUUID(), key, content)
            return templateRepository.save(newTemplate)
        }

        existingTemplate.content = content
        return templateRepository.save(existingTemplate)
    }

    fun removeTemplate(key: String) {
        templateRepository.deleteByKey(key)
    }
}
