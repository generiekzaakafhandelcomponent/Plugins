package com.ritense.valtimoplugins.openklant.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.openklant.dto.Klantcontact
import com.ritense.valtimoplugins.openklant.model.ContactInformation
import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.service.OpenKlantService
import com.ritense.valtimoplugins.openklant.util.ReflectionUtil
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
        key = "store-contact-info",
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
    }

    @PluginAction(
        key = "get-contact-moments-by-case-uuid",
        title = "Get contact moments by case UUID",
        description = "Get contact moments by case UUID from OpenKlant",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getContactMoments(
        @PluginActionProperty caseUuid: String,
        @PluginActionProperty resultPvName: String,
        execution: DelegateExecution,
    ) = runBlocking {
        logger.info { "Fetch Contactmomenten from OpenKlant by case UUID: $caseUuid - ${execution.processBusinessKey}" }

        val pluginProperties =
            KlantcontactOptions(
                klantinteractiesUrl,
                token = token,
                objectUuid = caseUuid,
            )

        fetchKlantcontactenAndStore(
            execution = execution,
            resultPvName = resultPvName,
            pluginProperties = pluginProperties,
            fetcher = openKlantPluginService::getAllKlantcontacten,
        )
    }


    @PluginAction(
        key = "get-contact-moments-by-bsn",
        title = "Get contact moments by BSN",
        description = "Get contact moments by BSN from OpenKlant. Queries the API using the 'partij-identificator object-ID' parameter.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getContactMomentsByBsn(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultPvName: String,
        execution: DelegateExecution,
    ): Unit =
        runBlocking {
            logger.info { "Fetching Contactmomenten from OpenKlant by case BSN: $bsn - ${execution.processBusinessKey}" }

            val pluginProperties =
                KlantcontactOptions(
                    klantinteractiesUrl,
                    token = token,
                    bsn = bsn,
                )

            fetchKlantcontactenAndStore(
                execution = execution,
                resultPvName = resultPvName,
                pluginProperties = pluginProperties,
                fetcher = openKlantPluginService::getAllKlantcontactenByBsn,
            )
        }

    private suspend fun fetchKlantcontactenAndStore(
        execution: DelegateExecution,
        resultPvName: String,
        pluginProperties: KlantcontactOptions,
        fetcher: suspend (KlantcontactOptions) -> List<Klantcontact>,
    ) {
        val klantcontacten = fetcher(pluginProperties)
        val contactenMaps = klantcontacten.map { reflectionUtil.deepReflectedMapOf(it) }
        execution.setVariable(resultPvName, contactenMaps)
    }

    companion object {
        private const val OUTPUT_PARTIJ_UUID = "partijUuid"
        private val logger = KotlinLogging.logger { }
    }
}