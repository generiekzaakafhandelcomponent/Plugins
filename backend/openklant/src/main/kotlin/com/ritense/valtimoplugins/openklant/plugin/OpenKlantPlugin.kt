package com.ritense.valtimo.openklant.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimo.openklant.model.ContactInformation
import com.ritense.valtimo.openklant.model.KlantContactOptions
import com.ritense.valtimo.openklant.model.OpenKlantProperties
import com.ritense.valtimo.openklant.service.OpenKlantService
import com.ritense.valtimo.openklant.util.ReflectionUtil
import kotlinx.coroutines.runBlocking
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI

@Plugin(
    key = "openklant",
    title = "Open Klant 2 Plugin",
    description = "Open Klant 2 plugin",
)
@Suppress("UNUSED")
class OpenKlantPlugin(
    private val openKlantPluginService: OpenKlantService,
    private val reflectionUtil: ReflectionUtil,
) {
    @PluginProperty(key = "klantinteractiesUrl", secret = false, required = true)
    lateinit var klantinteractiesUrl: URI

    @PluginProperty(key = "token", secret = true, required = true)
    lateinit var token: String

    @PluginAction(
        key = "store-contactinfo",
        title = "Store Contactinfo",
        description = "Store contact info in OpenKlant",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun storeContactInformation(
        execution: DelegateExecution,
        @PluginActionProperty bsn: String,
        @PluginActionProperty firstName: String,
        @PluginActionProperty inFix: String,
        @PluginActionProperty lastName: String,
        @PluginActionProperty emailAddress: String,
        @PluginActionProperty caseNumber: String,
    ) = runBlocking {
        val result =
            runCatching {
                logger.info { "Store Contactinformation in OpenKlant - ${execution.processBusinessKey}" }

                val contactInformation =
                    ContactInformation(
                        bsn = bsn,
                        firstName = firstName,
                        inFix = inFix,
                        lastName = lastName,
                        emailAddress = emailAddress,
                        caseNumber = caseNumber,
                    )
                val properties = OpenKlantProperties(klantinteractiesUrl, token)
                val partijUuid = openKlantPluginService.storeContactInformation(properties, contactInformation)

                execution.setVariable(OUTPUT_PARTIJ_UUID, partijUuid)
            }.onFailure {
                logger.warn { "Failed to store contact information for $firstName with case number $caseNumber" }
                logger.warn { "Failed with message ${it.message}" }
                execution.setVariable(OUTPUT_PARTIJ_UUID, "")
            }
        execution.setVariable(OUTPUT_FAILED_WITH_EXCEPTION, result.isFailure)
    }

    @PluginAction(
        key = "get-contact-moments-by-case",
        title = "Get contact moments by case UUID",
        description = "Get contact moments by case UUID from OpenKlant",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getContactMoments(
        @PluginActionProperty objectUuid: String,
        @PluginActionProperty resultPvName: String,
        execution: DelegateExecution,
    ) = runBlocking {
        logger.info { "Fetch Contactmomenten from OpenKlant by case UUID: $objectUuid - ${execution.processBusinessKey}" }

        val pluginProperties =
            KlantContactOptions(
                klantinteractiesUrl,
                token = token,
                objectUuid = objectUuid,
            )

        fetchAndStoreKlantContacts(execution, resultPvName, pluginProperties)
    }

    private suspend fun fetchAndStoreKlantContacts(
        execution: DelegateExecution,
        resultPvName: String,
        pluginProperties: KlantContactOptions,
    ) {
        val result =
            runCatching {
                val klantcontacten = openKlantPluginService.getAllKlantContacten(pluginProperties)
                val contactenMaps = klantcontacten.map { reflectionUtil.deepReflectedMapOf(it) }
                execution.setVariable(resultPvName, contactenMaps)
            }.onFailure {
                logger.warn { "Failed to get Contactmomenten for klantContactOptions $pluginProperties - ${execution.processBusinessKey}" }
                logger.warn { "Failed with message: ${it.message}" }
            }
        execution.setVariable(OUTPUT_FAILED_WITH_EXCEPTION, result.isFailure)
    }

    companion object {
        private const val OUTPUT_PARTIJ_UUID = "partijUuid"
        private const val OUTPUT_FAILED_WITH_EXCEPTION = "failedWithException"
        private val logger = KotlinLogging.logger { }
    }
}