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

package com.ritense.valtimoplugins.notifynl.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.notifynl.client.NotifyNlClient
import com.ritense.valtimoplugins.notifynl.domain.StringWrapper
import com.ritense.valtimoplugins.notifynl.domain.email.EmailRequest
import com.ritense.valtimoplugins.notifynl.domain.notification.NotificationRequest
import com.ritense.valtimoplugins.notifynl.domain.notification.SmsRequest
import com.ritense.valtimoplugins.notifynl.domain.template.AllTemplatesRequest
import com.ritense.valtimoplugins.notifynl.domain.template.TemplateRequest
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
        description = "Sends an SMS to a given phone number.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun sendSms(
        execution: DelegateExecution,
        @PluginActionProperty phoneNumber: String,
        @PluginActionProperty templateId: String
    ) {
        val smsRequest = SmsRequest(phoneNumber, templateId)
        val token = tokenGenerationService.generateToken(serviceId, secretKey)
        val smsResponse = notifyNlClient.sendSms(url, smsRequest, token)
        val formattedResponse = smsResponse.formattedResponse(smsRequest)
        println(formattedResponse)
        execution.setVariable("result", StringWrapper(formattedResponse))
    }

    @PluginAction(
        key = "send-email",
        title = "Send E-mail",
        description = "Sends an E-mail to a given recipient.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun sendEmail(
        execution: DelegateExecution,
        @PluginActionProperty email: String,
        @PluginActionProperty templateId: String
    ) {
        val emailRequest = EmailRequest(email, templateId)
        val token = tokenGenerationService.generateToken(serviceId, secretKey)
        val emailResponse = notifyNlClient.sendEmail(url, emailRequest, token)
        val formattedResponse = emailResponse.formattedResponse(emailRequest)
        println(emailResponse.toString())
        execution.setVariable("result", StringWrapper(formattedResponse))
    }

    @PluginAction(
        key = "get-template",
        title = "Get Template By ID",
        description = "Retrieves information about a template for a given ID.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun getTemplate(
        execution: DelegateExecution,
        @PluginActionProperty templateId: String
    ) {
        val templateRequest = TemplateRequest(templateId)
        val token = tokenGenerationService.generateToken(serviceId, secretKey)
        val templateResponse = notifyNlClient.getTemplate(url, templateRequest, token)
        val formattedResponse = templateResponse.formattedResponse(templateRequest)
        println(templateResponse.toString())
        execution.setVariable("result", StringWrapper(formattedResponse))
    }

    @PluginAction(
        key = "get-all-templates",
        title = "Get All Templates",
        description = "Retrieves all templates.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun getAllTemplates(
        execution: DelegateExecution,
        @PluginActionProperty templateType: String
    ) {
        val allTemplatesRequest = AllTemplatesRequest(templateType)
        val token = tokenGenerationService.generateToken(serviceId, secretKey)
        val allTemplatesResponse = notifyNlClient.getAllTemplates(url, allTemplatesRequest, token)
        val formattedResponse = allTemplatesResponse.formattedResponse(allTemplatesRequest)
        println(allTemplatesResponse.toString())
        execution.setVariable("result", StringWrapper(formattedResponse))
    }

    @PluginAction(
        key = "get-message",
        title = "Get Message By ID",
        description = "Retrieves information about a message for a given ID.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun getMessage(
        execution: DelegateExecution,
        @PluginActionProperty notificationId: String
    ) {
        val notificationRequest = NotificationRequest(notificationId)
        val token = tokenGenerationService.generateToken(serviceId, secretKey)
        val messageResponse = notifyNlClient.getMessage(url, notificationRequest, token)
        val formattedResponse = messageResponse.formattedResponse(notificationRequest)
        println(messageResponse.toString())
        execution.setVariable("result", StringWrapper(formattedResponse))
    }
}