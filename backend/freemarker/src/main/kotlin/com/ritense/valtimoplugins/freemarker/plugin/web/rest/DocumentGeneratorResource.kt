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

package com.ritense.valtimoplugins.freemarker.plugin.web.rest

import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimo.contract.domain.ValtimoMediaType.APPLICATION_JSON_UTF8_VALUE
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy.SHOW_MISSING_PLACEHOLDER
import com.ritense.valtimoplugins.freemarker.plugin.documentgenerator.DocumentGeneratorPlugin
import com.ritense.valtimoplugins.freemarker.plugin.web.rest.dto.TemplatePreviewRequest
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import java.net.URLConnection
import org.springframework.core.io.InputStreamResource
import org.springframework.http.MediaType.APPLICATION_PDF
import org.springframework.http.MediaType.APPLICATION_OCTET_STREAM
import org.springframework.http.MediaType.TEXT_PLAIN
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@SkipComponentScan
@RequestMapping("/api/management", produces = [APPLICATION_JSON_UTF8_VALUE])
class DocumentGeneratorResource(
    private val templateService: TemplateService,
    private val pluginService: PluginService,
) {

    @PostMapping("/v1/template/preview")
    fun getTemplatePreview(
        @RequestBody request: TemplatePreviewRequest,
    ): ResponseEntity<Any> {

        val documentGeneratorPlugin = pluginService.createInstance(DocumentGeneratorPlugin::class.java) { true }!!

        val preview = templateService.generate(
            templateName = request.fileName,
            templateContent = request.content,
            missingPlaceholderStrategy = SHOW_MISSING_PLACEHOLDER
        )

        val fileMediaType = try {
            MediaType.valueOf(URLConnection.guessContentTypeFromName(request.fileName))
        } catch (ignore: RuntimeException) {
            APPLICATION_OCTET_STREAM
        }

        val response = ResponseEntity.ok()
            .header("Content-Disposition", "attachment;filename=${request.fileName}")
            .contentType(fileMediaType)

        return if (fileMediaType == APPLICATION_PDF) {
            response.body(InputStreamResource(documentGeneratorPlugin.generatePdf(preview)))
        } else if (fileMediaType.subtype == "csv") {
            response.body(InputStreamResource(documentGeneratorPlugin.generateCsv(preview)))
        } else {
            response.body(preview.toByteArray())
        }
    }
}
