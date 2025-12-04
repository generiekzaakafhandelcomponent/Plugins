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

package com.ritense.valtimoplugins.valtimos2t.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.valtimos2t.client.MistralVoxtralClient
import org.operaton.bpm.engine.delegate.DelegateExecution
import java.net.URI

const val BASE64_PATTERN = "url=(.+?)(?=,\\s*size=)"
const val FILENAME_PATTERN = "name=(.+?)-[a-f0-9\\-]{36}\\.(mp3|wav|m4a|ogg)"

@Plugin(
    key = "valtimo-s2t",
    title = "Valtimo S2T Plugin",
    description = "Transcribes audio files using Mistral Voxtral.",
)
open class ValtimoS2tPlugin(
    private val mistralVoxtralClient: MistralVoxtralClient,
) {

    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "token", secret = true)
    lateinit var token: String

    @PluginAction(
        key = "speech-to-transcription",
        title = "Speech to Transcription",
        description = "Extracts text from an audio file using Mistral Voxtral.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun speechToTranscription(
        execution: DelegateExecution,
        @PluginActionProperty filePV: String,
        @PluginActionProperty resultPV: String
    ) {
        val file = execution.getVariable(filePV) as? List<*>
            ?: throw IllegalStateException("No file provided in process variable $filePV to transcribe.")

        val firstItem = file.firstOrNull().toString()

        val base64Url = Regex(BASE64_PATTERN)
            .find(firstItem)?.groupValues?.get(1)
            ?: throw IllegalStateException("Base64 URL not found in: $firstItem")

        val filename: String = Regex(FILENAME_PATTERN)
            .find(firstItem)?.groupValues?.get(1)?.plus(".mp3")!!

        val transcription = mistralVoxtralClient.transcribeSpeech(
            fileBase64 = base64Url,
            fileName = filename,
            url = url,
            token = token
        )

        execution.setVariable(resultPV, transcription)
    }
}
