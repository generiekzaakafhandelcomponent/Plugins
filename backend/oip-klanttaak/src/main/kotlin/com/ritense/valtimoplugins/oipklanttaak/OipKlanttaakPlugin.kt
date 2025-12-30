package com.ritense.valtimoplugins.oipklanttaak

import com.ritense.notificatiesapi.NotificatiesApiListener
import com.ritense.notificatiesapi.NotificatiesApiPlugin
import com.ritense.notificatiesapi.domain.Abonnement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.oipklanttaak.domain.DataBinding
import com.ritense.valtimoplugins.oipklanttaak.domain.Koppeling
import com.ritense.valtimoplugins.oipklanttaak.domain.LevelOfAssurance
import com.ritense.valtimoplugins.oipklanttaak.domain.Registratie
import com.ritense.valtimoplugins.oipklanttaak.service.OipKlanttaakService
import io.github.oshai.kotlinlogging.KotlinLogging
import io.github.oshai.kotlinlogging.withLoggingContext
import org.operaton.bpm.engine.delegate.DelegateExecution
import org.operaton.bpm.engine.delegate.DelegateTask
import java.net.URI
import java.time.OffsetDateTime
import java.time.Period
import java.util.UUID

@Plugin(
    key = "oip-klanttaak",
    title = "Open Inwoner Platform (OIP) - Klanttaak",
    description = "Delegate user tasks to the Open Inwoner Platform (OIP) portal so these can be picked up by the registered users of that portal."
)
class OipKlanttaakPlugin(
    private val pluginService: PluginService,
    private val objectManagementService: ObjectManagementService,
    private val oipKlanttaakService: OipKlanttaakService
): NotificatiesApiListener {

    @PluginProperty(key = "notificatiesApiPluginConfiguration", secret = false)
    lateinit var notificatiesApiPluginConfiguration: NotificatiesApiPlugin

    @PluginProperty(key = "objectManagementConfigurationId", secret = false)
    lateinit var objectManagementConfigurationId: UUID

    @PluginProperty(key = "finalizerProcess", secret = false)
    lateinit var finalizerProcess: String

    @PluginAction(
        key = "delegate-task",
        title = "Delegate task",
        description = "Delegates the task to the OIP by creating an object in the Objects API",
        activityTypes = [ActivityTypeWithEventName.USER_TASK_CREATE]
    )
    fun delegateTaskToOip(
        delegateTask: DelegateTask,
        @PluginActionProperty betrokkeneIdentifier: String,
        @PluginActionProperty levelOfAssurance: String,
        @PluginActionProperty formulierUri: String,
        @PluginActionProperty formulierDataMapping: List<DataBinding>? = null,
        @PluginActionProperty toelichting: String? = null,
        @PluginActionProperty koppelingRegistratie: String? = null,
        @PluginActionProperty koppelingIdentifier: String? = null,
        @PluginActionProperty doorlooptijd: String? = null,
        @PluginActionProperty verloopdatum: OffsetDateTime? = null,
        @PluginActionProperty deadlineVerlengbaar: Boolean? = null,
    ) {
        withLoggingContext(DelegateTask::class.java.canonicalName to delegateTask.id) {
            logger.info { "Delegating the task" }
            oipKlanttaakService.delegateTask(
                delegateTask = delegateTask,
                objectManagementId = objectManagementConfigurationId,
                authorizeeIdentifier = betrokkeneIdentifier,
                levelOfAssurance = LevelOfAssurance.entries.single {
                    it.value == levelOfAssurance || it.name == levelOfAssurance
                },
                formUri = URI.create(formulierUri),
                formDataMapping = formulierDataMapping,
                description = toelichting,
                koppeling = koppelingRegistratie?.let {
                    Koppeling(
                        registratie = Registratie.entries.single {
                            it.value == koppelingRegistratie || it.name == koppelingRegistratie
                        },
                        value = UUID.fromString(koppelingIdentifier!!)
                    )
               },
                leadTime = doorlooptijd?.let { Period.parse(it) },
                expirationDate = verloopdatum,
                deadlineExtendable = deadlineVerlengbaar
            )
        }
    }

    @PluginAction(
        key = "complete-delegated-task",
        title = "Complete delegated task",
        description = "Complete the task and update the status of the related object in the Objects Api",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun completeToOipDelegatedTask(
        execution: DelegateExecution,
        @PluginActionProperty bewaarIngediendeGegevens: Boolean = false,
        @PluginActionProperty ontvangenDataMapping: List<DataBinding>? = null,
        @PluginActionProperty koppelDocumenten: Boolean = false,
        @PluginActionProperty pathToDocumenten: String? = null,
    ) {
        withLoggingContext(DelegateExecution::class.java.canonicalName to execution.id) {
            logger.info { "Completing the delegated task." }
            oipKlanttaakService.completeDelegatedTask(
                execution = execution,
                objectManagementId = objectManagementConfigurationId,
                saveReceivedData = bewaarIngediendeGegevens,
                receivedDataMapping = ontvangenDataMapping,
                linkDocuments = koppelDocumenten,
                pathToDocuments = pathToDocumenten
            )
        }
    }

    override fun getNotificatiesApiPlugin(): NotificatiesApiPlugin {
        return notificatiesApiPluginConfiguration
    }

    override fun getKanaalFilters(): List<Abonnement.Kanaal> {
        val objectManagement = objectManagementService.getById(objectManagementConfigurationId)
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
