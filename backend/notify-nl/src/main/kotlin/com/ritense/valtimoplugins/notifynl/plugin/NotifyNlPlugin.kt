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
import com.ritense.valtimoplugins.notifynl.domain.letter.AddressWrapper
import com.ritense.valtimoplugins.notifynl.domain.letter.LetterRequest
import com.ritense.valtimoplugins.notifynl.domain.letter.SimpleAddress
import com.ritense.valtimoplugins.notifynl.domain.letter.buildPersonalisation
import com.ritense.valtimoplugins.notifynl.domain.letter.toSimpleAddresses
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

    @PluginProperty(key = "apiKey", secret = true)
    lateinit var apiKey: String

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
        val smsRequest = SmsRequest(phoneNumber = phoneNumber, templateId = templateId)
        val token = tokenGenerationService.generateFullToken(apiKey = apiKey)
        val smsResponse = notifyNlClient.sendSms(baseUri = url, body = smsRequest, token = token)
        val formattedResponse = smsResponse.formattedResponse(request = smsRequest)
        execution.setVariable("result", StringWrapper(value = formattedResponse))
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
        val emailRequest = EmailRequest(email = email, templateId = templateId)
        val token = tokenGenerationService.generateFullToken(apiKey = apiKey)
        val emailResponse = notifyNlClient.sendEmail(baseUri = url, body = emailRequest, token = token)
        val formattedResponse = emailResponse.formattedResponse(request = emailRequest)
        execution.setVariable("result", StringWrapper(value = formattedResponse))
    }

    @PluginAction(
        key = "send-letter",
        title = "Send Letter",
        description = "Sends a letter to a given recipient.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun sendLetter(
        execution: DelegateExecution,
        @PluginActionProperty address: List<AddressWrapper>,
        @PluginActionProperty templateId: String
    ) {
        val addressList = address.toSimpleAddresses();
        val personalisation = buildPersonalisation(addresses = addressList)
        val letterRequest = LetterRequest(templateId = templateId, personalisation = personalisation)
        val token = tokenGenerationService.generateFullToken(apiKey = apiKey)
        val letterResponse = notifyNlClient.sendLetter(baseUri = url, body = letterRequest, token = token)
        val formattedResponse = letterResponse.formattedResponse(request = letterRequest)
        execution.setVariable("result", StringWrapper(value = formattedResponse))
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
        val templateRequest = TemplateRequest(templateId = templateId)
        val token = tokenGenerationService.generateFullToken(apiKey = apiKey)
        val templateResponse = notifyNlClient.getTemplate(baseUri = url, body = templateRequest, token = token)
        val formattedResponse = templateResponse.formattedResponse(request = templateRequest)
        execution.setVariable("result", StringWrapper(value = formattedResponse))
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
        val allTemplatesRequest = AllTemplatesRequest(templateType = templateType)
        val token = tokenGenerationService.generateFullToken(apiKey = apiKey)
        val allTemplatesResponse = notifyNlClient.getAllTemplates(baseUri = url, token = token, templateType = templateType)
        val formattedResponse = allTemplatesResponse.formattedResponse(request = allTemplatesRequest)
        execution.setVariable("result", StringWrapper(value = formattedResponse))
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
        val notificationRequest = NotificationRequest(notificationId = notificationId)
        val token = tokenGenerationService.generateFullToken(apiKey = apiKey)
        val messageResponse = notifyNlClient.getMessage(baseUri = url, body = notificationRequest, token = token)
        val formattedResponse = messageResponse.formattedResponse(request = notificationRequest)
        execution.setVariable("result", StringWrapper(value = formattedResponse))
    }
}