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
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.DuoPersoonsInfoDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils
import java.time.LocalDate
import java.time.format.DateTimeFormatter

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
    ): DuoPersoonsInfoDto {
        logger.info { "Getting duo persoons Onderwijsovereenkomst from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        try {
            val persoonsInfoRequest = objectFactory
                .createDUOPersoonsInfo()
                .apply {
                    burgerservicenr = bsn
                }
            val response = duoInfo.duoPersoonsInfo(persoonsInfoRequest)
            return response.unwrapResponse(bsn, dynamicProperties)

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

    private fun getOnderwijsOvereenkomsten(onderwijsovereenkomst: List<DUOPersoonsInfoResponse.ClientSuwi.Onderwijsovereenkomst>): List<DuoPersoonsInfoDto.DuoOnderwijsOvereenkomst> {
        return onderwijsovereenkomst.map {
            DuoPersoonsInfoDto.DuoOnderwijsOvereenkomst(
                it.brin.get(0).brinNr,
                it.datInschrijvingOpleiding ?: "",
                it.datUitschrijvingOpleiding ?: "",
                getDeelnameOpleidingen(it.deelnameOpleidingGeregistrDuo)
            )
        }
    }

    private fun getResultaatOpleidingGeregistrDuo(resultaatOpleiding: List<DUOPersoonsInfoResponse.ClientSuwi.ResultaatOpleidingGeregistrDuo>): List<DuoPersoonsInfoDto.ResultaatOpleidingGeregistrDuo> {
        return resultaatOpleiding.map {
            DuoPersoonsInfoDto.ResultaatOpleidingGeregistrDuo(
                codeFaseOpleidingDuo = it.cdFaseOpleidingDuo ?: "",
                inhoudResultaatOpleidingDuo = DuoPersoonsInfoDto.ResultaatOpleidingGeregistrDuo.InhoudResultaatOpleidingDuo(
                    codeNiveauOpleidingDuo = it.inhoudResultaatOpleidingDuo.cdNiveauOpleidingDuo ?: "",
                    naamOpleidingKortDuo = it.inhoudResultaatOpleidingDuo.naamOpleidingKortDuo ?: "",
                ),
                resultaatExamen = DuoPersoonsInfoDto.ResultaatOpleidingGeregistrDuo.ResultaatExamen(
                    datumResultaatExamen = toDate(it.resultaatExamen.datResultaatExamen),
                    codeResultaatExamen = it.resultaatExamen.cdResultaatExamen ?: "",
                ),
            )
        }
    }

    private fun DUOPersoonsInfoResponse.unwrapResponse(bsn: String, dynamicProperties: List<String>): DuoPersoonsInfoDto {

        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("DUOPersoonsInfoResponse contains no value")

        return when (responseValue) {
            is DUOPersoonsInfoResponse.ClientSuwi -> {
                DuoPersoonsInfoDto(
                    responseValue.burgerservicenr,
                    responseValue.indStartkwalificatieDuo ?: "",
                    getOnderwijsOvereenkomsten(responseValue.onderwijsovereenkomst),
                    getResultaatOpleidingGeregistrDuo(responseValue.resultaatOpleidingGeregistrDuo),
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
                    return emptyDuoPersoonsInfoDto(bsn)
                } else {
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
                }
            }
        }
    }

    private fun emptyDuoPersoonsInfoDto(bsn: String) =
        DuoPersoonsInfoDto(
            bsn,
            "",
            listOf<DuoPersoonsInfoDto.DuoOnderwijsOvereenkomst>(),
            listOf<DuoPersoonsInfoDto.ResultaatOpleidingGeregistrDuo>()
        )

    private fun getDeelnameOpleidingen(deelnames: List<DUOPersoonsInfoResponse.ClientSuwi.Onderwijsovereenkomst.DeelnameOpleidingGeregistrDuo>): List<DuoPersoonsInfoDto.DuoOnderwijsOvereenkomst.DeelnameOpleidingGeregistrDuo> {

        return deelnames.map {
            DuoPersoonsInfoDto.DuoOnderwijsOvereenkomst.DeelnameOpleidingGeregistrDuo(
                it.datBDeelnameOpleiding ?: "",
                it.datEDeelnameOpleiding ?: "",
                it.aanduidingLeerjaar ?: "",
                it.cdInschrijvingsvorm ?: "",
                it.cdOnderwijsvorm ?: "",
                it.cdLeerwegMbo ?: "",
                DuoPersoonsInfoDto.DuoOnderwijsOvereenkomst.DeelnameOpleidingGeregistrDuo.InhoudDeelnameOpleidingDuo(
                    it.inhoudDeelnameOpleidingDuo.naamOpleidingKortDuo ?: "",
                    it.inhoudDeelnameOpleidingDuo.cdNiveauOpleidingDuo ?: "",
                    it.inhoudDeelnameOpleidingDuo.omsStudiegebied ?: "",
                    it.inhoudDeelnameOpleidingDuo.omsStudieinhoud ?: "",
                    it.inhoudDeelnameOpleidingDuo.omsStudieuitstroom ?: "",
                )
            )
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

    private fun toDateString(date: LocalDate) = date.format(dateOutFormatter)
    private fun toDate(date: String) = toDateString(LocalDate.parse(date, dateInFormatter))

    companion object {
        private const val SERVICE_PATH = "DUODossierPersoonGSD-v0300"
        private const val suwinetDateInPattern = "yyyyMMdd"
        private val dateInFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(suwinetDateInPattern)
        private const val bbzDateOutPattern = "yyyy-MM-dd"
        private val dateOutFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(bbzDateOutPattern)
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
