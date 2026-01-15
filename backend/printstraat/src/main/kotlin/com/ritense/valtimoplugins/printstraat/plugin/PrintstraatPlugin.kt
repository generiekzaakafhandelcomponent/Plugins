package com.ritense.valtimoplugins.printstraat.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.printstraat.service.PrintstraatService
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI

@Plugin(
    key = "printstraat",
    title = "Printstraat",
    description = "Connects to the Printstraat"
)
class PrintstraatPlugin(
    private val printstraatService: PrintstraatService
) {

    @PluginProperty("url", secret = false)
    lateinit var url: URI

    @PluginProperty("token", secret = true)
    lateinit var token: String

    @PluginAction(
        key = "send-files-to-printstraat",
        title = "Send files to Printstraat",
        description = "Sends the files to Printstraat",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getFilesAndSendToPrintstraat(
        execution: DelegateExecution,
        @PluginActionProperty documentenApiPluginConfigurationId: String,
        @PluginActionProperty documentenListVariableName: String
    ) {
        printstraatService.getFilesAndSendToPrintstraat(
            execution,
            documentenApiPluginConfigurationId,
            documentenListVariableName
        )
    }
}
