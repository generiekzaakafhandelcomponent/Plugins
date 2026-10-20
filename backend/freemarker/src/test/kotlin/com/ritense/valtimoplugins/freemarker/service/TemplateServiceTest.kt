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
import com.ritense.document.domain.impl.JsonDocumentContent
import com.ritense.document.domain.impl.JsonSchemaDocument
import com.ritense.document.domain.impl.JsonSchemaDocumentDefinitionId
import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.valtimoplugins.freemarker.autoconfiguration.TemplateAutoConfiguration
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy
import com.ritense.valtimoplugins.freemarker.plugin.documentgenerator.DocumentGeneratorPlugin
import com.ritense.valtimoplugins.freemarker.repository.JsonSchemaDocumentRepositoryStreaming
import com.ritense.valtimoplugins.freemarker.repository.TemplateRepository
import com.ritense.valueresolver.ValueResolverService
import freemarker.core.TemplateClassResolver
import freemarker.template.Configuration
import java.io.ByteArrayOutputStream
import java.io.StringReader
import java.util.Optional
import java.util.stream.Stream
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import org.apache.commons.csv.CSVFormat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoInteractions
import org.mockito.kotlin.whenever
import org.springframework.data.jpa.domain.Specification

class TemplateServiceTest {

    private lateinit var templateRepository: TemplateRepository
    private lateinit var jsonSchemaDocumentRepositoryStreaming: JsonSchemaDocumentRepositoryStreaming
    private lateinit var valueResolverService: ValueResolverService
    private lateinit var templateService: TemplateService
    private lateinit var document: JsonSchemaDocument

    @BeforeEach
    fun setUp() {
        templateRepository = mock()
        jsonSchemaDocumentRepositoryStreaming = mock()
        valueResolverService = mock()
        templateService = TemplateService(
            templateRepository = templateRepository,
            objectMapper = ObjectMapper(),
            valueResolverService = valueResolverService,
            freemarkerConfiguration = TemplateAutoConfiguration().freemarkerConfiguration(),
            jsonSchemaDocumentRepositoryStreaming = jsonSchemaDocumentRepositoryStreaming
        )
        document = documentOf("""{"firstName":"Klaas"}""")
    }

    @Test
    fun `should render a template that lists docs`() {
        whenever(jsonSchemaDocumentRepositoryStreaming.streamContentByCaseDefinitionName(CASE_DEFINITION_NAME))
            .thenReturn(Stream.of("""{"firstName":"Anna"}""", """{"firstName":"Bram"}"""))

        val result = templateService.generate(
            templateName = "docs.csv",
            templateContent = "<#list docs as doc>\${doc.firstName}\n</#list>",
            document = document
        )

        assertEquals("Anna\nBram\n", result)
        verify(jsonSchemaDocumentRepositoryStreaming).streamContentByCaseDefinitionName(CASE_DEFINITION_NAME)
    }

    @Test
    fun `should list docs when the application configures FreeMarker itself`() {
        val templateService = TemplateService(
            templateRepository = templateRepository,
            objectMapper = ObjectMapper(),
            valueResolverService = valueResolverService,
            freemarkerConfiguration = Configuration(Configuration.VERSION_2_3_32),
            jsonSchemaDocumentRepositoryStreaming = jsonSchemaDocumentRepositoryStreaming
        )
        whenever(jsonSchemaDocumentRepositoryStreaming.streamContentByCaseDefinitionName(CASE_DEFINITION_NAME))
            .thenReturn(Stream.of("""{"firstName":"Anna"}"""))

        val result = templateService.generate(
            templateName = "docs.csv",
            templateContent = "<#list docs as doc>\${doc.firstName}</#list>",
            document = document
        )

        assertEquals("Anna", result)
    }

    @Test
    fun `should query documents again when a template lists docs twice`() {
        whenever(jsonSchemaDocumentRepositoryStreaming.streamContentByCaseDefinitionName(CASE_DEFINITION_NAME))
            .thenReturn(Stream.of("""{"firstName":"Anna"}"""), Stream.of("""{"firstName":"Anna"}"""))

        val result = templateService.generate(
            templateName = "docs.csv",
            templateContent = "<#list docs as d>\${d.firstName}</#list>,<#list docs as d>\${d.firstName}</#list>",
            document = document
        )

        assertEquals("Anna,Anna", result)
        verify(jsonSchemaDocumentRepositoryStreaming, times(2)).streamContentByCaseDefinitionName(CASE_DEFINITION_NAME)
    }

