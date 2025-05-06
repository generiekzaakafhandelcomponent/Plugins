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

//        peildatum komt al als string binnen, dus we hoeven geen conversie te doen? + het werkt niet
//        val peildatumString = haalCentraalBrpService.getPeildatum(peildatum)

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
