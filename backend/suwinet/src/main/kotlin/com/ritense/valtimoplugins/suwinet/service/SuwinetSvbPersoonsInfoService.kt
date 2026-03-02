package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.FWI
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.ObjectFactory
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBInfo
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBPersoonsInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.UitkeringenDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils
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
        maxPeriods: Int
    ): UitkeringenDto? {
        this.maxPeriods = maxPeriods

        logger.info { "Getting SVB PersoonsInfo from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        try {
            val svbInfoRequest = objectFactory
                .createSVBPersoonsInfo()
                .apply {
                    burgerservicenr = bsn
                }
            val response = svbInfo.svbPersoonsInfo(svbInfoRequest)
            // retrieve svb info by bsn
            return response.unwrapResponse()

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
    ) = periods.drop(if (periods.size - maxPeriods < 1) 0 else periods.size - maxPeriods)

    private fun getUitkeringen(uitkeringsverhoudingen: List<SVBPersoonsInfoResponse.ClientSuwi.Uitkeringsverhouding>) =
        uitkeringsverhoudingen.map {

            UitkeringenDto.Uitkering(
                codeSzWet = it.szWet.cdSzWet,
                datumBeginUitkeringsverhouding = toDate(it.datBUitkeringsverhouding),
                datumEindUitkeringsverhouding = toDate(it.datEUitkeringsverhouding),
                periodes = getUitkeringsPeriod(it.uitkeringsperiode, it.szWet.cdSzWet)
            )
        }

    private fun getUitkeringsPeriod(
        uitkeringsperiode: List<SVBPersoonsInfoResponse.ClientSuwi.Uitkeringsverhouding.Uitkeringsperiode>,
        codeSzWet: String
    ) =
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
        private const val SERVICE_PATH = "SVBDossierPersoonGSD-v0200"
        private const val suwinetDateInPattern = "yyyyMMdd"
        private val dateInFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(suwinetDateInPattern)

        private const val bbzDateOutPattern = "yyyy-MM-dd"
        private val dateOutFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(bbzDateOutPattern)

        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
