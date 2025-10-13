package com.ritense.valtimoplugins.suwinet.plugin

import com.fasterxml.jackson.module.kotlin.convertValue
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.service.SuwinetBrpInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoPersoonsInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetDuoStudiefinancieringInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetKadasterInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetRdwService
import com.ritense.valtimoplugins.suwinet.service.SuwinetSvbPersoonsInfoService
import com.ritense.valtimoplugins.suwinet.service.SuwinetUwvPersoonsIkvService
import java.net.URI
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "suwinet", title = "SuwiNet Plugin", description = "Suwinet plugin description"
)
@Suppress("UNUSED")
class SuwiNetPlugin(
    private val suwinetBrpInfoService: SuwinetBrpInfoService,
    private val suwinetDuoPersoonsInfoService: SuwinetDuoPersoonsInfoService,
    private val suwinetDuoStudiefinancieringInfoService: SuwinetDuoStudiefinancieringInfoService,
    private val suwinetKadasterInfoService: SuwinetKadasterInfoService,
    private val suwinetRdwService: SuwinetRdwService,
    private val suwinetSvbPersoonsInfoService: SuwinetSvbPersoonsInfoService,
    private val suwinetUwvPersoonsIkvService: SuwinetUwvPersoonsIkvService
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

    @PluginAction(
        key = "get-duo-persoonsinfo",
        title = "SuwiNet DUO Persoons Info",
        description = "SuwiNet DUO Persoons Info",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getDUOPersoonsInfo(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {
        require(bsn.isValidBsn()) { "Provided BSN does not pass elfproef" }
        logger.info { "Getting DUO PersoonsInfo for case ${execution.businessKey}" }

        try {
            suwinetDuoPersoonsInfoService.setConfig(
                getSuwinetSOAPClientConfig()
            )

            suwinetDuoPersoonsInfoService.getPersoonsInfoByBsn(
                bsn = bsn, suwinetDuoPersoonsInfoService.createDuoService()
            ).let {
                execution.processInstance.setVariable(
                    resultProcessVariableName,objectMapper.convertValue(it)
                )
            }
        } catch (e: Exception) {
            logger.info("Exiting scope due to nested error.", e)
            return
        }
    }

    @PluginAction(
        key = "get-duo-studiefinanciering",
        title = "SuwiNet DUO studiefinanciering Info",
        description = "SuwiNet DUO studiefinanciering Info",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getDUOStudiefinancieringInfo(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {
        require(bsn.isValidBsn()) { "Provided BSN does not pass elfproef" }
        logger.info { "Getting DUO studiefinanciering for case ${execution.businessKey}" }

        try {
            suwinetDuoStudiefinancieringInfoService.setConfig(
                getSuwinetSOAPClientConfig()
            )

            suwinetDuoStudiefinancieringInfoService.getStudiefinancieringInfoByBsn(
                bsn = bsn,
                suwinetDuoStudiefinancieringInfoService.createDuoStudiefinancieringService()
            ).let {
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
        key = "get-kadastrale-objecten",
        title = "SuwiNet kadaster info",
        description = "SuwiNet Kadaster info",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getKadastraleObjecten(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {
        require(bsn.isValidBsn()) { "Provided BSN does not pass elfproef" }
        logger.info { "Getting kadastrale objecten for case ${execution.businessKey}" }

        try {
            suwinetKadasterInfoService.setConfig(
                getSuwinetSOAPClientConfig()
            )

            suwinetKadasterInfoService.getPersoonsinfoByBsn(
                bsn, suwinetKadasterInfoService.createKadasterService()
            ).let {
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
        key = "get-rdw-voertuigen",
        title = "SuwiNet RDW voertuigen",
        description = "SuwiNet RDW voertuigen plugin action",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getRdwVoertuigen(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultProcessVariableName: String,
        execution: DelegateExecution
    ) {
        require(bsn.isValidBsn()) { "Provided BSN does not pass elfproef" }
        logger.info { "Getting voertuigen for case ${execution.businessKey}" }

        try {
            suwinetRdwService.setConfig(
                getSuwinetSOAPClientConfig()
            )

            suwinetRdwService.getVoertuigbezitInfoPersoonByBsn(
                bsn = bsn, suwinetRdwService.getRDWService()
            ).let {
                if(it.motorVoertuigen.isNotEmpty()) {
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

    @PluginAction(
        key = "get-svb-persoonsinfo",
        title = "SuwiNet SVB Persoonsgegevens",
        description = "SuwiNet SVB Persoonsgegevens",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getSvbPersoonsInfo(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultProcessVariableName: String,
        @PluginActionProperty maxPeriods: Int,
        execution: DelegateExecution
    ) {
        logger.info { "Getting SVB info for case ${execution.businessKey}" }

        try {
            suwinetSvbPersoonsInfoService.setConfig(
                getSuwinetSOAPClientConfig()
            )

            suwinetSvbPersoonsInfoService.getPersoonsgegevensByBsn(
                bsn,
                suwinetSvbPersoonsInfoService.createSvbInfo(),
                maxPeriods
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

    @PluginAction(
        key = "get-uwv-inkomsten-info",
        title = "SuwiNet UWV inkomsten persoon info",
        description = "SuwiNet UWV inkomsten info",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    fun getUWVInkomsteninfo(
        @PluginActionProperty bsn: String,
        @PluginActionProperty resultProcessVariableName: String,
        @PluginActionProperty maxPeriods: Int,
        execution: DelegateExecution
    ) {
        require(bsn.isValidBsn()) { "Provided BSN does not pass elfproef" }

        logger.info { "Getting uwv info for case ${execution.businessKey}" }
        suwinetUwvPersoonsIkvService.setConfig(
            getSuwinetSOAPClientConfig()
        )

        try {
            suwinetUwvPersoonsIkvService.getUWVInkomstenInfoByBsn(
                bsn = bsn,
                suwinetUwvPersoonsIkvService.getUWVIkvInfoService(),
                maxPeriods
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
