/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-document-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimoplugins.freemarker.plugin.documentgenerator

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.processdocument.domain.impl.CamundaProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_CSV
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_PDF
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.ByteArrayInputStream
import java.io.ByteArrayOutputStream
import java.io.OutputStream
import java.io.OutputStreamWriter
import java.io.StringReader
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.apache.commons.csv.CSVPrinter
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.impl.context.Context
import org.xhtmlrenderer.pdf.ITextOutputDevice
import org.xhtmlrenderer.pdf.ITextRenderer

@Plugin(
    key = "document-generator",
    title = "Document generator Plugin",
    description = "Create documents with Freemarker"
)
open class DocumentGeneratorPlugin(
    private val templateService: TemplateService,
    private val processDocumentService: ProcessDocumentService,
    private val storageService: TemporaryResourceStorageService,
) {

    @PluginAction(
        key = "generate-pdf",
        title = "Generate PDF",
        description = "Generates PDF based on the template and saves it in a temporary file",
        activityTypes = [SERVICE_TASK_START]
    )
    open fun generatePdf(
        execution: DelegateExecution,
        @PluginActionProperty templateKey: String,
        @PluginActionProperty processVariableName: String
    ) {
        warnIfNotAsync(execution)
        val htmlString = generateDocumentContent(execution, templateKey, TEMPLATE_TYPE_PDF)
        ByteArrayOutputStream().use { outputStream ->
            generatePdf(htmlString, outputStream)
            val resourceId = storageService.store(
                ByteArrayInputStream(outputStream.toByteArray()),
                mapOf(
                    MetadataType.FILE_NAME.key to "$templateKey.pdf",
                    MetadataType.CONTENT_TYPE.key to "pdf"
                )
            )
            execution.setVariable(processVariableName, resourceId)
        }
    }

    @PluginAction(
        key = "generate-csv",
        title = "Generate CSV",
        description = "Generates CSV based on the template and saves it in a temporary file",
        activityTypes = [SERVICE_TASK_START]
    )
    open fun generateCsv(
        execution: DelegateExecution,
        @PluginActionProperty templateKey: String,
        @PluginActionProperty processVariableName: String
    ) {
        warnIfNotAsync(execution)
        val csvString = generateDocumentContent(execution, templateKey, TEMPLATE_TYPE_CSV)
        ByteArrayOutputStream().use { outputStream ->
            generateCsv(csvString, outputStream)
            val resourceId = storageService.store(
                ByteArrayInputStream(outputStream.toByteArray()),
                mapOf(
                    MetadataType.FILE_NAME.key to "$templateKey.csv",
                    MetadataType.CONTENT_TYPE.key to "csv"
                )
            )
            execution.setVariable(processVariableName, resourceId)
        }
    }

    fun generatePdf(htmlString: String, out: OutputStream) {
        val outputDevice = ITextOutputDevice(ITextRenderer.DEFAULT_DOTS_PER_POINT)
        val renderer = ITextRenderer(
            outputDevice,
            TimeoutUserAgent(outputDevice, ITextRenderer.DEFAULT_DOTS_PER_PIXEL),
        )
        val trimmedContent = htmlString.trim()
        val content = when {
            trimmedContent.isBlank() -> "<html><body></body></html>"
            !trimmedContent.contains("<html", ignoreCase = true) -> "<html><body>$trimmedContent</body></html>"
            else -> trimmedContent
        }

        try {
            with(renderer) {
                sharedContext.isPrint = true
                sharedContext.isInteractive = false
                setDocumentFromString(content)
                layout()
                createPDF(out)
            }
        } catch (e: Exception) {
            logger.error(e) { "Failed to generate PDF from HTML: $content" }
            throw e
        }
    }

    fun generateCsv(csvString: String, out: OutputStream) {
        OutputStreamWriter(out, Charsets.UTF_8).use { writer ->
            // Every row as it is, so duplicate or blank column names and short rows don't lose values
            CSVParser.builder()
                .setReader(StringReader(csvString))
                .setFormat(CSV_TEMPLATE_FORMAT)
                .get()
                .use { parser ->
                    val printer = CSVPrinter(writer, CSVFormat.TDF)
                    parser.forEach { record -> printer.printRecord(record) }
                    printer.flush()
                }
        }
    }

    private fun warnIfNotAsync(execution: DelegateExecution) {
        if (Context.getJobExecutorContext() == null) {
            logger.warn {
                "Generating a document in activity '${execution.currentActivityId}' outside the job executor. " +
                    "This blocks the request (and its database connection) that triggered it. " +
                    "Mark the service task as asynchronous (asyncBefore) to run it in the background."
            }
        }
    }

    private fun generateDocumentContent(
        execution: DelegateExecution,
        templateKey: String,
        templateType: String
    ): String {
        val document = processDocumentService.getDocument(
            CamundaProcessInstanceId(execution.processInstanceId),
            execution
        )
        return templateService.generate(
            templateKey = templateKey,
            templateType = templateType,
            document = document,
            processVariables = execution.variables,
        )
    }

    companion object {
        val logger = KotlinLogging.logger {}

        // Reads back the values TsvOutputFormat escaped
        private val CSV_TEMPLATE_FORMAT = CSVFormat.TDF.builder()
            .setEscape('\\')
            .get()
    }
}
