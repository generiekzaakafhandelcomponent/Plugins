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
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimo.contract.case_.CaseDefinitionChecker
import com.ritense.valtimo.contract.case_.CaseDefinitionId
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.repository.TemplateRepository
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byCaseDefinitionId
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byKey
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byKeyAndCaseDefinitionIdAndType
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byType
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.query
import com.ritense.valueresolver.ValueResolverService
import freemarker.template.Configuration
import freemarker.template.Template
import freemarker.template.TemplateException
import java.io.StringWriter
import java.util.Stack
import java.util.UUID
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.random.Random

@Service
@SkipComponentScan
@Transactional
class TemplateService(
    private val templateRepository: TemplateRepository,
    private val objectMapper: ObjectMapper,
    private val valueResolverService: ValueResolverService,
    private val freemarkerConfiguration: Configuration,
    private val caseDefinitionChecker: CaseDefinitionChecker,
) {

    fun generate(
        templateKey: String,
        templateType: String,
        document: Document,
    ): String = generate(
        templateKey = templateKey,
        templateType = templateType,
        document = document
    )

    fun generate(
        templateKey: String,
        templateType: String,
        document: Document,
        processVariables: Map<String, Any?> = emptyMap(),
        strict: Boolean = true,
    ): String {
        val template = getTemplate(templateKey, document.definitionId().caseDefinitionId(), templateType)
        return generate(template, document, processVariables, strict)
    }

    fun generate(template: ValtimoTemplate, document: Document) = generate(template, document, emptyMap())

    fun generate(
        valtimoTemplate: ValtimoTemplate,
        document: Document,
        processVariables: Map<String, Any?>,
        strict: Boolean = true,
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
                if (!resolveDataModel(document, valtimoTemplate, dataModel, strict)) {
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
        caseDefinitionId: CaseDefinitionId? = null,
        templateType: String? = null,
        pageable: Pageable,
    ): Page<ValtimoTemplate> {
        val query = buildSpecification(templateKey, caseDefinitionId, templateType)
        return templateRepository.findAll(query, pageable)
    }

    fun findTemplates(
        templateKey: String? = null,
        caseDefinitionId: CaseDefinitionId? = null,
        templateType: String? = null,
    ): List<ValtimoTemplate> {
        val query = buildSpecification(templateKey, caseDefinitionId, templateType)
        return templateRepository.findAll(query)
    }

    fun findTemplate(
        templateKey: String,
        caseDefinitionId: CaseDefinitionId?,
        templateType: String,
    ): ValtimoTemplate? {
        return templateRepository.findOne(
            byKeyAndCaseDefinitionIdAndType(templateKey, caseDefinitionId, templateType)
        ).orElse(null)
    }

    fun getTemplate(
        templateKey: String,
        caseDefinitionId: CaseDefinitionId?,
        templateType: String,
    ): ValtimoTemplate {
        return findTemplate(templateKey, caseDefinitionId, templateType)
            ?: throw IllegalStateException("No Template found for '$templateType/$caseDefinitionId/$templateKey'")
    }

    fun saveTemplate(
        templateKey: String,
        caseDefinitionId: CaseDefinitionId?,
        templateType: String,
        metadata: Map<String, Any?>,
        content: String,
    ): ValtimoTemplate {
        if (caseDefinitionId == null) {
            caseDefinitionChecker.assertCanUpdateGlobalConfiguration()
        } else {
            caseDefinitionChecker.assertCanUpdateCaseDefinition(caseDefinitionId)
        }
        val existingTemplate = findTemplate(templateKey, caseDefinitionId, templateType)
        return templateRepository.save(
            ValtimoTemplate(
                id = existingTemplate?.id ?: UUID.randomUUID(),
                key = templateKey,
                caseDefinitionId = caseDefinitionId,
                type = templateType,
                metadata = metadata,
                content = content,
            )
        )
    }

    fun createTemplate(
        templateKey: String,
        caseDefinitionId: CaseDefinitionId?,
        templateType: String,
        metadata: Map<String, Any?>,
    ): ValtimoTemplate {
        if (caseDefinitionId == null) {
            caseDefinitionChecker.assertCanUpdateGlobalConfiguration()
        } else {
            caseDefinitionChecker.assertCanUpdateCaseDefinition(caseDefinitionId)
        }
        require(
            !templateRepository.exists(
                byKeyAndCaseDefinitionIdAndType(templateKey, caseDefinitionId, templateType)
            )
        ) { "Template '$templateKey' already exists" }
        return templateRepository.save(
            ValtimoTemplate(
                key = templateKey,
                caseDefinitionId = caseDefinitionId,
                type = templateType,
                metadata = metadata,
            )
        )
    }

    fun deleteTemplates(
        caseDefinitionId: CaseDefinitionId?,
        templateType: String,
        templateKeys: List<String>
    ) {
        if (caseDefinitionId == null) {
            caseDefinitionChecker.assertCanUpdateGlobalConfiguration()
        } else {
            caseDefinitionChecker.assertCanUpdateCaseDefinition(caseDefinitionId)
        }
        templateKeys.forEach { key ->
            deleteTemplate(key, caseDefinitionId, templateType)
        }
    }

    fun deleteTemplate(
        templateKey: String,
        caseDefinitionId: CaseDefinitionId?,
        templateType: String,
    ) {
        if (caseDefinitionId == null) {
            caseDefinitionChecker.assertCanUpdateGlobalConfiguration()
        } else {
            caseDefinitionChecker.assertCanUpdateCaseDefinition(caseDefinitionId)
        }
        templateRepository.delete(byKeyAndCaseDefinitionIdAndType(templateKey, caseDefinitionId, templateType))
    }

    fun deleteTemplatesByCaseDefinitionId(caseDefinitionId: CaseDefinitionId?) {
        if (caseDefinitionId == null) {
            caseDefinitionChecker.assertCanUpdateGlobalConfiguration()
        } else {
            caseDefinitionChecker.assertCanUpdateCaseDefinition(caseDefinitionId)
        }
        templateRepository.delete(byCaseDefinitionId(caseDefinitionId))
    }

    private fun buildSpecification(
        templateKey: String? = null,
        caseDefinitionId: CaseDefinitionId? = null,
        templateType: String? = null,
    ): Specification<ValtimoTemplate> {
        var query = query()
        if (!templateKey.isNullOrEmpty()) {
            query = query.and(byKey(templateKey))
        }
        if (caseDefinitionId != null) {
            query = query.and(byCaseDefinitionId(caseDefinitionId))
        }
        if (!templateType.isNullOrEmpty()) {
            query = query.and(byType(templateType))
        }
        return query
    }

    private fun resolveDataModel(
        document: Document,
        template: ValtimoTemplate,
        incompleteDataModel: MutableMap<String, Any?>,
        strict: Boolean = true
    ): Boolean {
        val resolvedPlaceholders = getPlaceholdersFromDataModel(incompleteDataModel)
        val newPlaceholders = findPlaceholders(template, incompleteDataModel)
            .filter { !resolvedPlaceholders.contains(it) }
        valueResolverService.resolveValues(document.id().toString(), newPlaceholders).forEach { (placeholder, value) ->
            if (value != null && placeholder != value) {
                putPlaceholder(placeholder, value, incompleteDataModel)
            } else if (!strict) {
                logger.warn { "Unresolved placeholder '$placeholder'. Template: '$template', document: '${document.id()}'" }
                putPlaceholder(placeholder, "", incompleteDataModel)
            } else {
                error("Failed to resolve '$placeholder' for template: '$template'")
            }
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

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
