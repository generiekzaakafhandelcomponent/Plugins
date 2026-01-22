/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.oipklanttaak.plugin

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
import com.ritense.valtimoplugins.oipklanttaak.dto.DataBinding
import com.ritense.valtimoplugins.oipklanttaak.domain.Koppeling
import com.ritense.valtimoplugins.oipklanttaak.domain.LevelOfAssurance
import com.ritense.valtimoplugins.oipklanttaak.service.OipKlanttaakService
import com.ritense.valtimoplugins.oipklanttaak.ProcessVariables.VERWERKER_TAAK_ID
import com.ritense.valtimoplugins.oipklanttaak.domain.Registratie
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

    @PluginProperty(key = "finalizerProcessIsCaseSpecific", secret = false)
    var finalizerProcessIsCaseSpecific: Boolean = false

    @PluginProperty(key = "finalizerProcess", secret = false)
    lateinit var finalizerProcess: String

    @PluginProperty(key = "caseDefinitionVersion", secret = false, required = false)
    var caseDefinitionVersion: String? = null

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
            logger.info { "Delegating Task(id=${delegateTask.id}, key=${delegateTask.taskDefinitionKey}) to OIP" }
            logger.debug {
                "betrokkeneIdentifier: $betrokkeneIdentifier, " +
                "levelOfAssurance: $levelOfAssurance, " +
                "formulierUri: $formulierUri, " +
                "formulierDataMapping: $formulierDataMapping, " +
                "toelichting: $toelichting, " +
                "koppelingRegistratie: $koppelingRegistratie, " +
                "koppelingIdentifier: $koppelingIdentifier, " +
                "doorlooptijd: $doorlooptijd, " +
                "verloopdatum: $verloopdatum, " +
                "deadlineVerlengbaar: $deadlineVerlengbaar"
            }
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
        @PluginActionProperty padNaarDocumenten: String? = null,
    ) {
        withLoggingContext(DelegateExecution::class.java.canonicalName to execution.id) {
            logger.info {
                "Completing delegated Task(id=${execution.getVariable(VERWERKER_TAAK_ID)}) via " +
                "ProcessInstance(id=${execution.processInstanceId})"
            }
            logger.debug {
                "bewaarIngediendeGegevens: $bewaarIngediendeGegevens, " +
                "ontvangenDataMapping: $ontvangenDataMapping, " +
                "koppelDocumenten: $koppelDocumenten, " +
                "padNaarDocumenten: $padNaarDocumenten"
            }
            oipKlanttaakService.completeDelegatedTask(
                execution = execution,
                objectManagementId = objectManagementConfigurationId,
                saveReceivedData = bewaarIngediendeGegevens,
                receivedDataMapping = ontvangenDataMapping,
                linkDocuments = koppelDocumenten,
                pathToDocuments = padNaarDocumenten
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
