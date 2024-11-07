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