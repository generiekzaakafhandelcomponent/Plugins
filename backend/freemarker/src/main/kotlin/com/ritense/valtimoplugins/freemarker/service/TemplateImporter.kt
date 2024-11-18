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

import com.ritense.importer.ImportRequest
import com.ritense.importer.Importer
import com.ritense.importer.ValtimoImportTypes.Companion.DOCUMENT_DEFINITION
import org.pf4j.Extension
import org.pf4j.ExtensionPoint
import org.springframework.stereotype.Component

@Extension(ordinal = 2)
@Component
class TemplateImporter(
    private val templateDeploymentService: TemplateDeploymentService,
) : Importer, ExtensionPoint {
    override fun type(): String = "template"

    override fun dependsOn(): Set<String> = setOf(DOCUMENT_DEFINITION)

    override fun supports(fileName: String): Boolean = fileName.matches(FILENAME_REGEX)

    override fun import(request: ImportRequest) {
        templateDeploymentService.deploy(request.fileName, request.content.inputStream())
    }

    private companion object {
        val FILENAME_REGEX = """config/template/([^/]+)\.template\.json""".toRegex()
    }
}