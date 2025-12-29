package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimoplugins.dkd.rdwdossier.FWI
import com.ritense.valtimoplugins.dkd.rdwdossier.KentekenInfo
import com.ritense.valtimoplugins.dkd.rdwdossier.KentekenInfoResponse
import com.ritense.valtimoplugins.dkd.rdwdossier.ObjectFactory
import com.ritense.valtimoplugins.dkd.rdwdossier.RDW
import com.ritense.valtimoplugins.dkd.rdwdossier.VoertuigbezitInfoPersoonResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.model.MotorvoertuigDto
import com.ritense.valtimoplugins.suwinet.model.SoortVoertuig
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter


const val SUWINET_DATE_PATTERN = "yyyyMMdd"
const val SUWINET_TIME_PATTERN = "HHmmss00"

class SuwinetRdwService(
    private val suwinetSOAPClient: SuwinetSOAPClient
) {
    lateinit var rdwService: RDW
    lateinit var soapClientConfig: SuwinetSOAPClientConfig
    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun getRDWService(): RDW {
        var completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        if (StringUtils.hasText(suffix)) {
            completeUrl = completeUrl.plus(suffix)
        }

        return suwinetSOAPClient
            .getService<RDW>(
                completeUrl,
                soapClientConfig.connectionTimeout,
                soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getVoertuigbezitInfoPersoonByBsn(
        bsn: String,
        rdwService: RDW
    ): MotorvoertuigDto {

        /* configure soap service */
        this.rdwService = rdwService

        logger.info { "retrieving RDW Voertuigen info from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        return try {
            // retrieve voertuigen bezit by bsn
            val kentekens = retrieveVoertuigenBezitInfo(bsn)

            // retrieve voertuigen details from kenteken list
            getVoertuigenDetails(kentekens)

            // SOAPFaultException occur when something is wrong with the request/response
        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting RDW voertuigen info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
            // WebServiceExceptions occur when the service is down
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting RDW voertuigen info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting RDW voertuigen info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        }
    }

    private fun retrieveVoertuigenBezitInfo(bsn: String): List<String> {

        val voertuigbezitInfoPersoonRequest = objectFactory.createVoertuigbezitInfoPersoon()
        voertuigbezitInfoPersoonRequest.burgerservicenr = bsn
        val formatter = DateTimeFormatter.ofPattern("yyyyMMdd")
        val currentDate = LocalDate.now().format(formatter)
        voertuigbezitInfoPersoonRequest.datBPeilperiodeAansprakelijkheid = currentDate
        val response = rdwService.voertuigbezitInfoPersoon(voertuigbezitInfoPersoonRequest)
        return response.unwrapResponse()
    }

    private fun getVoertuigenDetails(kentekens: List<String>) =
        MotorvoertuigDto(
            kentekens.mapNotNull {
                getMotorvoertuigDetails(it)
            }
        )


    private fun getMotorvoertuigDetails(
        kenteken: String
    ) = try {
        retrieveAansprakelijkeInfoFromSuwi(kenteken)?.let { mapToSimpleMotorvoertuig(it) }
    } catch (e: Error) {
        logger.error { "error retrieving: $e" }
        null
    }

    fun mapToSimpleMotorvoertuig(rdwAansprakelijke: KentekenInfoResponse.ClientSuwi.Aansprakelijke?): MotorvoertuigDto.Motorvoertuig {

        val rdwVoertuig = rdwAansprakelijke?.voertuig
        val soortVoertuig = rdwVoertuig?.cdSrtVoertuig?.let { SoortVoertuig.findByCode(it) }
        val soortVoertuigNode = objectMapper.createObjectNode()
        soortVoertuigNode.put("name", soortVoertuig?.naam ?: "Onbekend")
        soortVoertuigNode.put("code", soortVoertuig?.code ?: rdwVoertuig?.cdSrtVoertuig)
        return MotorvoertuigDto.Motorvoertuig(
            kenteken = rdwVoertuig?.kentekenVoertuig ?: "",
            soortMotorvoertuig = soortVoertuigNode,
            merk = rdwVoertuig?.merkVoertuig ?: "",
            model = rdwVoertuig?.typeVoertuig ?: "",
            datumEersteInschrijving = rdwVoertuig?.datEersteInschrijvingVoertuigNat?.let { toDate(it) } ?: "",
            datumRegistratieAansprakelijkheid = rdwAansprakelijke?.datRegistratieAansprakelijkheid?.let { toDate(it) }
                ?: ""
        )
    }

    private fun retrieveAansprakelijkeInfoFromSuwi(
        kenteken: String
    ): KentekenInfoResponse.ClientSuwi.Aansprakelijke? {
        val kentekenInfoRequest = createKentekenRequest(kenteken)
        val rdwResponse = rdwService.kentekenInfo(kentekenInfoRequest)
        var aansprakelijke: KentekenInfoResponse.ClientSuwi.Aansprakelijke? = null
        rdwResponse.unwrapKentekenInfoResponse().forEach {
            when (it) {
                is KentekenInfoResponse.ClientSuwi -> aansprakelijke = it.aansprakelijke.firstOrNull()
                is FWI -> {
                    val msg = it.foutOrWaarschuwingOrInformatie.joinToString { melding ->
                        "${melding.value.code}: ${melding.name} / ${melding.value}\n"
                    }
                    logger.info { "FWI: $msg" }
                }
            }
        }
        return aansprakelijke
    }

    private fun createKentekenRequest(kenteken: String): KentekenInfo? {
        val kentekenInfoRequest = objectFactory.createKentekenInfo()
        kentekenInfoRequest.kentekenVoertuig = kenteken
        val dateFormatter = DateTimeFormatter.ofPattern(SUWINET_DATE_PATTERN)
        kentekenInfoRequest.peildatAansprakelijkheid = LocalDate.now().format(dateFormatter)
        val timeFormatter = DateTimeFormatter.ofPattern(SUWINET_TIME_PATTERN)
        kentekenInfoRequest.peiltijdAansprakelijkheid = LocalDateTime.now().format(timeFormatter)
        return kentekenInfoRequest
    }

    private fun KentekenInfoResponse.unwrapKentekenInfoResponse(): List<Any> {

        if (content.isNullOrEmpty()) {
            throw IllegalStateException("KentekenInfoResponse contains no value")
        }

        return content.mapNotNull {
            when (it.value) {
                is KentekenInfoResponse.ClientSuwi -> it.value as KentekenInfoResponse.ClientSuwi
                is FWI -> it.value as FWI

                else -> {
                    throw IllegalStateException("KentekenInfoResponse value un")
                }
            }
        }
    }

    private fun VoertuigbezitInfoPersoonResponse.unwrapResponse(): List<String> {

        return if (!clientSuwi.isNullOrEmpty()) {
            clientSuwi[0].aansprakelijke.map {
                it.voertuig.kentekenVoertuig
            }
        } else if (fwi != null) {
            throw SuwinetResultFWIException(
                fwi.foutOrWaarschuwingOrInformatie.joinToString { "${it.name} / ${it.value}\n" }
            )
        } else {
            listOf<String>()
        }
    }

    private fun toDateString(date: LocalDate) = date.format(dateOutFormatter)
    private fun toDate(date: String) = toDateString(LocalDate.parse(date, dateInFormatter))

    companion object {
        private const val SERVICE_PATH = "RDWDossierGSD-v0200"
        private const val SUWINET_DATE_IN_PATTERN = "yyyyMMdd"
        private const val DATE_OUT_PATTERN = "yyyy-MM-dd"
        private val dateInFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(SUWINET_DATE_IN_PATTERN)
        private val dateOutFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(DATE_OUT_PATTERN)
        private val objectMapper = jacksonObjectMapper()
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
