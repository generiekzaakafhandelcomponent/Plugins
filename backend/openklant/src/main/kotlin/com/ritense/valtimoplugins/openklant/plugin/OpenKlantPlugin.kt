package com.ritense.valtimoplugins.openklant.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.openklant.model.ContactInformation
import com.ritense.valtimoplugins.openklant.model.KlantcontactCreationInformation
import com.ritense.valtimoplugins.openklant.model.KlantcontactOptions
import com.ritense.valtimoplugins.openklant.model.OpenKlantProperties
import com.ritense.valtimoplugins.openklant.model.PartijInformationImpl
import com.ritense.valtimoplugins.openklant.service.OpenKlantService
import com.ritense.valtimoplugins.openklant.util.ReflectionUtil
import kotlinx.coroutines.runBlocking
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI

@Plugin(
    key = "open-klant",
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
        description = "Store contact info in Open Klant",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun storeContactInformation(
        execution: DelegateExecution,
        @PluginActionProperty bsn: String,
        @PluginActionProperty firstName: String,
        @PluginActionProperty inFix: String,
        @PluginActionProperty lastName: String,
        @PluginActionProperty emailAddress: String,
        @PluginActionProperty caseUuid: String,
    ) = runBlocking {
        logger.info { "Store Contactinformation in Open Klant - ${execution.processBusinessKey}" }

        val contactInformation =
            ContactInformation(
                bsn = bsn.trim(),
                voornaam = firstName.trim(),
                voorvoegselAchternaam = inFix.trim(),
                achternaam = lastName.trim(),
                emailadres = emailAddress.trim(),
                zaaknummer = caseUuid.trim(),
            )
        val properties = OpenKlantProperties(klantinteractiesUrl, token)
        val partijUuid = openKlantPluginService.storeContactInformation(properties, contactInformation)

        execution.setVariable(OUTPUT_PARTIJ_UUID, partijUuid)
    }

    @PluginAction(
        key = "get-or-create-partij",
        title = "Get or create Partij",
        description = "Create partij in Open Klant or gets the partij if already exists",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getOrCreatePartij(
        execution: DelegateExecution,
        @PluginActionProperty bsn: String,
        @PluginActionProperty voorletters: String,
        @PluginActionProperty voornaam: String,
        @PluginActionProperty voorvoegselAchternaam: String,
        @PluginActionProperty achternaam: String,
    ) = runBlocking {
        logger.info { "Get or Create partij in Open Klant - ${execution.processBusinessKey}" }

        val partijInformation =
            PartijInformationImpl(
                bsn = bsn.trim(),
                voorletters = voorletters.trim(),
                voornaam = voornaam.trim(),
                voorvoegselAchternaam = voorvoegselAchternaam.trim(),
                achternaam = achternaam.trim(),
            )
        val properties = OpenKlantProperties(klantinteractiesUrl, token)
        val partijUuid =
            openKlantPluginService
                .getOrCreatePartij(properties, partijInformation)
                .uuid

        execution.setVariable(OUTPUT_PARTIJ_UUID, partijUuid)
    }

    @PluginAction(
        key = "get-contact-moments-by-case-uuid",
        title = "Get contact history by case UUID",
        description = "Get contact history by case UUID from Open Klant",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getContactMoments(
        @PluginActionProperty caseUuid: String,
        @PluginActionProperty resultPvName: String,
        execution: DelegateExecution,
    ) = runBlocking {
        logger.info { "Fetching contact history from Open Klant by case UUID: $caseUuid - ${execution.processBusinessKey}" }

        val pluginProperties =
            KlantcontactOptions(
                klantinteractiesUrl,
                token = token,
                objectUuid = caseUuid.trim(),
            )

        fetchKlantcontactenAndStore(
            execution = execution,
            resultPvName = resultPvName,
            pluginProperties = pluginProperties,
        )
    }

    @PluginAction(
        key = "get-contact-moments-by-bsn",
        title = "Get contact history by BSN",
        description = "Get contact history by BSN from Open Klant. Queries the API using the 'partij-identificator object-ID' parameter.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getContactMomentsByBsn(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultPvName: String,
        execution: DelegateExecution,
    ): Unit =
        runBlocking {
            logger.info { "Fetching contact history from Open Klant by BSN number — business key: ${execution.processBusinessKey}" }
            val pluginProperties =
                KlantcontactOptions(
                    klantinteractiesUrl,
                    token = token,
                    bsn = bsn.trim(),
                )

            fetchKlantcontactenAndStore(
                execution = execution,
                resultPvName = resultPvName,
                pluginProperties = pluginProperties,
            )
        }

    @PluginAction(
        key = "get-contact-moments-by-partij-uuid",
        title = "Get contact history by Partij UUID",
        description = "Get contact history by Partij UUID from Open Klant.",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun getContactMomentsByPartijUuid(
        @PluginActionProperty partijUuid: String,
        @PluginActionProperty resultPvName: String,
        execution: DelegateExecution,
    ): Unit =
        runBlocking {
            logger.info { "Fetching contact history from Open Klant by Partij UUID — business key: ${execution.processBusinessKey}" }
            val pluginProperties =
                KlantcontactOptions(
                    klantinteractiesUrl,
                    token = token,
                    partijUuid = partijUuid.trim(),
                )

            fetchKlantcontactenAndStore(
                execution = execution,
                resultPvName = resultPvName,
                pluginProperties = pluginProperties,
            )
        }

    @PluginAction(
        key = "register-klantcontact",
        title = "Register klantcontact",
        description = "Registers a new klantcontact to OpenKlant",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun postKlantContact(
        @PluginActionProperty kanaal: String,
        @PluginActionProperty onderwerp: String,
        @PluginActionProperty inhoud: String,
        @PluginActionProperty vertrouwelijk: String,
        @PluginActionProperty taal: String,
        @PluginActionProperty plaatsgevondenOp: String,
        @PluginActionProperty hasBetrokkene: Boolean,
        @PluginActionProperty partijUuid: String?,
        @PluginActionProperty voorletters: String?,
        @PluginActionProperty voornaam: String?,
        @PluginActionProperty voorvoegselAchternaam: String?,
        @PluginActionProperty achternaam: String?,
        execution: DelegateExecution,
    ) = runBlocking {
        logger.info { "Registering klantcontact - ${execution.processBusinessKey}" }

        val klantcontactCreationInformation =
            KlantcontactCreationInformation(
                kanaal = kanaal.trim(),
                onderwerp = onderwerp,
                inhoud = inhoud,
                vertrouwelijk = vertrouwelijk.trim().toBoolean(),
                taal = taal.trim(),
                plaatsgevondenOp = plaatsgevondenOp.trim(),
                hasBetrokkene = hasBetrokkene,
                partijUuid = partijUuid?.trim(),
                voorletters = voorletters?.trim(),
                voornaam = voornaam?.trim(),
                voorvoegselAchternaam = voorvoegselAchternaam?.trim(),
                achternaam = achternaam?.trim(),
            )

        val properties = OpenKlantProperties(klantinteractiesUrl, token)

        openKlantPluginService.postKlantcontact(
            properties,
            klantcontactCreationInformation,
        )
    }

    private suspend fun fetchKlantcontactenAndStore(
        execution: DelegateExecution,
        resultPvName: String,
        pluginProperties: KlantcontactOptions,
    ) {
        val klantcontacten = openKlantPluginService.getAllKlantcontacten(pluginProperties)
        val contactenMaps = klantcontacten.map { reflectionUtil.deepReflectedMapOf(it) }
        execution.setVariable(resultPvName, contactenMaps)
    }

    companion object {
        private const val OUTPUT_PARTIJ_UUID = "partijUuid"
        private val logger = KotlinLogging.logger { }
    }
}
