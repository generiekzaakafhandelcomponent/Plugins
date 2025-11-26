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
import com.ritense.processdocument.domain.impl.OperatonProcessInstanceId
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_CSV
import com.ritense.valtimoplugins.freemarker.model.TEMPLATE_TYPE_PDF
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import java.io.OutputStream
import java.io.OutputStreamWriter
import java.io.PipedInputStream
import java.io.PipedOutputStream
import java.io.StringReader
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVParser
import org.apache.commons.csv.CSVPrinter
import org.operaton.bpm.engine.delegate.DelegateExecution
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
        val htmlString = generateDocumentContent(execution, templateKey, TEMPLATE_TYPE_PDF)
        val pdfInputStream = PipedInputStream()
        generatePdf(htmlString, PipedOutputStream(pdfInputStream))
        val resourceId = storageService.store(pdfInputStream)
        execution.setVariable(processVariableName, resourceId)
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
        val csvString = generateDocumentContent(execution, templateKey, TEMPLATE_TYPE_CSV)
        val csvInputStream = PipedInputStream()
        generateCsv(csvString, PipedOutputStream(csvInputStream))
        val resourceId = storageService.store(csvInputStream)
        execution.setVariable(processVariableName, resourceId)
    }

    fun generatePdf(htmlString: String, out: OutputStream) {
        val renderer = ITextRenderer()
        with(renderer) {
            sharedContext.isPrint = true
            sharedContext.isInteractive = false
            setDocumentFromString(htmlString)
            layout()
            createPDF(out)
        }
    }

    fun generateCsv(csvString: String, out: OutputStream) {
        val writer = OutputStreamWriter(out)
        val reader = StringReader(csvString)

        val parser = CSVParser.builder()
            .setReader(reader)
            .setFormat(
                CSVFormat.TDF.builder().setHeader()
                    .setSkipHeaderRecord(true).get()
            )
            .get()
        val headers = parser.headerNames

        val printer = CSVPrinter(
            writer,
            CSVFormat.TDF.builder()
                .setHeader(*headers.toTypedArray())
                .get()
        )
        parser.forEach { record ->
            printer.printRecord(headers.map { record[it] })
        }
        printer.flush()
    }

    private fun generateDocumentContent(
        execution: DelegateExecution,
        templateKey: String,
        templateType: String
    ): String {
        val document = processDocumentService.getDocument(
            OperatonProcessInstanceId(execution.processInstanceId),
            execution
        )
        return templateService.generate(
            templateKey = templateKey,
            templateType = templateType,
            document = document,
            processVariables = execution.variables,
        )
    }
}
