package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.FWI
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.ObjectFactory
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBInfo
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBPersoonsInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.UitkeringenDto
import io.github.oshai.kotlinlogging.KotlinLogging

import java.math.BigDecimal
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import kotlin.properties.Delegates

class SuwinetSvbPersoonsInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val codesUitkeringsPeriodeService: CodesUitkeringsperiodeService
) {

    private lateinit var soapClientConfig: SuwinetSOAPClientConfig
    var maxPeriods by Delegates.notNull<Int>()

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig) {
        this.soapClientConfig = soapClientConfig
    }

    fun createSvbInfo(): SVBInfo {
        val completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH
        return suwinetSOAPClient.configureKeystore(
            soapClientConfig.keystoreCertificatePath,
            soapClientConfig.keystoreKey
        )
            .configureTruststore(soapClientConfig.truststoreCertificatePath, soapClientConfig.truststoreKey)
            .configureBasicAuth(soapClientConfig.basicAuthName, soapClientConfig.basicAuthSecret)
            .getService<SVBInfo>(completeUrl,
                soapClientConfig.connectionTimeout,soapClientConfig.receiveTimeout)
    }

    fun getPersoonsgegevensByBsn(
        bsn: String,
        svbInfo: SVBInfo,
        maxPeriods: Int
    ): UitkeringenDto? {
        this.maxPeriods = maxPeriods

        logger.info { "Getting SVB PersoonsInfo from ${soapClientConfig.baseUrl + SERVICE_PATH}" }

        val result = runCatching {
            val svbInfoRequest = objectFactory
                .createSVBPersoonsInfo()
                .apply {
                    burgerservicenr = bsn
                }
            val response = svbInfo.svbPersoonsInfo(svbInfoRequest)
            response.unwrapResponse()
        }
        /* retrieve svb info by bsn */
        return result.getOrThrow()
    }

    private fun SVBPersoonsInfoResponse.unwrapResponse(): UitkeringenDto? {

        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("SVBPersoonsInfoResponse contains no value")

        return when (responseValue) {
            is SVBPersoonsInfoResponse.ClientSuwi ->
                UitkeringenDto(
                    svbUitkeringen = getUitkeringen(responseValue.uitkeringsverhouding)
                )

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

    private fun selectMaxPeriods(
        periods: List<UitkeringenDto.UitkeringPeriode>
    ) = periods.drop(if (periods.size - maxPeriods< 1) 0 else periods.size - maxPeriods)

    private fun getUitkeringen(uitkeringsverhoudingen: List<SVBPersoonsInfoResponse.ClientSuwi.Uitkeringsverhouding>) =
        uitkeringsverhoudingen.map {

            UitkeringenDto.Uitkering(
                codeSzWet = it.szWet.cdSzWet,
                datumBeginUitkeringsverhouding = toDate(it.datBUitkeringsverhouding),
                datumEindUitkeringsverhouding = toDate(it.datEUitkeringsverhouding),
                periodes = getUitkeringsPeriod(it.uitkeringsperiode, it.szWet.cdSzWet)
            )
        }

    private fun getUitkeringsPeriod(uitkeringsperiode: List<SVBPersoonsInfoResponse.ClientSuwi.Uitkeringsverhouding.Uitkeringsperiode>, codeSzWet: String) =
        selectMaxPeriods(
            uitkeringsperiode.map { period ->

                UitkeringenDto.UitkeringPeriode(
                    datumAanvangUitkeringsperiode = toDate(period.datBUitkeringsperiode),
                    datumEindUitkeringsperiode = toDate(period.datEUitkeringsperiode),
                    brutoBedrag = period.brutoUitkeringsbedr.sumOf { BigDecimal(it.waardeBedr) },
                    nettoBedrag = period.nettoUitkeringsbedr.sumOf { BigDecimal(it.waardeBedr) },
                    codeUitkeringsperiode = codesUitkeringsPeriodeService.getCodesUitkeringsperiode(
                        period.nettoUitkeringsbedr.firstOrNull()?.cdUitkeringsperiode ?: ""
                    ),
                    codeMunteenheid = period.nettoUitkeringsbedr.firstOrNull()?.cdMunteenheid ?: "",
                    codeSzWet = codeSzWet
                )
            }
        )

    private fun toDateString(date: LocalDate) = date.format(dateOutFormatter)

    private fun toDate(date: String) = toDateString(LocalDate.parse(date, dateInFormatter))

    companion object {
        private const val SERVICE_PATH = "SVBDossierPersoonGSD-v0200/v1"
        private const val suwinetDateInPattern = "yyyyMMdd"
        private val dateInFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(suwinetDateInPattern)

        private const val bbzDateOutPattern = "yyyy-MM-dd"
        private val dateOutFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(bbzDateOutPattern)

        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
