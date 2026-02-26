package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.FWI
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.ObjectFactory
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVIkvInfo
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVPersoonsIkvInfo
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVPersoonsIkvInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.DynamicResponseDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils

class SuwinetUwvPersoonsIkvService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val dynamicResponseFactory: DynamicResponseFactory
) {
    private lateinit var soapClientConfig: SuwinetSOAPClientConfig

    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun getUWVIkvInfoService(): UWVIkvInfo {
        var completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        if (StringUtils.hasText(suffix)) {
            completeUrl = completeUrl.plus(suffix)
        }

        return suwinetSOAPClient
            .getService<UWVIkvInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout,
                soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getUWVInkomstenInfoByBsn(
        bsn: String,
        uwvIkvInfoService: UWVIkvInfo,
        dynamicProperties: List<String> = listOf()
    ): DynamicResponseDto {
        logger.info { "Getting UWV inkomsten info from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }
        try {
            val uwvPersoonsIkvInfo: UWVPersoonsIkvInfo = objectFactory
                .createUWVPersoonsIkvInfo()
                .apply {
                    burgerservicenr = bsn
                }

            val uwvPersoonsIkvInfoResponse: UWVPersoonsIkvInfoResponse =
                uwvIkvInfoService.uwvPersoonsIkvInfo(uwvPersoonsIkvInfo)
            return uwvPersoonsIkvInfoResponse.unwrapResponse(dynamicProperties)

        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting UWV inkomsten info" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting UWV inkomsten info" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting UWV inkomsten info" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        }
    }

    private fun UWVPersoonsIkvInfoResponse.unwrapResponse(dynamicProperties: List<String>): DynamicResponseDto {
        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("UWVPersoonsIkvInfoResponse contains no value")

        return when (responseValue) {
            is UWVPersoonsIkvInfoResponse.ClientSuwi -> DynamicResponseDto(
                properties = getAvailableProperties(responseValue),
                dynamicProperties = getDynamicProperties(responseValue, dynamicProperties)
            )

            is FWI -> {
                logger.info { "content: ${content[0].name}" }
                DynamicResponseDto(emptyList(), emptyMap())
            }

            else -> {
                val nietsGevonden = objectFactory.createNietsGevonden("test")
                if (nietsGevonden.name.equals(content[0].name)) {
                    DynamicResponseDto(emptyList(), emptyMap())
                } else {
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
                }
            }
        }
    }

    private fun getAvailableProperties(info: Any): List<String> {
        return dynamicResponseFactory.toFlatMap(info).keys.toList()
    }

    private fun getDynamicProperties(info: Any, dynamicProperties: List<String>): Map<String, Any?> {
        val propertiesMap: MutableMap<String, Any?> = mutableMapOf()
        val flatMap = dynamicResponseFactory.toFlatMap(info)

        dynamicProperties.forEach { prop ->
            if (flatMap.containsKey(prop)) {
                propertiesMap[prop] = flatMap[prop]
            }
            if (prop.endsWith('*')) {
                val prefixValue = prop.trimEnd('*')
                flatMap.keys.forEach {
                    if (it.startsWith(prefixValue)) {
                        propertiesMap[it] = flatMap[it]
                    }
                }
            }
        }

        return dynamicResponseFactory.flatMapToNested(propertiesMap)
    }

    companion object {
        const val SERVICE_PATH = "UWVDossierInkomstenGSD-v0200"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
