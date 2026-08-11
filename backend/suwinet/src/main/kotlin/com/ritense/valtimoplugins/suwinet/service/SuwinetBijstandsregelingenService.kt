package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfo
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfoResponse
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfoResponse.ClientSuwi
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.FWI
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.ObjectFactory
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.DynamicResponseDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils

class SuwinetBijstandsregelingenService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val dynamicResponseFactory: DynamicResponseFactory
) {
    lateinit var soapClientConfig: SuwinetSOAPClientConfig

    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun createBijstandsregelingenService(): BijstandsregelingenInfo {
        var completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        if (StringUtils.hasText(suffix)) {
            completeUrl = completeUrl.plus(suffix)
        }

        return suwinetSOAPClient
            .getService<BijstandsregelingenInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout, soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getBijstandsregelingenByBsn(
        bsn: String,
        infoService: BijstandsregelingenInfo,
        dynamicProperties: List<String>,
    ): DynamicResponseDto? {
        logger.info { "Getting Bijstandsregelingen from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        try {
            val bijstandsregelingenInfoRequest = ObjectFactory().createBijstandsregelingenInfo_Type()
                .apply {
                    burgerservicenr = bsn
                }
            val response = infoService.bijstandsregelingenInfo(bijstandsregelingenInfoRequest)

            return response.unwrapResponse(dynamicProperties)

            // SOAPFaultException occur when something is wrong with the request/response
        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting Bijstandsregelingen info" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
            // WebServiceExceptions occur when the service is down
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting Bijstandsregelingen info" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        } catch (e: SuwinetResultFWIException) {
            logger.error(e) { "SuwinetResultFWIException - Error getting Bijstandsregelingen info" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting Bijstandsregelingen info" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        }
    }

    private fun BijstandsregelingenInfoResponse.unwrapResponse(dynamicProperties: List<String>): DynamicResponseDto? {
        val responseValue =
            content.firstOrNull() ?: throw IllegalStateException("BijstandsregelingenInfoResponse contains no value")

        return when (responseValue.value) {
            is ClientSuwi -> {
                val bijstandsRegelingenInfo = responseValue.value as ClientSuwi
                DynamicResponseDto(
                    properties = getAvailableProperties(bijstandsRegelingenInfo),
                    dynamicProperties = getDynamicProperties(bijstandsRegelingenInfo, dynamicProperties)
                )
            }

            is FWI -> {
                val fwiResponse = responseValue.value as FWI
                throw SuwinetResultFWIException(fwiResponse.foutOrWaarschuwingOrInformatie.joinToString { "${it.name} / ${it.value}\n" })
            }

            else -> {
                val nietsGevonden = objectFactory.createNietsGevonden("test")
                if (nietsGevonden.name.equals(content[0].name)) {
                    null
                } else {
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
                }
            }
        }
    }

    private fun getAvailableProperties(info: Any): List<String> =
        dynamicResponseFactory.toFlatMap(info).keys.toList()

    private fun getDynamicProperties(info: Any, dynamicProperties: List<String>): Any {
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
        private const val SERVICE_PATH = "Bijstandsregelingen-v0500"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
