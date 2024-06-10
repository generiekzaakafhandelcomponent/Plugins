package com.ritense.spotler.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.ActivityType
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "spotler",
    title = "Spotler Plugin",
    description = "This plugin allows you to send emails from within a process"
)
class SpotlerPlugin {

    @PluginProperty(key = "clientId", secret = false)
    private lateinit var clientId: String

    @PluginProperty(key = "accountId", secret = false)
    private lateinit var accountId: String

    @PluginProperty(key = "clientSecret", secret = true)
    private lateinit var clientSecret: String

    @PluginAction(
        key = "sendMail",
        title = "Send an Email",
        description = "Use a spotler template to send an email",
        activityTypes = [ActivityType.SERVICE_TASK_START]
    )
    fun sendMail(execution: DelegateExecution) {
        throw NotImplementedError("sendMail has not yet been implemented")
    }

}
