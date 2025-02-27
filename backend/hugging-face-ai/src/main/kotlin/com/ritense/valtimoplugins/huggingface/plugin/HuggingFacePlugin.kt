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

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.huggingface.client.HuggingFaceClient
import java.net.URI
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "hugging-face-ai",
    title = "Hugging Face AI Plugin",
    description = "Use AI plugin actions in your process"
)
open class HuggingFacePlugin(
    private val huggingFaceClient: HuggingFaceClient,
) {

    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "token", secret = true)
    lateinit var token: String

    @PluginAction(
        key = "summarize-message",
        title = "Summarize message",
        description = "Summarizes the message you send in",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun sendSummarizationRequestToHuggingFace(
        execution: DelegateExecution,
        @PluginActionProperty message: String,
        @PluginActionProperty resultVariable: String,
        @PluginActionProperty path: String
    ) {
        huggingFaceClient.baseUri = url
        huggingFaceClient.token = token
        val result = huggingFaceClient.sendRequestToHuggingFace(
            message = message,
            path = path
        )
        execution.setVariable(resultVariable, result)
    }
}
