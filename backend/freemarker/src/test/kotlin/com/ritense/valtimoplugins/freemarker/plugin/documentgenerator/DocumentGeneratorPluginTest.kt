/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.plugin.documentgenerator

import ch.qos.logback.classic.Level
import ch.qos.logback.classic.Logger
import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.read.ListAppender
import com.ritense.document.domain.Document
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertTimeoutPreemptively
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.impl.context.Context
import org.camunda.bpm.engine.impl.jobexecutor.JobExecutorContext
import org.slf4j.LoggerFactory
import java.io.ByteArrayOutputStream
import java.net.ServerSocket
import java.time.Duration
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class DocumentGeneratorPluginTest {
    private lateinit var templateService: TemplateService
    private lateinit var processDocumentService: ProcessDocumentService
    private lateinit var storageService: TemporaryResourceStorageService
    private lateinit var plugin: DocumentGeneratorPlugin
    private val logger = LoggerFactory.getLogger(DocumentGeneratorPlugin::class.java) as Logger
    private val logged = ListAppender<ILoggingEvent>()

    @BeforeEach
    fun setUp() {
        templateService = mock()
        processDocumentService = mock()
        storageService = mock()
        plugin = DocumentGeneratorPlugin(templateService, processDocumentService, storageService)
        logged.start()
        logger.addAppender(logged)
    }

    @AfterEach
    fun tearDown() {
        logger.detachAppender(logged)
        Context.removeJobExecutorContext()
    }

    @Test
    fun `should generate a pdf`() {
        val out = ByteArrayOutputStream()

        plugin.generatePdf("<html><body><p>Hello world</p></body></html>", out)

        assertTrue(out.toString(Charsets.ISO_8859_1).startsWith("%PDF-"))
    }

    @Test
    fun `should not hang on an image host that does not respond`() {
        // Accepts the connection (via the backlog) but never sends a response
        ServerSocket(0).use { server ->
            val out = ByteArrayOutputStream()

            assertTimeoutPreemptively(Duration.ofSeconds(60)) {
                plugin.generatePdf(
                    "<html><body><img src=\"http://localhost:${server.localPort}/logo.png\"/></body></html>",
                    out,
                )
            }

            assertTrue(out.toString(Charsets.ISO_8859_1).startsWith("%PDF-"))
        }
    }

    @Test
    fun `should leave out an image whose url cannot be resolved`() {
        val out = ByteArrayOutputStream()

        plugin.generatePdf("<html><body><img src=\"http://example.com/a b|c.png\"/></body></html>", out)

        assertTrue(out.toString(Charsets.ISO_8859_1).startsWith("%PDF-"))
    }

    @Test
    fun `should write a csv as UTF-8`() {
        val out = ByteArrayOutputStream()

        plugin.generateCsv("name\tcity\nZoë\tŁódź\n", out)

        assertEquals("name\tcity\r\nZoë\tŁódź\r\n", out.toString(Charsets.UTF_8))
    }

    @Test
    fun `should keep every column of a csv with repeated column names and short rows`() {
        val out = ByteArrayOutputStream()

        plugin.generateCsv("name\tcity\tname\nAnna\tAmsterdam\tBakker\nBram\n", out)

        assertEquals("name\tcity\tname\r\nAnna\tAmsterdam\tBakker\r\nBram\r\n", out.toString(Charsets.UTF_8))
    }

    @Test
    fun `should warn when generating outside the job executor`() {
        plugin.generateCsv(execution(), "report", "reportId")

        val warnings = logged.list.filter { it.level == Level.WARN }
        assertEquals(1, warnings.size)
        assertTrue(warnings.single().formattedMessage.contains("'generate-report'"))
        assertTrue(warnings.single().formattedMessage.contains("asyncBefore"))
    }

    @Test
    fun `should not warn when generating inside the job executor`() {
        Context.setJobExecutorContext(JobExecutorContext())

        plugin.generatePdf(execution(), "report", "reportId")

        assertTrue(logged.list.none { it.level == Level.WARN })
    }

    private fun execution(): DelegateExecution {
        val execution = mock<DelegateExecution>()
        whenever(execution.processInstanceId).thenReturn(UUID.randomUUID().toString())
        whenever(execution.currentActivityId).thenReturn("generate-report")
        whenever(execution.variables).thenReturn(emptyMap())
        val document = mock<Document>()
        whenever(processDocumentService.getDocument(any(), any())).thenReturn(document)
        whenever(templateService.generate(any<String>(), any<String>(), any<Document>(), any(), any()))
            .thenReturn("<html><body>report</body></html>")
        whenever(storageService.store(any(), any())).thenReturn("resource-id")
        return execution
    }
}
