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
import com.ritense.document.domain.impl.JsonSchemaDocument
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimo.contract.case_.CaseDefinitionChecker
import com.ritense.valtimo.contract.case_.CaseDefinitionId
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy.REPLACE_MISSING_PLACEHOLDER_WITH_EMPTY_VALUE
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy.SHOW_MISSING_PLACEHOLDER
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy.THROW_ERROR_WHEN_MISSING_PLACEHOLDER
import com.ritense.valtimoplugins.freemarker.repository.JsonSchemaDocumentRepositoryStreaming
import com.ritense.valtimoplugins.freemarker.repository.TemplateRepository
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byCaseDefinitionId
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byKey
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byKeyAndCaseDefinitionIdAndType
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byType
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byTypes
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.query
import com.ritense.valtimoplugins.freemarker.web.rest.dto.TemplateKeyType
import com.ritense.valueresolver.ValueResolverService
import freemarker.template.Configuration
import freemarker.template.Template
import freemarker.template.TemplateException
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.StringWriter
import java.util.UUID
import java.util.stream.Stream
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
    private val jsonSchemaDocumentRepositoryStreaming: JsonSchemaDocumentRepositoryStreaming,
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
        missingPlaceholderStrategy: MissingPlaceholderStrategy = THROW_ERROR_WHEN_MISSING_PLACEHOLDER,
    ): String {
        val template = getTemplate(templateKey, document.definitionId().caseDefinitionId(), templateType)
        return generate(template, document, processVariables, missingPlaceholderStrategy)
    }

    fun generate(template: ValtimoTemplate, document: Document) = generate(template, document, emptyMap())

    fun generate(
        valtimoTemplate: ValtimoTemplate,
        document: Document,
        processVariables: Map<String, Any?>,
        missingPlaceholderStrategy: MissingPlaceholderStrategy = THROW_ERROR_WHEN_MISSING_PLACEHOLDER,
    ): String {
        return generate(
            templateName = valtimoTemplate.toString(),
            templateContent = valtimoTemplate.content,
            document = document,
            processVariables = processVariables,
            missingPlaceholderStrategy = missingPlaceholderStrategy,
        )
    }

    fun generate(
        templateName: String,
        templateContent: String,
        processVariables: Map<String, Any?> = emptyMap(),
        document: Document? = null,
        missingPlaceholderStrategy: MissingPlaceholderStrategy = THROW_ERROR_WHEN_MISSING_PLACEHOLDER,
    ): String {
        streamDocuments(document?.definitionId()?.caseDefinitionId()?.key).use { documentsStream ->
            val dataModel = mutableMapOf<String, Any?>()
            document?.let { dataModel["doc"] = objectMapper.convertValue<Map<String, Any?>>(document.content().asJson()) }
            document?.let { dataModel["docs"] = streamToMap(documentsStream) }
            dataModel["pv"] = processVariables

            val template = Template(UUID.randomUUID().toString(), templateContent, freemarkerConfiguration)
            var exceptionCaught: Exception? = null

            for (i in 1..10) {
                try {
                    val writer = StringWriter()
                    template.createProcessingEnvironment(dataModel, writer).process()
                    return writer.toString()
                } catch (e: TemplateException) {
                    if (!resolveDataModel(
                            document = document,
                            templateName = templateName,
                            templateContent = templateContent,
                            incompleteDataModel = dataModel,
                            missingPlaceholderStrategy = missingPlaceholderStrategy
                        )
                    ) {
                        throw e
                    }
                    exceptionCaught = e
                }
            }
            throw exceptionCaught!!
        }
    }

    fun findPlaceholders(
        templateContent: String,
        incompleteDataModel: Map<String, Any?> = mutableMapOf()
    ): Map<String, Any> {
        // Might not find placeholders that are hidden behind a freemarker-condition
        val completeDataModel = findCompleteDataModelWithDummyData(templateContent, incompleteDataModel)
        return extractPlaceholders(completeDataModel)
    }

    fun findTemplates(
        templateKey: String? = null,
        caseDefinitionId: CaseDefinitionId? = null,
        templateType: String? = null,
        templateTypes: List<String>? = null,
        pageable: Pageable,
    ): Page<ValtimoTemplate> {
        val query = buildSpecification(
            templateKey = templateKey,
            caseDefinitionId = caseDefinitionId,
            templateType = templateType,
            templateTypes = templateTypes
        )
        return templateRepository.findAll(query, pageable)
    }

    fun findTemplates(
        templateKey: String? = null,
        caseDefinitionId: CaseDefinitionId? = null,
        templateType: String? = null,
        templateTypes: List<String>? = null,
    ): List<ValtimoTemplate> {
        val query = buildSpecification(
            templateKey = templateKey,
            caseDefinitionId = caseDefinitionId,
            templateType = templateType,
            templateTypes = templateTypes
        )
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
        templates: List<TemplateKeyType>,
    ) {
        if (caseDefinitionId == null) {
            caseDefinitionChecker.assertCanUpdateGlobalConfiguration()
        } else {
            caseDefinitionChecker.assertCanUpdateCaseDefinition(caseDefinitionId)
        }
        templates.forEach { template ->
            deleteTemplate(template.key, caseDefinitionId, template.type)
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
        templateTypes: List<String>? = null,
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
        if (templateTypes != null) {
            query = query.and(byTypes(templateTypes))
        }
        return query
    }

    private fun resolveDataModel(
        templateName: String,
        templateContent: String,
        document: Document? = null,
        incompleteDataModel: MutableMap<String, Any?> = mutableMapOf(),
        missingPlaceholderStrategy: MissingPlaceholderStrategy = THROW_ERROR_WHEN_MISSING_PLACEHOLDER
    ): Boolean {
        val resolvedPlaceholders = extractPlaceholders(incompleteDataModel)
        val newPlaceholders = findPlaceholders(templateContent, incompleteDataModel)
            .filter { !resolvedPlaceholders.keys.contains(it.key) }
        val resolvedValues = if (document == null) {
            newPlaceholders
        } else {
            try {
                valueResolverService.resolveValues(document.id().toString(), newPlaceholders.keys)
            } catch (ignore: Exception) {
                newPlaceholders.keys.associate { newPlaceholder ->
                    try {
                        newPlaceholder to valueResolverService.resolveValues(
                            document.id().toString(),
                            listOf(newPlaceholder)
                        )[newPlaceholder]
                    } catch (ignore: Exception) {
                        newPlaceholder to null
                    }
                }
            }
        }
        resolvedValues.forEach { (placeholder, value) ->
            if (placeholder == value || value == null) {
                val dummyValue = newPlaceholders[placeholder]!!
                val newValue = when (missingPlaceholderStrategy) {
                    SHOW_MISSING_PLACEHOLDER -> dummyValue
                    THROW_ERROR_WHEN_MISSING_PLACEHOLDER -> error("Failed to resolve '$placeholder' for template: '$templateName'")
                    REPLACE_MISSING_PLACEHOLDER_WITH_EMPTY_VALUE -> if (dummyValue is String) "" else dummyValue
                }
                logger.warn { "Unresolved placeholder '$placeholder'. Template: '$templateName'" }
                putPlaceholder(placeholder, newValue, incompleteDataModel)
            } else {
                putPlaceholder(placeholder, value, incompleteDataModel)
            }
        }
        return newPlaceholders.isNotEmpty()
    }

    private fun extractPlaceholders(
        value: Any?,
        path: MutableList<String> = mutableListOf(),
        placeholders: MutableMap<String, Any> = mutableMapOf()
    ): Map<String, Any> {
        when (value) {
            is Map<*, *> -> {
                if (value.isEmpty()) {
                    placeholders.put(
                        path.joinToString(".").replaceFirst('.', ':'),
                        value
                    )
                } else {
                    value.forEach { (key, v) ->
                        require(key is String)
                        path.add(key)
                        extractPlaceholders(v, path, placeholders)
                        path.removeLast()
                    }
                }
            }

            is List<*> -> {
                if (value.isEmpty()) {
                    placeholders.put(
                        path.joinToString(".").replaceFirst('.', ':'),
                        value
                    )
                } else {
                    value.forEachIndexed { index, item ->
                        path.add("[$index]")
                        extractPlaceholders(item, path, placeholders)
                        path.removeLast()
                    }
                }
            }

            null -> {
                placeholders.put(
                    path.joinToString(".").replaceFirst('.', ':'),
                    Any::class
                )
            }

            else -> {
                placeholders.put(
                    path.joinToString(".").replaceFirst('.', ':'),
                    value
                )
            }
        }
        return placeholders
    }

    private fun findCompleteDataModelWithDummyData(
        templateContent: String,
        incompleteDataModel: Map<String, Any?> = mutableMapOf()
    ): Map<String, Any?> {
        val dataModel = incompleteDataModel.toMutableMap()
        val template = Template(UUID.randomUUID().toString(), templateContent, freemarkerConfiguration)
        var prevPlaceholder: String? = null
        var dummyValueIndex = 0
        for (i in 1..100) {
            try {
                val writer = StringWriter()
                template.createProcessingEnvironment(dataModel, writer).process()
                break
            } catch (e: TemplateException) {
                val missingPlaceholder = e.blamedExpressionString?.substringBefore(' ') ?: prevPlaceholder
                if (missingPlaceholder == null || !e.ftlInstructionStack.contains(missingPlaceholder)) {
                    throw e
                }
                if (prevPlaceholder == missingPlaceholder) dummyValueIndex++ else dummyValueIndex = 0
                val dummyValue = getDummyValue("\${$missingPlaceholder}", dummyValueIndex)
                putPlaceholder(missingPlaceholder, dummyValue, dataModel)
                prevPlaceholder = missingPlaceholder
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

    private fun getDummyValue(stringValue: String, index: Int): Any {
        return when (index % 4) {
            0 -> stringValue
            1 -> Random.nextInt(0, 100)
            2 -> listOf<Any>()
            else -> mutableMapOf<String, Any>()
        }
    }

    private fun streamDocuments(caseDefinitionKey: String?): Stream<JsonSchemaDocument> {
        return if (caseDefinitionKey == null) {
            emptyList<JsonSchemaDocument>().stream()
        } else {
            jsonSchemaDocumentRepositoryStreaming
                .streamAllByCaseDefinitionKey(caseDefinitionKey)
        }
    }

    private fun streamToMap(stream: Stream<JsonSchemaDocument>): Iterable<Map<String, Any?>> {
        return Iterable {
            val iterator = stream.iterator()
            object : Iterator<Map<String, Any?>> {
                override fun hasNext(): Boolean = iterator.hasNext()
                override fun next(): Map<String, Any?> =
                    objectMapper.convertValue<Map<String, Any?>>(iterator.next().content().asJson())
            }
        }
    }


    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
