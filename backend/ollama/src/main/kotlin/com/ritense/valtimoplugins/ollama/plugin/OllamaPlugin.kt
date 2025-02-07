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

package com.ritense.valtimoplugins.ollama.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.ollama.client.OllamaClient
import java.net.URI
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "ollama",
    title = "Ollama Plugin",
    description = "Post message with the Ollama plugin"
)
open class OllamaPlugin(
    private val ollamaClient: OllamaClient,
) {

    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "languageModel", secret = false)
    lateinit var languageModel: String

    @PluginAction(
        key = "send-prompt",
        title = "Post message",
        description = "Sends a message to an Ollama endpoint",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun postMessage(
        execution: DelegateExecution,
        @PluginActionProperty message: String,
        @PluginActionProperty responseVariable: String,
    ) {
        val response = ollamaClient.sendPrompt(url, languageModel, message)

        //strip think output
        val cleanResponse = response.replace(Regex("<think>[.|\\n]*?</think>\\n*"), "")

        execution.setVariable(responseVariable, cleanResponse)
    }
}
