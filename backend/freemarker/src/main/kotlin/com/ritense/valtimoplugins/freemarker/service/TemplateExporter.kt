/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.exporter.ExportFile
import com.ritense.exporter.ExportPrettyPrinter
import com.ritense.exporter.ExportResult
import com.ritense.exporter.Exporter
import com.ritense.exporter.request.DocumentDefinitionExportRequest
import com.ritense.valtimoplugins.freemarker.model.TemplateDeploymentMetadata
import org.pf4j.Extension
import org.pf4j.ExtensionPoint
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Extension(ordinal = 2)
@Component
@Transactional(readOnly = true)
class TemplateExporter(
    private val templateService: TemplateService
) : Exporter<DocumentDefinitionExportRequest>, ExtensionPoint {

    override fun supports() = DocumentDefinitionExportRequest::class.java

    override fun export(request: DocumentDefinitionExportRequest): ExportResult {
        val caseDefinitionName = request.name
        val templates = templateService.findTemplates(caseDefinitionName = caseDefinitionName)
        if (templates.isEmpty()) {
            return ExportResult()
        }

        val templateDeploymentMetadataList = templates.map { template ->
            TemplateDeploymentMetadata(
                templateKey = template.key,
                caseDefinitionName = template.caseDefinitionName,
                templateType = template.type,
                metadata = template.metadata,
                content = template.content,
            )
        }

        val exportFiles = templateDeploymentMetadataList.map { templateMetadata ->
            ExportFile(
                PATH.format(templateMetadata.templateKey, templateMetadata.templateType),
                jacksonObjectMapper().writer(ExportPrettyPrinter()).writeValueAsBytes(templateMetadata)
            )
        }

        return ExportResult(exportFiles.toSet(), setOf())
    }

    companion object {
        private const val PATH = "config/template/%s-%s.template.json"
    }
}