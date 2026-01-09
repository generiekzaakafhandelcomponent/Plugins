package com.ritense.valtimoplugins.openklant.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.openklant.model.ContactInformation
import com.ritense.valtimoplugins.openklant.model.CreateKlantContactInformation
import com.ritense.valtimoplugins.openklant.model.KlantContactOptions
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

    @PluginAction(
        key = "post-klantcontact",
        title = "Post klantcontact",
        description = "Sends a new klantContact to OpenKlant",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START],
    )
    fun postKlantContact(
        @PluginActionProperty communicationChannel: String,
        @PluginActionProperty subject: String,
        @PluginActionProperty content: String,
        @PluginActionProperty confidential: Boolean,
        @PluginActionProperty startDateTime: String,
        @PluginActionProperty partijUuid: String,
        @PluginActionProperty initials: String,
        @PluginActionProperty firstName: String,
        @PluginActionProperty inFix: String,
        @PluginActionProperty lastName: String,
        execution: DelegateExecution,
        ) = runBlocking {
        logger.info { "Posting klantcontact: - ${execution.processBusinessKey}" }

        val createKlantContactInformation = CreateKlantContactInformation(
            communicationChannel = communicationChannel,
            subject = subject,
            content = content,
            confidential = confidential,
            startDateTime = startDateTime,
            partijUuid = partijUuid,
            initials = initials,
            firstName = firstName,
            inFix = inFix,
            lastName = lastName
        )

        val properties = OpenKlantProperties(klantinteractiesUrl, token)

        openKlantPluginService.postKlantContact(
            properties,
            createKlantContactInformation
        )
    }

    private suspend fun fetchAndStoreKlantContacts(
        execution: DelegateExecution,
        resultPvName: String,
        pluginProperties: KlantContactOptions,
    ) {
        val klantcontacten = openKlantPluginService.getAllKlantContacten(pluginProperties)
        val contactenMaps = klantcontacten.map { reflectionUtil.deepReflectedMapOf(it) }
        execution.setVariable(resultPvName, contactenMaps)
    }

    companion object {
        private const val OUTPUT_PARTIJ_UUID = "partijUuid"
        private val logger = KotlinLogging.logger { }
    }
}