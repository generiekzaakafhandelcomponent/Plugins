package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOInfo
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOPersoonsInfoResponse
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.FWI
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.ObjectFactory
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.model.DynamicResponseDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils

class SuwinetDuoPersoonsInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val dynamicResponseFactory: DynamicResponseFactory
) {

    lateinit var soapClientConfig: SuwinetSOAPClientConfig

    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun createDuoService(): DUOInfo {
        var completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        if (StringUtils.hasText(suffix)) {
            completeUrl = completeUrl.plus(suffix)
        }
        return suwinetSOAPClient
            .getService<DUOInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout,
                soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getPersoonsInfoByBsn(
        bsn: String,
        duoInfo: DUOInfo,
        dynamicProperties: List<String> = listOf()
    ): DynamicResponseDto? {
        logger.info { "Getting duo persoons Onderwijsovereenkomst from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        try {
            val persoonsInfoRequest = objectFactory
                .createDUOPersoonsInfo()
                .apply {
                    burgerservicenr = bsn
                }
            val response = duoInfo.duoPersoonsInfo(persoonsInfoRequest)
            return response.unwrapResponse(dynamicProperties)

            // SOAPFaultException occur when something is wrong with the request/response
        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting DUO personal info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
            // WebServiceExceptions occur when the service is down
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting DUO personal info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting DUO personal info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        }
    }

    private fun DUOPersoonsInfoResponse.unwrapResponse(dynamicProperties: List<String>): DynamicResponseDto? {

        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("DUOPersoonsInfoResponse contains no value")

        return when (responseValue) {
            is DUOPersoonsInfoResponse.ClientSuwi -> {
                DynamicResponseDto(
                    properties = getAvailableProperties(responseValue),
                    dynamicProperties = getDynamicProperties(responseValue, dynamicProperties)
                )
            }

            is FWI -> {
                throw SuwinetResultFWIException(
                    responseValue.foutOrWaarschuwingOrInformatie.joinToString { "${it.name} / ${it.value}\n" }
                )
            }

            else -> null
        }
    }

    private fun getAvailableProperties(info: Any): List<String> =
        dynamicResponseFactory.toFlatMap(info).keys.toList()

    private fun getDynamicProperties(info: Any, dynamicProperties: List<String>): Map<String, Any?> {
        val propertiesMap: MutableMap<String, Any?> = mutableMapOf()
        val flatMap = dynamicResponseFactory.toFlatMap(info)
        dynamicProperties.forEach { prop ->
            if (flatMap.containsKey(prop)) propertiesMap[prop] = flatMap[prop]
            if (prop.endsWith('*')) {
                val prefixValue = prop.trimEnd('*')
                flatMap.keys.forEach { if (it.startsWith(prefixValue)) propertiesMap[it] = flatMap[it] }
            }
        }
        return dynamicResponseFactory.flatMapToNested(propertiesMap)
    }

    companion object {
        private const val SERVICE_PATH = "DUODossierPersoonGSD-v0300"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
