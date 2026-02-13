package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.DUOInfo
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.DUOStudiefinancieringInfoResponse
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.FWI
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.ObjectFactory
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.DuoStudiefinancieringInfoDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils


class SuwinetDuoStudiefinancieringInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val dynamicResponseFactory: DynamicResponseFactory
) {

    private lateinit var soapClientConfig: SuwinetSOAPClientConfig

    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun createDuoStudiefinancieringService(): DUOInfo {
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

    fun getStudiefinancieringInfoByBsn(
        bsn: String,
        duoStudiefinancieringInfo: DUOInfo,
        dynamicProperties: List<String> = listOf()
    ): DuoStudiefinancieringInfoDto {
        logger.info { "Getting DUO studiefinanciering from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        /* retrieve duo studiefinanciering info by bsn */
        try {
            val studiefinancieringInfoRequest = objectFactory
                .createDUOStudiefinancieringInfo()
                .apply {
                    burgerservicenr = bsn
                }

            val response: DUOStudiefinancieringInfoResponse =
                duoStudiefinancieringInfo.duoStudiefinancieringInfo(studiefinancieringInfoRequest)
            return response.unwrapResponse(bsn, dynamicProperties)

            // SOAPFaultException occur when something is wrong with the request/response
        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting DUO studiefinanciering info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
            // WebServiceExceptions occur when the service is down
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting DUO studiefinanciering info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting DUO studiefinanciering info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        }
    }

    private fun DUOStudiefinancieringInfoResponse.unwrapResponse(bsn: String, dynamicProperties: List<String>): DuoStudiefinancieringInfoDto {

        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("DUOStudiefinancieringInfoResponse contains no value")

        return when (responseValue) {
            is DUOStudiefinancieringInfoResponse.ClientSuwi -> {
                DuoStudiefinancieringInfoDto(
                    responseValue.burgerservicenr,
                    getStudiefinancieringen(responseValue.studiefinanciering),
                    propertiesMap = getDynamicProperties(responseValue, dynamicProperties),
                    properties = getAvailableProperties(responseValue)
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
                    return DuoStudiefinancieringInfoDto(bsn, listOf())
                } else {
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
                }
            }
        }
    }

    private fun getAvailableProperties(info: Any): List<String> {
        val flatMap = dynamicResponseFactory.toFlatMap(info)
        return flatMap.keys.toList()
    }

    private fun getDynamicProperties(
        info: Any,
        dynamicProperties: List<String>
    ): Map<String, Any?> {
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

    private fun getStudiefinancieringen(studiefinancieringen: List<DUOStudiefinancieringInfoResponse.ClientSuwi.Studiefinanciering>): List<DuoStudiefinancieringInfoDto.Studiefinanciering> {
        return studiefinancieringen.map {
            DuoStudiefinancieringInfoDto.Studiefinanciering(
                it.datBToekenningsperiodeStufi ?: "",
                it.datEToekenningsperiodeStufi ?: "",
                it.cdToekenningBasisbeursStufi ?: "",
                it.indAanvullendeBeursStufi ?: "",
                it.cdStatusPartnertoeslagStufi ?: "",
                it.cdStatusEenOudertoeslagStufi ?: "",
                it.indToekenningWtosVo18 ?: ""
            )
        }
    }

    companion object {
        private const val SERVICE_PATH = "DUODossierStudiefinancieringGSD-v0200"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