    @Test
    fun `should not stream documents when the template does not reference docs`() {
        val result = templateService.generate(
            templateName = "doc.txt",
            templateContent = "\${doc.firstName}",
            document = document
        )

        assertEquals("Klaas", result)
        verifyNoInteractions(jsonSchemaDocumentRepositoryStreaming)
    }

    @Test
    fun `should not stream documents when docs only appears as text`() {
        val result = templateService.generate(
            templateName = "doc.txt",
            templateContent = "Required docs: \${doc.firstName}",
            document = document
        )

        assertEquals("Required docs: Klaas", result)
        verifyNoInteractions(jsonSchemaDocumentRepositoryStreaming)
    }

    @Test
    fun `should close the documents stream when rendering fails`() {
        var closed = false
        whenever(jsonSchemaDocumentRepositoryStreaming.streamContentByCaseDefinitionName(CASE_DEFINITION_NAME))
            .thenReturn(Stream.of("""{"firstName":"Anna"}""").onClose { closed = true })

        assertThrows<Exception> {
            templateService.generate(
                templateName = "docs.txt",
                templateContent = "<#list docs as d>\${d.firstName}</#list>\${zaak.unknown}",
                document = document
            )
        }

        assertTrue(closed)
    }

    @Test
    fun `should not query documents again while resolving placeholders`() {
        whenever(jsonSchemaDocumentRepositoryStreaming.streamContentByCaseDefinitionName(CASE_DEFINITION_NAME))
            .thenReturn(Stream.of("""{"firstName":"Anna"}"""), Stream.of("""{"firstName":"Anna"}"""))
        val resolvedValues = mapOf("zaak:type" to "besluit", "zaak:besluit" to "toegekend")
        whenever(valueResolverService.resolveValues(any<String>(), any<Collection<String>>()))
            .thenAnswer { it.getArgument<Collection<String>>(1).associateWith(resolvedValues::get) }

        // zaak.besluit is only discovered after zaak.type is resolved, so this takes two rounds of resolving
        val result = templateService.generate(
            templateName = "docs.txt",
            templateContent = "<#list docs as d>\${d.firstName}</#list>" +
                "<#if zaak.type == 'besluit'>,\${zaak.besluit}</#if>",
            document = document
        )

        assertEquals("Anna,toegekend", result)
        verify(jsonSchemaDocumentRepositoryStreaming, times(2)).streamContentByCaseDefinitionName(CASE_DEFINITION_NAME)
    }

    @Test
    fun `should generate a template by key without process variables`() {
        val template = ValtimoTemplate(key = "greeting", type = "text", content = "Hi \${doc.firstName}")
        whenever(templateRepository.findOne(any<Specification<ValtimoTemplate>>())).thenReturn(Optional.of(template))

        val result = templateService.generate("greeting", "text", document)

        assertEquals("Hi Klaas", result)
    }

    @Test
    fun `should escape document values in mail and pdf templates`() {
        val document = documentOf("""{"name":"Smith & <Sons>"}""")

        listOf("mail", "pdf").forEach { templateType ->
            val result = templateService.generate(
                templateName = "escape",
                templateContent = "<p>\${doc.name}</p>",
                document = document,
                templateType = templateType,
            )

            assertEquals("<p>Smith &amp; &lt;Sons&gt;</p>", result, templateType)
        }
    }

    @Test
    fun `should not escape document values in text templates`() {
        val result = templateService.generate(
            templateName = "escape",
            templateContent = "\${doc.name}",
            document = documentOf("""{"name":"Smith & <Sons>"}"""),
            templateType = "text",
        )

        assertEquals("Smith & <Sons>", result)
    }

    @Test
    fun `should escape document values in templates generated by key`() {
        val template = ValtimoTemplate(key = "greeting", type = "mail", content = "<p>Hi \${doc.firstName}</p>")
        whenever(templateRepository.findOne(any<Specification<ValtimoTemplate>>())).thenReturn(Optional.of(template))

        val result = templateService.generate("greeting", "mail", documentOf("""{"firstName":"<b>Klaas</b>"}"""))

        assertEquals("<p>Hi &lt;b&gt;Klaas&lt;/b&gt;</p>", result)
    }

