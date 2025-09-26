package com.ritense.valtimoplugins.SamplePlugin.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.SamplePlugin.client.SampleService
import org.springframework.stereotype.Component

/**
 * Sample plugin demonstrating a simple action that interacts with an API endpoint.
 * Note that the key in the @Plugin annotation must be unique, and
 * should be equal to the pluginId in the plugin's frontend configuration.
 */
@Plugin(
    key = "sample-plugin",
    title = "Sample Plugin",
    description = "Test plugin description",
)
@Component
class SamplePlugin(
    private val sampleService: SampleService
) {
    @PluginProperty(key = "api_url", secret = false)
    lateinit var apiUrl: String

    /**
     * Example action
     * Sends a GET request to an API endpoint and returns the response.
     */
    @PluginAction(
        key = "api-sample-action",
        title = "API test action",
        description = "API plugin action",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun pingAPI(): String {
        try {
            println(sampleService.printAPIResults(api_url = apiUrl))
            return sampleService.printAPIResults(api_url = apiUrl)
        } catch (e: Exception) {
            e.printStackTrace()
            println("Error: ${e.cause}")
            return "Error: ${e.message}"
        }
    }

    /**
     * Example action
     * Sends a GET request to an API endpoint and returns the response.
     */
    @PluginAction(
        key = "time-api-sample-action",
        title = "Time API test action",
        description = "Time API plugin action",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getCurrentTime(): String {
        try {
            println(sampleService.printAPIResults(api_url = apiUrl))
            return sampleService.printAPIResults(api_url = apiUrl)
        } catch (e: Exception) {
            e.printStackTrace()
            println("Error: ${e.cause}")
            return "Error: ${e.message}"
        }
    }
}