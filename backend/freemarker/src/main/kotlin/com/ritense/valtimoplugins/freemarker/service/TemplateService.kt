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
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.document.domain.Document
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.model.CircularTemplateReferenceException
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy.REPLACE_MISSING_PLACEHOLDER_WITH_EMPTY_VALUE
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy.SHOW_MISSING_PLACEHOLDER
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy.THROW_ERROR_WHEN_MISSING_PLACEHOLDER
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_CSV
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_MAIL
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_PDF
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_TEXT
import com.ritense.valtimoplugins.freemarker.repository.JsonSchemaDocumentRepositoryStreaming
import com.ritense.valtimoplugins.freemarker.repository.TemplateRepository
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byCaseDefinitionName
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byKey
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byKeyAndCaseDefinitionNameAndType
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byType
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.byTypes
import com.ritense.valtimoplugins.freemarker.repository.ValtimoTemplateSpecificationHelper.Companion.query
import com.ritense.valtimoplugins.freemarker.web.rest.dto.TemplateKeyType
import com.ritense.valueresolver.ValueResolverService
import freemarker.core.HTMLOutputFormat
import freemarker.core.OutputFormat
import freemarker.core.ParseException
import freemarker.core.TemplateClassResolver
import freemarker.core.TemplateConfiguration
import freemarker.core.XHTMLOutputFormat
import freemarker.template.Configuration
import freemarker.template.DefaultObjectWrapperBuilder
import freemarker.template.Template
import freemarker.template.TemplateException
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.StringReader
import java.io.StringWriter
import java.io.Writer
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
    private val jsonSchemaDocumentRepositoryStreaming: JsonSchemaDocumentRepositoryStreaming,
) {
    // Wraps docs, which is an Iterable
    private val objectWrapper = DefaultObjectWrapperBuilder(freemarkerConfiguration.incompatibleImprovements)
        .apply { iterableSupport = true }
        .build()

    fun generate(
        templateKey: String,
        templateType: String,
        document: Document,
    ): String = generate(
        templateKey = templateKey,
        templateType = templateType,
        document = document,
        processVariables = emptyMap(),
    )

    fun generate(
        templateKey: String,
        templateType: String,
        document: Document,
        processVariables: Map<String, Any?> = emptyMap(),
        missingPlaceholderStrategy: MissingPlaceholderStrategy = THROW_ERROR_WHEN_MISSING_PLACEHOLDER,
    ): String {
        val template = getTemplate(templateKey, document.definitionId().name(), templateType)
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
            templateType = valtimoTemplate.type,
        )
    }

    /** Generates a template without escaping. */
    fun generate(
        templateName: String,
        templateContent: String,
        processVariables: Map<String, Any?> = emptyMap(),
        document: Document? = null,
        missingPlaceholderStrategy: MissingPlaceholderStrategy = THROW_ERROR_WHEN_MISSING_PLACEHOLDER,
    ): String = generate(templateName, templateContent, processVariables, document, missingPlaceholderStrategy, null)

    /**
     * @param templateType mail and pdf templates escape interpolated values as HTML, so document data can't inject
     * markup, and csv templates escape values that would break the tab-delimited output. Text templates, and a null
     * type, don't escape.
     */
    fun generate(
        templateName: String,
        templateContent: String,
        processVariables: Map<String, Any?> = emptyMap(),
        document: Document? = null,
        missingPlaceholderStrategy: MissingPlaceholderStrategy = THROW_ERROR_WHEN_MISSING_PLACEHOLDER,
        templateType: String?,
    ): String {
        LazyDocuments(document?.definitionId()?.name()).use { docs ->
            val dataModel = mutableMapOf<String, Any?>()
            document?.let {
                dataModel["doc"] = objectMapper.convertValue<Map<String, Any?>>(document.content().asJson())
                dataModel["docs"] = docs
            }
            dataModel["pv"] = processVariables

            val template = parseTemplate(templateContent, templateType)
            var exceptionCaught: Exception? = null

            for (i in 1..10) {
                try {
                    // Re-check without docs before querying them again
                    if (exceptionCaught != null && docs.isQueried()) {
                        template
                            .createProcessingEnvironment(dataModel + ("docs" to emptyList<Any>()), Writer.nullWriter())
                            .process()
                    }
                    val writer = StringWriter()
                    template.createProcessingEnvironment(dataModel, writer).process()
                    return writer.toString()
                } catch (e: TemplateException) {
                    if (!resolveDataModel(
                            document = document,
                            templateName = templateName,
                            template = template,
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
    ): Map<String, Any> = findPlaceholders(
        parseTemplate(templateContent, null as String?),
        incompleteDataModel
    )

    private fun parseTemplate(templateContent: String, templateType: String?): Template {
        val outputFormat = when (templateType) {
            TEMPLATE_TYPE_MAIL -> HTMLOutputFormat.INSTANCE
            TEMPLATE_TYPE_PDF -> XHTMLOutputFormat.INSTANCE
            TEMPLATE_TYPE_CSV -> TsvOutputFormat.INSTANCE
            else -> null
        }
        if (outputFormat != null) {
            try {
                return parseTemplate(templateContent, outputFormat)
            } catch (e: ParseException) {
                // Templates that escape with ?html or <#escape> can't be auto-escaped; they keep escaping themselves
                if (e.message?.contains("(legacy escaping)") != true) {
                    throw e
                }
                logger.warn { "Template uses ?html or <#escape>, so its other values aren't escaped either" }
            }
        }
        return parseTemplate(templateContent, null as OutputFormat?)
    }

    private fun parseTemplate(templateContent: String, outputFormat: OutputFormat?): Template {
        // Set on the template, because the injected configuration can be one the application configured differently
        val templateConfiguration = TemplateConfiguration().apply {
            parentConfiguration = freemarkerConfiguration
            newBuiltinClassResolver = TemplateClassResolver.ALLOWS_NOTHING_RESOLVER
            setAPIBuiltinEnabled(false)
            objectWrapper = this@TemplateService.objectWrapper
            outputFormat?.let { this.outputFormat = it }
        }
        return Template(
            UUID.randomUUID().toString(),
            null,
            StringReader(templateContent),
            freemarkerConfiguration,
            templateConfiguration,
            null,
        ).also { templateConfiguration.apply(it) }
    }

    private fun findPlaceholders(
        template: Template,
        incompleteDataModel: Map<String, Any?>
    ): Map<String, Any> {
        // Might not find placeholders that are hidden behind a freemarker-condition
        val completeDataModel = findCompleteDataModelWithDummyData(template, incompleteDataModel)
        return extractPlaceholders(completeDataModel)
    }

    fun findTemplates(
        templateKey: String? = null,
        caseDefinitionName: String? = null,
        templateType: String? = null,
        templateTypes: List<String>? = null,
        pageable: Pageable,
    ): Page<ValtimoTemplate> {
          val query = buildSpecification(
            templateKey = templateKey,
            caseDefinitionName = caseDefinitionName,
            templateType = templateType,
            templateTypes = templateTypes
        )
        return templateRepository.findAll(query, pageable)
    }

    fun findTemplates(
        templateKey: String? = null,
        caseDefinitionName: String? = null,
        templateType: String? = null,
        templateTypes: List<String>? = null,
    ): List<ValtimoTemplate> {
         val query = buildSpecification(
            templateKey = templateKey,
            caseDefinitionName = caseDefinitionName,
            templateType = templateType,
            templateTypes = templateTypes
        )
        return templateRepository.findAll(query)
    }

    /** Like [findTemplates], but without loading the content and metadata of every template. */
    fun findTemplateKeys(
        templateKey: String? = null,
        caseDefinitionName: String? = null,
        templateType: String? = null,
        templateTypes: List<String>? = null,
        pageable: Pageable = Pageable.unpaged(),
    ): Page<TemplateKeyType> {
        val query = buildSpecification(
            templateKey = templateKey,
            caseDefinitionName = caseDefinitionName,
            templateType = templateType,
            templateTypes = templateTypes
        )
        return templateRepository.findKeyTypes(query, pageable)
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
        requireValidTemplateKey(templateKey)
        requireValidTemplateType(templateType)
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
                content = defaultTemplateContent(templateType),
            )
        )
    }

    fun deleteTemplates(
        caseDefinitionName: String?,
        templates: List<TemplateKeyType>,
    ) {
        templates.forEach { template ->
            deleteTemplate(template.key, caseDefinitionName, template.type)
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
        templateTypes: List<String>? = null,
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
        if (templateTypes != null) {
            query = query.and(byTypes(templateTypes))
        }
        return query
    }

    private fun resolveDataModel(
        templateName: String,
        template: Template,
        document: Document? = null,
        incompleteDataModel: MutableMap<String, Any?> = mutableMapOf(),
        missingPlaceholderStrategy: MissingPlaceholderStrategy = THROW_ERROR_WHEN_MISSING_PLACEHOLDER
    ): Boolean {
        val resolvedPlaceholders = extractPlaceholders(incompleteDataModel)
        val newPlaceholders = findPlaceholders(template, incompleteDataModel)
            .filter { !resolvedPlaceholders.keys.contains(it.key) }
        val resolvedValues = if (document == null) {
            newPlaceholders
        } else {
            try {
                valueResolverService.resolveValues(document.id().toString(), newPlaceholders.keys)
            } catch (e: CircularTemplateReferenceException) {
                throw e
            } catch (ignore: Exception) {
                newPlaceholders.keys.associate { newPlaceholder ->
                    try {
                        newPlaceholder to valueResolverService.resolveValues(
                            document.id().toString(),
                            listOf(newPlaceholder)
                        )[newPlaceholder]
                    } catch (e: CircularTemplateReferenceException) {
                        throw e
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
        template: Template,
        incompleteDataModel: Map<String, Any?>
    ): Map<String, Any?> {
        val dataModel = incompleteDataModel.toMutableMap()
        // Placeholder discovery renders the template many times; don't query all documents on every render.
        if (dataModel["docs"] is LazyDocuments) {
            dataModel["docs"] = emptyList<Any>()
        }
        var prevPlaceholder: String? = null
        var dummyValueIndex = 0
        for (i in 1..100) {
            try {
                template.createProcessingEnvironment(dataModel, Writer.nullWriter()).process()
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
        parts.forEachIndexed { index, part ->
            if (index == parts.lastIndex) {
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

    /**
     * The `docs` variable. Documents are only queried when the template iterates over them, and every iteration
     * opens a fresh stream, so a template can list `docs` more than once.
     */
    private inner class LazyDocuments(
        private val caseDefinitionName: String?,
    ) : Iterable<Map<String, Any?>>, AutoCloseable {
        private val openStreams = mutableListOf<Stream<String>>()

        fun isQueried() = openStreams.isNotEmpty()

        override fun iterator(): Iterator<Map<String, Any?>> {
            if (caseDefinitionName == null) {
                return emptyList<Map<String, Any?>>().iterator()
            }
            val stream = jsonSchemaDocumentRepositoryStreaming.streamContentByCaseDefinitionName(caseDefinitionName)
            openStreams += stream
            return stream.map { objectMapper.readValue<Map<String, Any?>>(it) }.iterator()
        }

        override fun close() = openStreams.forEach { it.close() }
    }

    private fun defaultTemplateContent(templateType: String): String =
        when (templateType) {
            "mail" ->
                """
                |<!DOCTYPE html>
                |<html lang="en">
                |  <head>
                |    <meta charset="utf-8" />
                |    <title>Email</title>
                |  </head>
                |  <body>
                |    <p>Hi ${'$'}{doc.fullName},</p>
                |
                |    <p><b>This is an example mail</b></p>
                |  </body>
                |</html>
            |
                """.trimMargin()

            "text" ->
                """
                |<#if doc.firstName == ''>
                |  Mr. ${'$'}{doc.lastName}
                |<#else>
                |    ${'$'}{doc.firstName} ${'$'}{doc.lastName}
                |</#if>
            |
                """.trimMargin()

            "pdf" ->
                """
                |<!DOCTYPE html>
                |<html lang="en">
                |  <head>
                |    <meta charset="UTF-8" />
                |    <title>Example PDF</title>
                |  </head>
                |  <body>
                |    <div class="header">
                |      <p>This is an example PDF</p>
                |    </div>
                |  </body>
                |</html>
            |
                """.trimMargin()

            "csv" ->
                """
                |Example${'\t'}First name${'\t'}Last name
                |<#list docs as doc>
                |This is an example${'\t'}${'$'}{doc.firstName}${'\t'}${'$'}{doc.lastName}
                |</#list>
            |
                """.trimMargin()

            else -> ""
        }

    companion object {
        private val logger = KotlinLogging.logger {}

        // A key with a slash can't be used in the template URL
        fun requireValidTemplateKey(templateKey: String) =
            require(templateKey.isNotBlank() && '/' !in templateKey) { "Invalid template key '$templateKey'" }

        private val TEMPLATE_TYPES = listOf(TEMPLATE_TYPE_MAIL, TEMPLATE_TYPE_TEXT, TEMPLATE_TYPE_PDF, TEMPLATE_TYPE_CSV)

        // No plugin uses a template of another type
        fun requireValidTemplateType(templateType: String) =
            require(templateType in TEMPLATE_TYPES) { "Invalid template type '$templateType'" }
    }
}