    @Test
    fun `should keep generating mail templates that escape with the html built-in`() {
        val result = templateService.generate(
            templateName = "escape",
            templateContent = "<p>\${doc.name?html}</p>",
            document = documentOf("""{"name":"Smith & Sons"}"""),
            templateType = "mail",
        )

        assertEquals("<p>Smith &amp; Sons</p>", result)
    }

    @Test
    fun `should not escape values marked with the no_esc built-in in mail templates`() {
        val result = templateService.generate(
            templateName = "escape",
            templateContent = "<p>\${doc.name?no_esc}</p>",
            document = documentOf("""{"name":"<b>Smith</b>"}"""),
            templateType = "mail",
        )

        assertEquals("<p><b>Smith</b></p>", result)
    }

    @Test
    fun `should not create a template with a key that can't be used in a URL`() {
        listOf("", " ", "a/b").forEach { key ->
            assertThrows<IllegalArgumentException>(key) {
                templateService.createTemplate(key, CASE_DEFINITION_NAME, "text", emptyMap())
            }
        }
    }

    @Test
    fun `should not create a template of a type no plugin uses`() {
        assertThrows<IllegalArgumentException> {
            templateService.createTemplate("letter", CASE_DEFINITION_NAME, "html", emptyMap())
        }
    }

    @Test
    fun `should not instantiate classes when the application configures FreeMarker itself`() {
        val templateService = TemplateService(
            templateRepository = templateRepository,
            objectMapper = ObjectMapper(),
            valueResolverService = valueResolverService,
            freemarkerConfiguration = Configuration(Configuration.VERSION_2_3_32).apply {
                newBuiltinClassResolver = TemplateClassResolver.UNRESTRICTED_RESOLVER
            },
            jsonSchemaDocumentRepositoryStreaming = jsonSchemaDocumentRepositoryStreaming
        )

        val exception = assertThrows<Exception> {
            templateService.generate(
                templateName = "unsafe",
                templateContent = "<#assign ex = 'freemarker.template.utility.Execute'?new()>\${ex('id')}",
            )
        }

        assertTrue(exception.message!!.contains("Execute"), exception.message)
    }

    @Test
    fun `should show a missing placeholder whose path repeats a name`() {
        val result = templateService.generate(
            templateName = "repeat",
            templateContent = "\${pv.a.a}",
            missingPlaceholderStrategy = MissingPlaceholderStrategy.SHOW_MISSING_PLACEHOLDER,
        )

        assertEquals("\${pv.a.a}", result)
    }

    @Test
    fun `should keep document values with tabs, line breaks and quotes in one csv field`() {
        val values = listOf("Main St 1\nAmsterdam", "a\tb", "\"Bob\" Jr", "O\"Brien", "C:\\new", "plain")
        val document = documentOf(ObjectMapper().writeValueAsString(mapOf("values" to values)))

        // the second column combines a value with other text
        val csv = templateService.generate(
            templateName = "values",
            templateContent = "value\tcombined\n<#list doc.values as value>\${value}\t\${value} (\${value})\n</#list>",
            document = document,
            templateType = "csv",
        )
        val out = ByteArrayOutputStream()
        DocumentGeneratorPlugin(mock(), mock(), mock()).generateCsv(csv, out)

        val records = CSVFormat.TDF.parse(StringReader(out.toString(Charsets.UTF_8))).records
        assertEquals(listOf("value") + values, records.map { it[0] })
        assertEquals(listOf("combined") + values.map { "$it ($it)" }, records.map { it[1] })
        assertTrue(records.all { it.size() == 2 })
    }

    private fun documentOf(content: String): JsonSchemaDocument {
        return mock<JsonSchemaDocument>().also {
            whenever(it.id()).thenReturn(DOCUMENT_ID)
            whenever(it.definitionId()).thenReturn(DEFINITION_ID)
            whenever(it.content()).thenReturn(JsonDocumentContent(content))
        }
    }

    companion object {
        private const val CASE_DEFINITION_NAME = "profile"
        private val DOCUMENT_ID = mock<JsonSchemaDocumentId>()
        private val DEFINITION_ID = JsonSchemaDocumentDefinitionId.existingId(CASE_DEFINITION_NAME, 1)
    }
}
