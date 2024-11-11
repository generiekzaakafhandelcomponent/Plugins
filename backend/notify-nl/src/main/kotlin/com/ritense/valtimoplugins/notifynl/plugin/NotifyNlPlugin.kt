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

package com.ritense.valtimoplugins.notifynl.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.notifynl.client.NotifyNlClient
import com.ritense.valtimoplugins.notifynl.domain.SendSmsRequest
import com.ritense.valtimoplugins.notifynl.service.NotifyNlTokenGenerationService
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI
import java.util.UUID

@Plugin(
    key = "notify-nl",
    title = "NotifyNL",
    description = "Plugin for interacting with NotifyNL"
)
open class NotifyNlPlugin(
    private val notifyNlClient: NotifyNlClient,
    private val tokenGenerationService: NotifyNlTokenGenerationService
) {
    @PluginProperty(key = "url", secret = false)
    lateinit var url: URI

    @PluginProperty(key = "serviceId", secret = true)
    lateinit var serviceId: UUID

    @PluginProperty(key = "secretKey", secret = true)
    lateinit var secretKey: UUID

    @PluginAction(
        key = "send-sms",
        title = "Send SMS",
        description = "Sends an SMS",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun sendTextMessage(
        execution: DelegateExecution,
        @PluginActionProperty phoneNumber: String,
        @PluginActionProperty templateId: String
    ) {
        val sendSmsRequest = SendSmsRequest(phoneNumber, templateId)
        val token = tokenGenerationService.generateToken(serviceId, secretKey)
        notifyNlClient.sendSms(url, sendSmsRequest, token)
    }
}