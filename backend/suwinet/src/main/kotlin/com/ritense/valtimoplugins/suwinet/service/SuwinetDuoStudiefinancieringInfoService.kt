package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimo.implementation.dkd.duodossierstudiefinancieringgsd.DUOInfo
import com.ritense.valtimo.implementation.dkd.duodossierstudiefinancieringgsd.DUOStudiefinancieringInfoResponse
import com.ritense.valtimo.implementation.dkd.duodossierstudiefinancieringgsd.FWI
import com.ritense.valtimo.implementation.dkd.duodossierstudiefinancieringgsd.ObjectFactory
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.DuoStudiefinancieringInfoDto
import io.github.oshai.kotlinlogging.KotlinLogging


class SuwinetDuoStudiefinancieringInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient
) {

    private lateinit var soapClientConfig: SuwinetSOAPClientConfig

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig) {
        this.soapClientConfig = soapClientConfig
    }

    fun createDuoStudiefinancieringService(): DUOInfo {
        val completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH
        return suwinetSOAPClient.configureKeystore(
            soapClientConfig.keystoreCertificatePath,
            soapClientConfig.keystoreKey
        )
            .configureTruststore(soapClientConfig.truststoreCertificatePath, soapClientConfig.truststoreKey)
            .configureBasicAuth(soapClientConfig.basicAuthName, soapClientConfig.basicAuthSecret)
            .getService<DUOInfo>(completeUrl,
                soapClientConfig.connectionTimeout,soapClientConfig.receiveTimeout)
    }

    fun getStudiefinancieringInfoByBsn(
        bsn: String,
        duoStudiefinancieringInfo: DUOInfo
    ): DuoStudiefinancieringInfoDto {
        logger.info { "Getting DUO studiefinanciering from ${soapClientConfig.baseUrl + SERVICE_PATH}" }

        /* retrieve duo studiefinanciering info by bsn */
        val result = runCatching {

            val studiefinancieringInfoRequest = objectFactory
                .createDUOStudiefinancieringInfo()
                .apply {
                    burgerservicenr = bsn
                }
            val response = duoStudiefinancieringInfo.duoStudiefinancieringInfo(studiefinancieringInfoRequest)
            response.unwrapResponse(bsn)
        }

        return result.getOrThrow()
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
