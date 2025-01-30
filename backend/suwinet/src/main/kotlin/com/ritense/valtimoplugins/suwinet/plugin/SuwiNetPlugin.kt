package com.ritense.valtimoplugins.suwinet.plugin

import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpInfoService
import java.net.URI
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "suwinet", title = "SuwiNet Plugin", description = "Suwinet plugin description"
)
@Suppress("UNUSED")
class SuwiNetPlugin(
    private val suwinetBrpInfoService: SuwinetBrpInfoService,
) {
    @PluginProperty(key = "baseUrl", secret = false, required = true)
    lateinit var baseUrl: URI

    @PluginProperty(key = "keystorePath", secret = false, required = false)
    var keystorePath: String? = null

    @PluginProperty(key = "keystoreSecret", secret = true, required = false)
    var keystoreSecret: String? = null

    @PluginProperty(key = "truststorePath", secret = false, required = false)
    var truststorePath: String? = null

    @PluginProperty(key = "truststoreSecret", secret = true, required = false)
    var truststoreSecret: String? = null

    @PluginProperty(key = "basicAuthName", secret = false, required = false)
    var basicAuthName: String? = null

    @PluginProperty(key = "basicAuthSecret", secret = true, required = false)
    var basicAuthSecret: String? = null

    @PluginProperty(key = "connectionTimeout", secret = false, required = false)
    var connectionTimeout: Int? = 10

    @PluginProperty(key = "receiveTimeout", secret = false, required = false)
    var receiveTimeout: Int? = 10

    @PluginAction(
        key = "get-brp-persoonsgegevens",
        title = "SuwiNet BRP Persoonsgegevens",
        description = "SuwiNet BRP Persoonsgegevens",
        activityTypes = [SERVICE_TASK_START]
    )
    fun getBrpPersoonsgegevens(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {
        logger.info { "Getting BRP info for case ${execution.businessKey}" }
        require(bsn.isValidBsn()) { "Provided BSN does not pass elfproef" }

        try {
            suwinetBrpInfoService.setConfig(
                getSuwinetSOAPClientConfig()
            )

            suwinetBrpInfoService.getPersoonsgegevensByBsn(
                bsn, suwinetBrpInfoService.getBRPInfo()
            )?.let {
                execution.processInstance.setVariable(
                    resultProcessVariableName, objectMapper.convertValue(it)
                )
            }
        } catch (e: Exception) {
            logger.info("Exiting scope due to nested error.", e)
            return
        }
    }

    @PluginAction(
        key = "get-brp-partner-persoonsgegevens",
        title = "SuwiNet BRP partner gegevens",
        description = "SuwiNet BRP partner gegevens",
        activityTypes = [SERVICE_TASK_START]
    )
    fun getBrpPartnerGegevens(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {
        logger.info { "Getting BRP partner info for case ${execution.businessKey}" }
        require(bsn.isValidBsn()) { "Provided BSN does not pass elfproef" }
        try {
            suwinetBrpInfoService.setConfig(
                getSuwinetSOAPClientConfig()
            )

            suwinetBrpInfoService.getPersoonsgegevensByBsn(
                bsn, suwinetBrpInfoService.getBRPInfo()
            )?.let {
                execution.processInstance.setVariable(
                    resultProcessVariableName, objectMapper.convertValue(it)
                )
            }
        } catch (e: Exception) {
            logger.info("Exiting scope due to nested error.", e)
            return
        }
    }

    @PluginAction(
        key = "get-brp-kinderen-persoonsgegevens",
        title = "SuwiNet BRP kinderen gegevens",
        description = "SuwiNet BRP kinderen gegevens",
        activityTypes = [SERVICE_TASK_START]
    )
    fun getBrpKinderenGegevens(
        @PluginActionProperty kinderenBsns: List<String>,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {
        logger.info { "Getting BRP Kinderen info for case ${execution.businessKey}" }
        try {
            suwinetBrpInfoService.setConfig(
                getSuwinetSOAPClientConfig()
            )

            val kinderen = kinderenBsns.mapNotNull {
                require(it.isValidBsn()) { "Provided BSN does not pass elfproef" }
                suwinetBrpInfoService.getPersoonsgegevensByBsn(
                    it, suwinetBrpInfoService.getBRPInfo()
                )
            }
            kinderen.let {
                if (it.isNotEmpty()) {
                    execution.processInstance.setVariable(
                        resultProcessVariableName, objectMapper.convertValue(it)
                    )
                }
            }
        } catch (e: Exception) {
            logger.info("Exiting scope due to nested error.", e)
            return
        }
    }

    private fun getSuwinetSOAPClientConfig() =
        SuwinetSOAPClientConfig(
            baseUrl = baseUrl.toASCIIString(),
            keystoreCertificatePath = keystorePath,
            keystoreKey = keystoreSecret,
            truststoreCertificatePath = truststorePath,
            truststoreKey = truststoreSecret,
            basicAuthName = basicAuthName,
            basicAuthSecret = basicAuthSecret,
            connectionTimeout = connectionTimeout,
            receiveTimeout = receiveTimeout
        )

    private fun String.isValidBsn(): Boolean {
        val bsnParts: List<Int> = split("").mapNotNull { it.toIntOrNull() }

        return when (bsnParts.isNotEmpty()) {
            true -> bsnParts.reversed().reduceIndexed { index, sum, element ->
                (index + 1) * element + if (index == 1) -1 * sum else sum
            } % 11 == 0

            false -> false
        }
    }

    companion object {
        private val logger = KotlinLogging.logger { }
        private val objectMapper = jacksonObjectMapper().findAndRegisterModules()
    }
}
