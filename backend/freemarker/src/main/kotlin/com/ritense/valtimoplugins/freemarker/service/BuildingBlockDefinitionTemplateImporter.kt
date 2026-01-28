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

package com.ritense.valtimoplugins.freemarker.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.importer.ImportContext.Companion.runImporter
import com.ritense.importer.ImportRequest
import com.ritense.importer.Importer
import com.ritense.importer.ValtimoImportTypes.Companion.BUILDING_BLOCK_DEFINITION
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimo.contract.buildingblock.BuildingBlockDefinitionId
import com.ritense.valtimoplugins.freemarker.model.TemplateDeploymentMetadata
import io.github.oshai.kotlinlogging.KLogger
import io.github.oshai.kotlinlogging.KotlinLogging
import java.io.InputStream
import org.springframework.stereotype.Component

@Component
@SkipComponentScan
class BuildingBlockDefinitionTemplateImporter(
    private val templateService: TemplateService,
    private val objectMapper: ObjectMapper,
) : Importer {
    override fun type(): String = "buildingblocktemplate"

    override fun dependsOn(): Set<String> = setOf(BUILDING_BLOCK_DEFINITION)

    override fun supports(fileName: String): Boolean = fileName.matches(FILENAME_REGEX)

    override fun import(request: ImportRequest): Unit = runImporter {
        deploy(request.fileName, request.content.inputStream(), request.buildingBlockDefinitionId!!)
    }

    override fun partOfCaseDefinition() = false

    override fun partOfBuildingBlockDefinition() = true

    private fun deploy(
        fileName: String,
        fileContent: InputStream,
        buildingBlockDefinitionId: BuildingBlockDefinitionId
    ) {
        try {
            logger.info { "Deploying template from file '${fileName}'" }
            val template = objectMapper.readValue<TemplateDeploymentMetadata>(fileContent)
            require(template.content != null || template.contentRef != null) {
                "Missing template content in file '${fileName}'"
            }
            val content = template.content
                ?: this::class.java.getResource(template.contentRef!!)!!.readText()

            templateService.saveTemplate(
                templateKey = template.templateKey,
                buildingBlockDefinitionId = buildingBlockDefinitionId,
                templateType = template.templateType,
                metadata = template.metadata ?: emptyMap(),
                content = content
            )
        } catch (e: Exception) {
            throw IllegalStateException("Error while deploying template $fileName", e)
        }
    }

    companion object {
        private val logger: KLogger = KotlinLogging.logger {}
        private val FILENAME_REGEX = """/template/([^/]+)\.template\.json""".toRegex()
    }
}
