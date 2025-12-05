package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.DUOInfo
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.DUOStudiefinancieringInfoResponse
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.FWI
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.ObjectFactory
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.DuoStudiefinancieringInfoDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import java.io.IOException


class SuwinetDuoStudiefinancieringInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient
) {

    private lateinit var soapClientConfig: SuwinetSOAPClientConfig

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig) {
        this.soapClientConfig = soapClientConfig
    }

    fun createDuoStudiefinancieringService(): DUOInfo {
        val completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH
        return suwinetSOAPClient
            .getService<DUOInfo>(completeUrl,
                soapClientConfig.connectionTimeout,
                soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig)
    }

    fun getStudiefinancieringInfoByBsn(
        bsn: String,
        duoStudiefinancieringInfo: DUOInfo
    ): DuoStudiefinancieringInfoDto {
        logger.info { "Getting DUO studiefinanciering from ${soapClientConfig.baseUrl + SERVICE_PATH}" }

        /* retrieve duo studiefinanciering info by bsn */
        try {
            val studiefinancieringInfoRequest =objectFactory
                .createDUOStudiefinancieringInfo()
                .apply {
                    burgerservicenr = bsn
                }

            val response: DUOStudiefinancieringInfoResponse = duoStudiefinancieringInfo.duoStudiefinancieringInfo(studiefinancieringInfoRequest)
            return response.unwrapResponse(bsn)

        } catch (e: WebServiceException) {
            when (e.cause) {
                is IOException -> {
                    logger.error(e) {
                        "Error connecting to Suwinet while getting DUO studiefinanciering info for BSN $bsn"
                    }
                    throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
                }
                else -> throw e
            }
        }
    }

    private fun DUOStudiefinancieringInfoResponse.unwrapResponse(bsn: String): DuoStudiefinancieringInfoDto {

        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("DUOStudiefinancieringInfoResponse contains no value")

        return when (responseValue) {
            is DUOStudiefinancieringInfoResponse.ClientSuwi -> {
                DuoStudiefinancieringInfoDto(
                    responseValue.burgerservicenr,
                    getStudiefinancieringen(responseValue.studiefinanciering)
                )
            }
            is FWI -> {
                throw SuwinetResultFWIException(
                    responseValue.foutOrWaarschuwingOrInformatie.joinToString { "${it.name} / ${it.value}\n" }
                )
            }
            else -> {
                val nietsGevonden = objectFactory.createNietsGevonden("test")
                if( nietsGevonden.name.equals(content[0].name) ) {
                    return DuoStudiefinancieringInfoDto(bsn, listOf())
                } else {
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
                }
            }
        }
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
        private const val SERVICE_PATH = "DUODossierStudiefinancieringGSD-v0200/v1"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
