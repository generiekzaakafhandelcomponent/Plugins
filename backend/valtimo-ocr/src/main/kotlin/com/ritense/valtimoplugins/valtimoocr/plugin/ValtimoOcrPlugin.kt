/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
 *
 */

package com.ritense.valtimoplugins.valtimoocr.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.valtimoocr.client.MistralOCRModel
import com.ritense.valtimoplugins.valtimoocr.client.mistral.MistralOCRPage
import com.ritense.valtimoplugins.valtimoocr.client.mistral.OCRResult
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI

@Plugin(
    key = "valtimo-ocr",
    title = "Valtimo OCR Plugin",
    description = "Scans images and pdf files using Mistral OCR and converts them to text.",
)
open class ValtimoOcrPlugin(
    private val mistralOCRModel: MistralOCRModel,
) {

    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "token", secret = true)
    lateinit var token: String

    @PluginAction(
        key = "file-to-text",
        title = "File to Text",
        description = "Converts a image or pdf document to text using Mistral OCR",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun fileToText(
        execution: DelegateExecution,
        @PluginActionProperty filePV: String,
        @PluginActionProperty pages: Number?,
        @PluginActionProperty includeImageBase64: Boolean,
        @PluginActionProperty resultPV: String
    ) {
        mistralOCRModel.baseUri = url
        mistralOCRModel.token = token

        val file = execution.getVariable(filePV) as? List<*>
            ?: throw IllegalStateException("No file provided in the process variable $filePV to convert to text.")

        val firstItem = file.firstOrNull().toString()

        val base64Url = Regex("url=(.+?)(?=,\\s*size=)")
            .find(firstItem)?.groupValues?.get(1)
            ?: throw IllegalStateException("Base64 URL not found in: $firstItem")

        val filename = Regex("name=(.+?)-[a-f0-9\\-]{36}\\.pdf")
            .find(firstItem)?.groupValues?.get(1)?.plus(".pdf")

        val mistralOCR: List<MistralOCRPage> = mistralOCRModel.mistralFiletoText(
            fileBase64 = base64Url,
            documentName = filename,
            pages = pages,
            includeImageBase64 = includeImageBase64
        )

        val resultObject = OCRResult(
            documentName = filename,
            pages = mistralOCR.size,
            content = mistralOCR,
            markdownCombined = mistralOCR.joinToString("\n") { it.markdown }
        )

        println("OCR Result: $resultObject")
        execution.setVariable(resultPV, resultObject)
    }
}
