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
     */

    package com.ritense.valtimoplugins.valtimollm.plugin

    import com.fasterxml.jackson.module.kotlin.convertValue
    import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
    import com.ritense.document.domain.Document
    import com.ritense.document.domain.impl.JsonSchemaDocumentId
    import com.ritense.document.service.impl.JsonSchemaDocumentService
    import com.ritense.plugin.annotation.Plugin
    import com.ritense.plugin.annotation.PluginAction
    import com.ritense.plugin.annotation.PluginActionProperty
    import com.ritense.plugin.annotation.PluginProperty
    import com.ritense.processlink.domain.ActivityTypeWithEventName
    import com.ritense.valtimoplugins.valtimollm.client.ValtimoLlmSummaryModel
    import com.ritense.valtimoplugins.valtimollm.client.ValtimoLlmTextGenerationModel
    import com.ritense.valtimoplugins.valtimollm.client.valtimollm.StringWrapper
    import freemarker.template.Configuration
    import freemarker.template.Configuration.VERSION_2_3_32
    import freemarker.template.Template
    import org.camunda.bpm.engine.delegate.DelegateExecution
    import java.io.StringWriter
    import java.net.URI
    import java.util.UUID

    @Plugin(
        key = "valtimo-llm",
        title = "Valtimo LLM Plugin",
        description = "Interact with AI agents"
    )
    open class ValtimoLlmPlugin(
        private val valtimoLlmSummaryModel: ValtimoLlmSummaryModel,
        private val valtimoLlmTextGenerationModel: ValtimoLlmTextGenerationModel,
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
            @PluginActionProperty longText: String,
            @PluginActionProperty resultPV: String
        ) {
            valtimoLlmSummaryModel.baseUri = url
            valtimoLlmSummaryModel.token = token
            val result = valtimoLlmSummaryModel.giveSummary(
                longText = longText,
            )

            execution.setVariable(resultPV, StringWrapper(result))
            println("Stored summary result: '$result' in variable $resultPV")
        }

        @PluginAction(
            key = "chat",
            title = "Chat",
            description = "Sends a chat prompt to a AI Agent",
            activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
        )
        open fun chat(
            execution: DelegateExecution,
            @PluginActionProperty interpolatedQuestionPV: String,
            @PluginActionProperty chatAnswerPV: String,
            @PluginActionProperty question: String
        ) {
            valtimoLlmTextGenerationModel.baseUri = url
            valtimoLlmTextGenerationModel.token = token

            // Get the Case
            val id = JsonSchemaDocumentId.existingId(UUID.fromString(execution.businessKey))
            val jsonSchemaDocument = documentService.getDocumentBy(id)
            val interpolatedQuestion = generate(question, jsonSchemaDocument)
            val chatResult = valtimoLlmTextGenerationModel.mistralChat(
                question = interpolatedQuestion,
            )
            execution.setVariable(interpolatedQuestionPV, StringWrapper(interpolatedQuestion))
            execution.setVariable(chatAnswerPV, StringWrapper(chatResult))
        }

        @PluginAction(
            key = "chat-memorize",
            title = "AI chat with Memory",
            description = "Chat with an AI Agent with the ability to reference older answers and questions",
            activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
        )
        open fun chatMemorize(
            execution: DelegateExecution,
            @PluginActionProperty question: String,
            @PluginActionProperty chatAnswerPV: String,
            @PluginActionProperty interpolatedQuestionPV: String,
            @PluginActionProperty previousAnswer: String?,
            @PluginActionProperty previousQuestion: String?,
            @PluginActionProperty maxQandASaved: String?
        ) {
            valtimoLlmTextGenerationModel.baseUri = url
            valtimoLlmTextGenerationModel.token = token

            // Get chat history
            val chatHistoryWrapper = execution.getVariable("chatHistory") as? StringWrapper
            val chatHistory = chatHistoryWrapper?.value ?: ""
            val fullPrompt = "Context:\n$chatHistory\nCurrent Question: $question"

            // Get the Case document
            val documentId = JsonSchemaDocumentId.existingId(UUID.fromString(execution.businessKey))
            val jsonSchemaDocument = documentService.getDocumentBy(documentId)

            // Interpolate question
            val interpolatedQuestion = generate(fullPrompt, jsonSchemaDocument)

            // Ask the AI model
            val chatResult = valtimoLlmTextGenerationModel.mistralChat(interpolatedQuestion)
            if (chatResult.isEmpty()) throw RuntimeException("Empty chat result")

            // Update chat history
            val updatedChatHistory = buildString {
                append(chatHistory)
                if (chatHistory.isNotBlank()) append("\n\n")
                append("Q: $question\n")
                append("A: $chatResult\n")
            }

            // Keep last N Q&A pairs
            val qaPairs = updatedChatHistory.split(Regex("(?=^Q: )", RegexOption.MULTILINE)).filter { it.isNotBlank() }
            val maxSaved = maxQandASaved?.toIntOrNull() ?: 1
            val trimmedHistory = if (qaPairs.size > maxSaved) {
                qaPairs.drop(qaPairs.size - maxSaved).joinToString(separator = "\n")
            } else {
                qaPairs.joinToString(separator = "\n")
            }

            // Save HTML result and formatted history
            execution.setVariable(interpolatedQuestionPV, StringWrapper(interpolatedQuestion))
            execution.setVariable(chatAnswerPV, StringWrapper(chatResult))
            execution.setVariable("chatHistory", StringWrapper(trimmedHistory))

            println("Updated chat history:\n$updatedChatHistory")
            println("Stored chat result: '$chatResult' in variable $chatAnswerPV")
            println("Stored interpolated question: '$interpolatedQuestion' in variable $interpolatedQuestionPV")
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
