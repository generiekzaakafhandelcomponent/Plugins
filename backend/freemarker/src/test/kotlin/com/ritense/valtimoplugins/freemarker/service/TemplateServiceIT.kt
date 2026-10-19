/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.Document
import com.ritense.document.domain.impl.JsonSchemaDocument
import com.ritense.document.domain.impl.request.NewDocumentRequest
import com.ritense.document.service.DocumentService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimoplugins.freemarker.BaseIntegrationTest
import com.ritense.valtimoplugins.freemarker.domain.ValtimoTemplate
import com.ritense.valtimoplugins.freemarker.repository.JsonSchemaDocumentRepositoryStreaming
import com.ritense.valtimoplugins.freemarker.web.rest.dto.TemplateKeyType
import freemarker.template.TemplateMethodModelEx
import jakarta.persistence.EntityManager
import org.hibernate.Session
import org.hibernate.engine.spi.EntityKey
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.transaction.annotation.Transactional
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

@Transactional
class TemplateServiceIT : BaseIntegrationTest() {

    @Autowired
    lateinit var templateService: TemplateService

    @Autowired
    lateinit var documentService: DocumentService

    @Autowired
    lateinit var jsonSchemaDocumentRepositoryStreaming: JsonSchemaDocumentRepositoryStreaming

    @Autowired
    lateinit var entityManager: EntityManager

    @BeforeEach
    internal fun setUp() {
    }

    @Test
    fun `find a list of possible placeholders`() {
        val template = templateService.getTemplate("placeholder-test-template", null, "mail")

        val placeholders = templateService.findPlaceholders(template.content).keys

        assertEquals(
            setOf(
                "doc:lastname",
                "doc:houseNumber",
                "case:createdBy",
                "case:createdOn",
                "case:definitionId.name",
                "case:definitionId.version",
                "case:id",
                "case:sequence",
                "case:version"
            ), placeholders
        )
    }

    @Test
    fun `should block SSTI payload using the new built-in (GHSA-j2cr-xx4w-m39c)`() {
        val marker = "/tmp/valtimo_fm_rce_poc_${System.nanoTime()}"
        val payload =
            "<#assign ex=\"freemarker.template.utility.Execute\"?new()>\${ex(\"touch $marker\")}"

        var executed = true
        try {
            templateService.generate(
                templateName = "ssti-poc.txt",
                templateContent = payload,
            )
        } catch (e: Exception) {
            // Expected: the restricted class resolver rejects `?new`, so rendering fails.
            executed = false
        }

        assertFalse(executed, "SSTI payload should not render successfully")
        assertFalse(java.io.File(marker).exists(), "SSTI payload must not execute OS commands")
    }

    @Test
    fun `should render a regular template without class instantiation`() {
        val result =
            templateService.generate(
                templateName = "plain.txt",
                templateContent = "Hello \${pv.name}",
                processVariables = mapOf("name" to "world"),
            )

        assertTrue(result.contains("Hello world"))
    }

    @Test
    fun `should list all documents of the same case type`() {
        val document = createDocument("""{ "lastname": "Doe" }""")
        createDocument("""{ "lastname": "Roe" }""")

        val result = templateService.generate(
            templateName = "docs.csv",
            templateContent = "<#list docs as d>\${d.lastname};</#list>",
            document = document,
        )

        assertEquals(setOf("Doe", "Roe"), result.split(';').filter { it.isNotEmpty() }.toSet())
    }

    @Test
    fun `should find a page of template keys`() {
        val page = templateService.findTemplateKeys(
            templateType = "mail",
            pageable = PageRequest.of(0, 1, Sort.by("key")),
        )

        assertEquals(listOf(TemplateKeyType("letter-template", "mail")), page.content)
        assertEquals(2, page.totalElements)
    }

    @Test
    fun `should find template keys of a case definition`() {
        val keys = templateService.findTemplateKeys(
            caseDefinitionName = "profile",
            templateTypes = listOf("mail", "text"),
        )

        assertEquals(
            setOf(
                TemplateKeyType("letter-template", "mail"),
                TemplateKeyType("text-letter-template", "text"),
            ),
            keys.content.toSet()
        )
    }

    @Test
    fun `should not load document entities while listing docs`() {
        val document = createDocument("""{ "lastname": "Doe" }""")
        createDocument("""{ "lastname": "Roe" }""")
        entityManager.flush()
        entityManager.clear()

        val result = templateService.generate(
            templateName = "docs.csv",
            templateContent = "<#list docs as d>\${d.lastname};</#list>",
            document = document,
        )

        assertEquals(setOf("Doe", "Roe"), result.split(';').filter { it.isNotEmpty() }.toSet())
        assertEquals(0, loadedEntityCount(JsonSchemaDocument::class.java))
    }

    @Test
    fun `should stream documents through a database cursor`() {
        // More documents than the fetch size, so the driver can't read the whole result in one go
        val document = createDocument("""{ "lastname": "Doe" }""")
        repeat(500) { createDocument("""{ "lastname": "Roe" }""") }
        entityManager.flush()
        entityManager.clear()
        val openCursors = TemplateMethodModelEx {
            entityManager
                .createNativeQuery("SELECT count(*) FROM pg_cursors WHERE statement NOT ILIKE '%pg_cursors%'")
                .singleResult
                .toString()
        }

        val result = templateService.generate(
            templateName = "docs.txt",
            templateContent = "<#list docs as d><#if d?is_first>\${pv.openCursors()}</#if></#list>",
            processVariables = mapOf("openCursors" to openCursors),
            document = document,
        )

        assertEquals("1", result)
    }

    @Test
    @Suppress("DEPRECATION")
    fun `should still stream documents through the deprecated method`() {
        val document = createDocument("""{ "lastname": "Doe" }""")

        val ids = jsonSchemaDocumentRepositoryStreaming
            .streamAllByCaseDefinitionName(document.definitionId().name())
            .use { it.map { d -> d.id() }.toList() }

        assertTrue(ids.contains(document.id()))
    }

    @Test
    fun `should not load templates when finding template keys`() {
        entityManager.clear()

        val keys = templateService.findTemplateKeys(templateType = "mail")

        assertEquals(2, keys.totalElements)
        assertEquals(0, loadedEntityCount(ValtimoTemplate::class.java))
    }

    private fun loadedEntityCount(entityClass: Class<*>): Int =
        entityManager
            .unwrap(Session::class.java)
            .statistics.entityKeys
            .filterIsInstance<EntityKey>()
            .count { it.entityName == entityClass.name }

    private fun createDocument(content: String): Document =
        runWithoutAuthorization {
            documentService
                .createDocument(NewDocumentRequest("profile", MapperSingleton.get().readTree(content)))
                .resultingDocument()
                .orElseThrow()
        }
}
