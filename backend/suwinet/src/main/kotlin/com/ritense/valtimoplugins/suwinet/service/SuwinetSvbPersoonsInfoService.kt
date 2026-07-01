package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.FWI
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.ObjectFactory
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBInfo
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBPersoonsInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.DynamicResponseDto
import com.ritense.valtimoplugins.suwinet.util.PeriodFilter
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import java.time.LocalDate
import org.springframework.util.StringUtils

class SuwinetSvbPersoonsInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val dynamicResponseFactory: DynamicResponseFactory
) {

    private lateinit var soapClientConfig: SuwinetSOAPClientConfig
    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun createSvbInfo(): SVBInfo {
        var completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        if (StringUtils.hasText(suffix)) {
            completeUrl = completeUrl.plus(suffix)
        }

        return suwinetSOAPClient
            .getService<SVBInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout,
                soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getPersoonsgegevensByBsn(
        bsn: String,
        svbInfo: SVBInfo,
        dynamicProperties: List<String> = listOf(),
        periodStart: LocalDate? = null,
        periodEnd: LocalDate? = null
    ): DynamicResponseDto? {

        logger.info { "Getting SVB PersoonsInfo from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        try {
            val svbInfoRequest = objectFactory
                .createSVBPersoonsInfo()
                .apply {
                    burgerservicenr = bsn
                }
            val response = svbInfo.svbPersoonsInfo(svbInfoRequest)
            return response.unwrapResponse(dynamicProperties, periodStart, periodEnd)

            // SOAPFaultException occur when something is wrong with the request/response
        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting SVB Persoons info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
            // WebServiceExceptions occur when the service is down
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting SVB Persoons info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting SVB Persoons info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        }
    }

    private fun SVBPersoonsInfoResponse.unwrapResponse(
        dynamicProperties: List<String>,
        periodStart: LocalDate? = null,
        periodEnd: LocalDate? = null
    ): DynamicResponseDto? {

        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("SVBPersoonsInfoResponse contains no value")

        return when (responseValue) {
            is SVBPersoonsInfoResponse.ClientSuwi -> {
                if (periodStart != null && periodEnd != null) {
                    responseValue.applyPeriodFilter(periodStart, periodEnd)
                }
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

            else -> {
                val nietsGevonden = objectFactory.createNietsGevonden("test")
                if (nietsGevonden.name.equals(content[0].name)) {
                    return null
                } else {
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
                }
            }
        }
    }

    /**
     * Mutates the ClientSuwi response in-place: removes uitkeringsverhoudingen and uitkeringsperioden
     * that do not overlap with [periodStart, periodEnd].
     *
     * XSD date fields use yyyyMMdd format (sml:Datum).
     * Field mapping from BodyReaction.xsd:
     *   Uitkeringsverhouding: DatBUitkeringsverhouding / DatEUitkeringsverhouding
     *   Uitkeringsperiode:    DatBUitkeringsperiode / DatEUitkeringsperiode
     */
    private fun SVBPersoonsInfoResponse.ClientSuwi.applyPeriodFilter(
        periodStart: LocalDate,
        periodEnd: LocalDate
    ) {
        uitkeringsverhouding.removeIf { uv ->
            !PeriodFilter.overlaps(
                uv.datBUitkeringsverhouding,
                uv.datEUitkeringsverhouding, periodStart, periodEnd
            )
        }
        uitkeringsverhouding.forEach { uv ->
            uv.uitkeringsperiode.removeIf { up ->
                !PeriodFilter.overlaps(up.datBUitkeringsperiode, up.datEUitkeringsperiode, periodStart, periodEnd)
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
        private const val SERVICE_PATH = "SVBDossierPersoonGSD-v0200"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
