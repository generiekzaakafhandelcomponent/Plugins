package com.ritense.valtimoplugins.oiptask

import com.ritense.notificatiesapi.NotificatiesApiListener
import com.ritense.notificatiesapi.NotificatiesApiPlugin
import com.ritense.notificatiesapi.domain.Abonnement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.oiptask.service.OipKlanttaakService
import io.github.oshai.kotlinlogging.KotlinLogging
import io.github.oshai.kotlinlogging.withLoggingContext
import org.operaton.bpm.engine.delegate.DelegateExecution
import org.operaton.bpm.engine.delegate.DelegateTask
import java.net.URI
import java.util.UUID

@Plugin(
    key = "oip-klanttaak",
    title = "Klanttaak voor het OIP",
    description = ""
)
class OipKlanttaakPlugin(
    private val pluginService: PluginService,
    private val objectManagementService: ObjectManagementService,
    private val oipKlanttaakService: OipKlanttaakService
): NotificatiesApiListener {

    @PluginProperty(key = "notificatiesApiPlugin", secret = false)
    lateinit var notificatiesApiPlugin: NotificatiesApiPlugin

    @PluginProperty(key = "objectManagementId", secret = false)
    lateinit var objectManagementId: UUID

    @PluginProperty(key = "finalizerProcess", secret = false)
    lateinit var finalizerProcess: String

    @PluginAction(
        key = "delegate-task-to-oip",
        title = "Delegate task to OIP",
        description = "Delegates the taak to the OIP by creating an OipKlanttaak object in the Objects API",
        activityTypes = [ActivityTypeWithEventName.USER_TASK_CREATE]
    )
    fun delegateTaskToOip(
        delegateTask: DelegateTask
    ) {
        withLoggingContext(DelegateTask::class.java.canonicalName to delegateTask.id) {
            logger.info { "Delegating task to OIP." }
            oipKlanttaakService.delegateTaskToOip(
                delegateTask = delegateTask,
                objectManagementId = objectManagementId,
                portaalFormulierUri = URI.create("TODO")
            )
        }
    }

    @PluginAction(
        key = "complete-to-oip-delegated-task",
        title = "Complete delegated OIP Task",
        description = "Complete the Task and update the status of the related OipKlanttaak object in the Objects Api",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun completeToOipDelegatedTask(
        execution: DelegateExecution
    ) {
        withLoggingContext(DelegateExecution::class.java.canonicalName to execution.id) {
            logger.info { "Completing the to OIP delegated task." }
            oipKlanttaakService.completeToOipDelegatedTask(execution)
        }
    }

    override fun getNotificatiesApiPlugin(): NotificatiesApiPlugin {
        return notificatiesApiPlugin
    }

    override fun getKanaalFilters(): List<Abonnement.Kanaal> {
        val objectManagement = objectManagementService.getById(objectManagementId)
            ?: throw IllegalStateException("Object management not found for portaaltaak")

        val objecttypenApiPlugin = pluginService.createInstance(
            PluginConfigurationId.existingId(objectManagement.objecttypenApiPluginConfigurationId)
        ) as ObjecttypenApiPlugin

        return listOf(
            Abonnement.Kanaal(
                naam = KANAAL_OBJECTEN,
                filters = mapOf(
                    OBJECT_TYPE to "${objecttypenApiPlugin.url}objecttypes/${objectManagement.objecttypeId}",
                    ACTIE to UPDATE
                )
            )
        )
    }

    companion object {
        private val logger = KotlinLogging.logger {}

        private const val KANAAL_OBJECTEN = "objecten"
        private const val OBJECT_TYPE = "objectType"
        private const val ACTIE = "actie"
        private const val UPDATE = "update"
    }
}
