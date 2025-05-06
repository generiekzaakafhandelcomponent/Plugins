package com.ritense.valtimoplugins.haalcentraal.bag.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.haalcentraal.bag.service.HaalCentraalBagService
import com.ritense.valtimoplugins.haalcentraal.bag.exception.AddressNotFoundException
import com.ritense.valtimoplugins.haalcentraal.bag.model.AddressRequest
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI

@Plugin(
    key = "haalcentraalbag",
    title = "Haal Centraal Bag Plugin",
    description = "Haal Centraal Bag API plugin"
)
@Suppress("UNUSED")
class HaalCentraalBagPlugin(
    private val haalCentraalBagService: HaalCentraalBagService
) {
    @PluginProperty(key = "bagBaseUrl", secret = false, required = true)
    lateinit var bagBaseUrl: URI

    @PluginProperty(key = "authenticationPluginConfiguration", secret = false, required = true)
    lateinit var authenticationPluginConfiguration: HaalCentraalAuthentication

    @PluginAction(
        key = "get-adresseerbaar-object-identificatie",
        title = "Get Adresseerbaar object identificatie",
        description = "Get Adresseerbaar object identificatie",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getAdresseerbaarObjectIdentificatie(
        @PluginActionProperty postcode: String,
        @PluginActionProperty huisnummer: Int,
        @PluginActionProperty huisnummertoevoeging: String?,
        @PluginActionProperty huisletter: String?,
        @PluginActionProperty exacteMatch: Boolean,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {

        logger.info { "Getting AdresseerbaarObjectIdentificatie for case ${execution.businessKey}" }

        try {
            val normalizedPostcode = postcode.replace(" ", "").uppercase()

            haalCentraalBagService.getAdresseerbaarObjectIdentificatie(
                baseUrl = bagBaseUrl,
                addressRequest = AddressRequest(
                    normalizedPostcode,
                    huisnummer,
                    huisnummertoevoeging,
                    huisletter,
                    exacteMatch
                ),
                haalCentraalAuthentication = authenticationPluginConfiguration
            ).let {
                execution.processInstance.setVariable(
                    resultProcessVariableName,
                    it.map { address ->
                        address.adresseerbaarObjectIdentificatie
                    }
                )
            }
        } catch (e: AddressNotFoundException) {
            return
        }

    }

    companion object {
        private val logger = KotlinLogging.logger { }
    }
}
