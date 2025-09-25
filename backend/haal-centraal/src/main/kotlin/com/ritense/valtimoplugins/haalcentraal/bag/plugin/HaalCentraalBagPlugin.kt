/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
 *
 */

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
