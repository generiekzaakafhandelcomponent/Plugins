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

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.exporter.ExportFile
import com.ritense.exporter.ExportPrettyPrinter
import com.ritense.exporter.ExportResult
import com.ritense.exporter.Exporter
import com.ritense.exporter.request.BuildingBlockDefinitionExportRequest
import com.ritense.valtimoplugins.freemarker.model.TemplateDeploymentMetadata
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@SkipComponentScan
@Transactional(readOnly = true)
class BuildingBlockDefinitionTemplateExporter(
    private val objectMapper: ObjectMapper,
    private val templateService: TemplateService
) : Exporter<BuildingBlockDefinitionExportRequest> {

    override fun supports() = BuildingBlockDefinitionExportRequest::class.java

    override fun export(request: BuildingBlockDefinitionExportRequest): ExportResult {
        val templates = templateService.findTemplates(buildingBlockDefinitionId = request.buildingBlockDefinitionId)

        if (templates.isEmpty()) {
            return ExportResult()
        }

        val formattedBuildingBlockDefinitionVersion = request.buildingBlockDefinitionId.versionTag.let {
            "${it.major}-${it.minor}-${it.patch}"
        }

        val exportFiles = templates.map { template ->
            ExportFile(
                PATH.format(
                    request.buildingBlockDefinitionId.key,
                    formattedBuildingBlockDefinitionVersion,
                    template.key,
                    template.type
                ),
                objectMapper.writer(ExportPrettyPrinter()).writeValueAsBytes(TemplateDeploymentMetadata.of(template))
            )
        }

        return ExportResult(exportFiles.toSet(), setOf())
    }

    companion object {
        private const val PATH = "config/building-block/%s/%s/template/%s-%s.template.json"
    }
}
