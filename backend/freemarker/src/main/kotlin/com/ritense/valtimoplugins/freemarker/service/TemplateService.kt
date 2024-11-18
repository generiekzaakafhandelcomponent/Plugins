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

package com.ritense.valtimoplugins.freemarker.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.document.domain.Document
import com.ritense.valtimoplugins.freemarker.com.ritense.valtimoplugins.freemarker.config.TemplateFreemarkerConfiguration
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_MAIL
import com.ritense.valtimoplugins.freemarker.repository.TemplateRepository
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byCaseDefinitionName
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byKey
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byKeyAndCaseDefinitionNameAndType
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byType
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.query
import com.ritense.processdocument.service.ValueResolverDelegateService
import freemarker.template.Template
import freemarker.template.TemplateException
import java.io.StringWriter
import java.util.Stack
import java.util.UUID
import org.pf4j.Extension
import org.pf4j.ExtensionPoint
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.random.Random

@Extension(ordinal = 1)
@Service
@Transactional
class TemplateService(
    private val templateRepository: TemplateRepository,
    private val objectMapper: ObjectMapper,
    private val valueResolverService: ValueResolverDelegateService,
    private val freemarkerConfiguration: TemplateFreemarkerConfiguration,
) : ExtensionPoint {

    fun generate(
        templateKey: String,
        caseDefinitionName: String,
        templateType: String,
        document: Document
    ) = generate(templateKey, caseDefinitionName, templateType, document, emptyMap())

    fun generate(
        templateKey: String,
        caseDefinitionName: String,
        templateType: String,
        document: Document,
        processVariables: Map<String, Any?>
    ): String {
        val template = getTemplate(templateKey, document.definitionId().name(), TEMPLATE_TYPE_MAIL)
        return generate(template, document, processVariables)
    }

    fun generate(template: ValtimoTemplate, document: Document) = generate(template, document, emptyMap())

    fun generate(
        valtimoTemplate: ValtimoTemplate,
        document: Document,
        processVariables: Map<String, Any?>
    ): String {
        val dataModel = mutableMapOf<String, Any?>(
            "doc" to objectMapper.convertValue<Map<String, Any?>>(document.content().asJson()),
            "pv" to processVariables
        )

        val template = Template(UUID.randomUUID().toString(), valtimoTemplate.content, freemarkerConfiguration)
        var exceptionCaught: Exception? = null

        for (i in 1..10) {
            try {
                val writer = StringWriter()
                template.createProcessingEnvironment(dataModel, writer).process()
                return writer.toString()
            } catch (e: TemplateException) {
                if (!resolveDataModel(document, valtimoTemplate, dataModel)) {
                    throw e
                }
                exceptionCaught = e
            }
        }
        throw exceptionCaught!!
    }

    fun findPlaceholders(
        template: ValtimoTemplate,
        incompleteDataModel: Map<String, Any?> = mutableMapOf()
    ): List<String> {
        // Might not find placeholders that are hidden behind a freemarker-condition
        val completeDataModel = findCompleteDataModelWithDummyData(template, incompleteDataModel)
        return getPlaceholdersFromDataModel(completeDataModel)
    }

    fun findTemplates(
        templateKey: String? = null,
        caseDefinitionName: String? = null,
        templateType: String? = null,
        pageable: Pageable,
    ): Page<ValtimoTemplate> {
        val query = buildSpecification(templateKey, caseDefinitionName, templateType)
        return templateRepository.findAll(query, pageable)
    }

    fun findTemplates(
        templateKey: String? = null,
        caseDefinitionName: String? = null,
        templateType: String? = null,
    ): List<ValtimoTemplate> {
        val query = buildSpecification(templateKey, caseDefinitionName, templateType)
        return templateRepository.findAll(query)
    }

    fun findTemplate(
        templateKey: String,
        caseDefinitionName: String?,
        templateType: String,
    ): ValtimoTemplate? {
        return templateRepository.findOne(
            byKeyAndCaseDefinitionNameAndType(templateKey, caseDefinitionName, templateType)
        ).orElse(null)
    }

    fun getTemplate(
        templateKey: String,
        caseDefinitionName: String?,
        templateType: String,
    ): ValtimoTemplate {
        return findTemplate(templateKey, caseDefinitionName, templateType)
            ?: throw IllegalStateException("No Template found for '$templateType/$caseDefinitionName/$templateKey'")
    }

    fun saveTemplate(
        templateKey: String,
        caseDefinitionName: String?,
        templateType: String,
        metadata: Map<String, Any?>,
        content: String,
    ): ValtimoTemplate {
        val existingTemplate = findTemplate(templateKey, caseDefinitionName, templateType)
        return templateRepository.save(
            ValtimoTemplate(
                id = existingTemplate?.id ?: UUID.randomUUID(),
                key = templateKey,
                caseDefinitionName = caseDefinitionName,
                type = templateType,
                metadata = metadata,
                content = content,
            )
        )
    }

    fun createTemplate(
        templateKey: String,
        caseDefinitionName: String?,
        templateType: String,
        metadata: Map<String, Any?>,
    ): ValtimoTemplate {
        require(
            !templateRepository.exists(
                byKeyAndCaseDefinitionNameAndType(templateKey, caseDefinitionName, templateType)
            )
        ) { "Template '$templateKey' already exists" }
        return templateRepository.save(
            ValtimoTemplate(
                key = templateKey,
                caseDefinitionName = caseDefinitionName,
                type = templateType,
                metadata = metadata,
            )
        )
    }

    fun deleteTemplates(
        caseDefinitionName: String?,
        templateType: String,
        templateKeys: List<String>
    ) {
        templateKeys.forEach { key ->
            deleteTemplate(key, caseDefinitionName, templateType)
        }
    }

    fun deleteTemplate(
        templateKey: String,
        caseDefinitionName: String?,
        templateType: String,
    ) {
        templateRepository.delete(byKeyAndCaseDefinitionNameAndType(templateKey, caseDefinitionName, templateType))
    }

    private fun buildSpecification(
        templateKey: String? = null,
        caseDefinitionName: String? = null,
        templateType: String? = null,
    ): Specification<ValtimoTemplate> {
        var query = query()
        if (!templateKey.isNullOrEmpty()) {
            query = query.and(byKey(templateKey))
        }
        if (caseDefinitionName?.isNotEmpty() == true) {
            query = query.and(byCaseDefinitionName(caseDefinitionName))
        }
        if (!templateType.isNullOrEmpty()) {
            query = query.and(byType(templateType))
        }
        return query
    }

    private fun resolveDataModel(
        document: Document,
        template: ValtimoTemplate,
        incompleteDataModel: MutableMap<String, Any?>
    ): Boolean {
        val resolvedPlaceholders = getPlaceholdersFromDataModel(incompleteDataModel)
        val newPlaceholders = findPlaceholders(template, incompleteDataModel)
            .filter { !resolvedPlaceholders.contains(it) }
        valueResolverService.resolveValues(document.id().toString(), newPlaceholders).forEach { (placeholder, value) ->
            require(value != null && placeholder != value) {
                throw IllegalStateException("Failed to resolve '$placeholder' for template: '$template'")
            }
            putPlaceholder(placeholder, value, incompleteDataModel)
        }
        return newPlaceholders.isNotEmpty()
    }

    private fun getPlaceholdersFromDataModel(
        dataModel: Map<String, Any?>,
        stack: Stack<Any> = Stack(),
        placeholders: MutableList<String> = mutableListOf()
    ): List<String> {
        dataModel.forEach { (key, value) ->
            getPlaceholdersFromDataModel(key, value, stack, placeholders)
        }
        if (dataModel.isEmpty()) {
            placeholders.add(stack.joinToString(".").replaceFirst('.', ':'))
        }
        return placeholders
    }

    private fun getPlaceholdersFromDataModel(
        dataModel: List<Any?>,
        stack: Stack<Any> = Stack(),
        placeholders: MutableList<String> = mutableListOf()
    ): List<String> {
        dataModel.forEachIndexed { index, value ->
            getPlaceholdersFromDataModel("[$index]", value, stack, placeholders)
        }
        if (dataModel.isEmpty()) {
            placeholders.add(stack.joinToString(".").replaceFirst('.', ':'))
        }
        return placeholders
    }

    private fun getPlaceholdersFromDataModel(
        key: String,
        value: Any?,
        stack: Stack<Any> = Stack(),
        placeholders: MutableList<String> = mutableListOf()
    ) {
        stack.push(key)
        when (value) {
            is Map<*, *> -> getPlaceholdersFromDataModel(value as Map<String, Any?>, stack, placeholders)
            is List<*> -> getPlaceholdersFromDataModel(value as List<Any?>, stack, placeholders)
            else -> placeholders.add(stack.joinToString(".").replaceFirst('.', ':'))
        }
        stack.pop()
    }

    private fun findCompleteDataModelWithDummyData(
        valtimoTemplate: ValtimoTemplate,
        incompleteDataModel: Map<String, Any?> = mutableMapOf()
    ): Map<String, Any?> {
        val dataModel = incompleteDataModel.toMutableMap()
        val template = Template(UUID.randomUUID().toString(), valtimoTemplate.content, freemarkerConfiguration)
        for (i in 1..100) {
            try {
                val writer = StringWriter()
                template.createProcessingEnvironment(dataModel, writer).process()
                break
            } catch (e: TemplateException) {
                val missingPlaceholder = e.blamedExpressionString ?: throw e
                putPlaceholder(missingPlaceholder, getRandomDummyValue(), dataModel)
            }
        }
        return dataModel
    }

    private fun putPlaceholder(
        placeholder: String,
        value: Any?,
        dataModel: MutableMap<String, Any?>
    ) {
        var node = dataModel
        val parts = placeholder.split('.', ':')
        parts.forEach { part ->
            if (part == parts.last()) {
                node[part] = value
            } else {
                val v = node[part]
                val n = if (v is Map<*, *>) {
                    v.toMutableMap() as MutableMap<String, Any?>
                } else {
                    mutableMapOf()
                }
                node[part] = n
                node = n
            }
        }
    }

    private fun getRandomDummyValue(): Any {
        return when (Random.nextInt(4)) {
            0 -> "value"
            1 -> Random.nextInt(0, 100)
            2 -> listOf<Any>()
            else -> mutableMapOf<String, Any>()
        }
    }
}
