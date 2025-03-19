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

package com.ritense.valtimoplugins.huggingface.plugin

import com.fasterxml.jackson.core.JsonPointer
import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.document.domain.Document
import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.document.domain.impl.request.ModifyDocumentRequest
import com.ritense.document.service.impl.JsonSchemaDocumentService
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.huggingface.client.HuggingFaceSummaryModel
import com.ritense.valtimoplugins.huggingface.client.HuggingFaceTextGenerationModel
import freemarker.template.Configuration
import freemarker.template.Configuration.VERSION_2_3_32
import freemarker.template.Template
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.io.StringWriter
import java.net.URI
import java.util.UUID

@Plugin(
    key = "hugging-face",
    title = "Hugging Face Plugin",
    description = "Chat with AI agent"
)
open class HuggingFacePlugin(
    private val huggingFaceSummaryModel: HuggingFaceSummaryModel,
    private val huggingFaceTextGenerationModel: HuggingFaceTextGenerationModel,
    private val documentService: JsonSchemaDocumentService,
) {

    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "token", secret = true)
    lateinit var token: String

    @PluginAction(
        key = "give-summary",
        title = "Give summary",
        description = "Make a summary of a long text",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun giveSummary(
        execution: DelegateExecution,
        @PluginActionProperty longText: String
    ) {
        huggingFaceSummaryModel.baseUri = url
        huggingFaceSummaryModel.token = token
        val result = huggingFaceSummaryModel.giveSummary(
            longText = longText,
        )
        execution.setVariable("answer", result)
    }

    @PluginAction(
        key = "chat",
        title = "Chat",
        description = "Sends a chat prompt to the Gemma Agent",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun chat(
        execution: DelegateExecution,
        @PluginActionProperty caseKey: String,
        @PluginActionProperty question: String
    ) {
        huggingFaceTextGenerationModel.baseUri = url
        huggingFaceTextGenerationModel.token = token

        // Get the Case
        val id = JsonSchemaDocumentId.existingId(UUID.fromString(execution.businessKey))
        val jsonSchemaDocument = documentService.getDocumentBy(id)
        val interpolatedQuestion = generate(question, jsonSchemaDocument)
        val chatResult = huggingFaceTextGenerationModel.chat(
            question = interpolatedQuestion,
        )
        execution.setVariable("question", interpolatedQuestion)
        execution.setVariable("answer", chatResult)

        val documentUpdate = jacksonObjectMapper().createObjectNode().apply {
            put("chatResult", chatResult)
        }
        val result = documentService.modifyDocument(ModifyDocumentRequest.create(jsonSchemaDocument, documentUpdate))
        result.resultingDocument().orElseThrow {
            val errors = result.errors().joinToString(", ") { it.asString() }
            RuntimeException("failed to update document $errors")
        }
    }

    fun generate(
        templateAsString: String,
        document: Document
    ): String {
        val dataModel = mutableMapOf<String, Any?>(
            "doc" to jacksonObjectMapper().convertValue<Map<String, Any?>>(document.content().asJson()),
        )
        val configuration = Configuration(VERSION_2_3_32)
        configuration.logTemplateExceptions = false
        val template = Template(UUID.randomUUID().toString(), templateAsString, configuration)
        val writer = StringWriter()
        template.createProcessingEnvironment(dataModel, writer).process()
        return writer.toString()
    }
}
