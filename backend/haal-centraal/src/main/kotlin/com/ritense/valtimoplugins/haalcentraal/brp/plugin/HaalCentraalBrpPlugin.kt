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

package com.ritense.valtimoplugins.haalcentraal.brp.plugin

import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.haalcentraal.brp.exception.HcBewoningenNotFoundException
import com.ritense.valtimoplugins.haalcentraal.brp.model.BewoningenRequest
import com.ritense.valtimoplugins.haalcentraal.brp.service.HaalCentraalBrpService
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import mu.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI

@Plugin(
    key = "haalcentraalbrp",
    title = "Haal centraal BRP",
    description = "Haal Centraal BRP plugin",
)

@Suppress("UNUSED")
class HaalCentraalBrpPlugin(
    private val haalCentraalBrpService: HaalCentraalBrpService
) {
    @PluginProperty(key = "brpBaseUrl", secret = false, required = true)
    lateinit var brpBaseUrl: URI

    @PluginProperty(key = "authenticationPluginConfiguration", secret = false, required = true)
    lateinit var authenticationPluginConfiguration: HaalCentraalAuthentication


    @PluginAction(
        key = "hc-brp-get-bewoningen",
        title = "HC BRP get bewoningen with peildatum",
        description = "HC BRP get bewoningen with peildatum",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getBewoningen(
        @PluginActionProperty adresseerbaarObjectIdentificatie: String,
        @PluginActionProperty peildatum: String,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {

        logger.info { "Retrieving bewoningen for case ${execution.businessKey}" }

        try {
            haalCentraalBrpService.getBewoningen(
                baseUrl = brpBaseUrl,
                bewoningenRequest = BewoningenRequest(QUERY_TYPE, adresseerbaarObjectIdentificatie, peildatum),
                authentication = authenticationPluginConfiguration
            )?.let {
                execution.processInstance.setVariable(
                    resultProcessVariableName,
                    objectMapper.convertValue(it)
                )
            }
        } catch (e: HcBewoningenNotFoundException) {
            return
        }
    }

    companion object {
        private val logger = KotlinLogging.logger { }
        private val QUERY_TYPE = "BewoningMetPeildatum"
        private val objectMapper = jacksonObjectMapper().findAndRegisterModules()
    }
}
