package com.ritense.valtimoplugins.suwinet.service


import com.ritense.valtimo.implementation.dkd.KadasterInfo.ClientSuwiPersoonsInfo
import com.ritense.valtimo.implementation.dkd.KadasterInfo.FWI
import com.ritense.valtimo.implementation.dkd.KadasterInfo.KadasterInfo
import com.ritense.valtimo.implementation.dkd.KadasterInfo.KadastraalObject
import com.ritense.valtimo.implementation.dkd.KadasterInfo.KadastraleAanduiding
import com.ritense.valtimo.implementation.dkd.KadasterInfo.Locatie
import com.ritense.valtimo.implementation.dkd.KadasterInfo.ObjectFactory
import com.ritense.valtimo.implementation.dkd.KadasterInfo.ObjectInfoKadastraleAanduidingResponse
import com.ritense.valtimo.implementation.dkd.KadasterInfo.PersoonsInfoResponse
import com.ritense.valtimo.implementation.dkd.KadasterInfo.PubliekrechtelijkeBeperking
import com.ritense.valtimo.implementation.dkd.KadasterInfo.ZakelijkRecht
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.AdresDto
import com.ritense.valtimoplugins.suwinet.model.DynamicResponseDto
import com.ritense.valtimoplugins.suwinet.model.KadastraleAanduidingDto
import com.ritense.valtimoplugins.suwinet.model.KadastraleObjectDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class SuwinetKadasterInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val dynamicResponseFactory: DynamicResponseFactory
) {

    lateinit var kadasterService: KadasterInfo
    lateinit var soapClientConfig: SuwinetSOAPClientConfig
    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun createKadasterService(): KadasterInfo {
        var completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        if (StringUtils.hasText(suffix)) {
            completeUrl = completeUrl.plus(suffix)
        }

        return suwinetSOAPClient
            .getService<KadasterInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout,
                soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getKadastraleAanduidingenByBsn(
        bsn: String,
        kadasterService: KadasterInfo
    ): List<KadastraleAanduidingDto> {
        logger.info { "Getting kadastrale aanduidingen from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        try {
            this.kadasterService = kadasterService
            return retrieveKadasterAanduidingen(bsn).map { mapToAanduidingDto(it) }

        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting kadastrale aanduidingen" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting kadastrale aanduidingen" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting kadastrale aanduidingen" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        }
    }

    fun getKadastraleObjectByAanduiding(
        kadastraleAanduiding: KadastraleAanduidingDto,
        kadasterService: KadasterInfo,
        dynamicProperties: List<String> = listOf()
    ): DynamicResponseDto {
        logger.info { "Getting kadastrale objecten from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        try {
            this.kadasterService = kadasterService

            val result = getKadastraleObject(kadastraleAanduiding)

            return DynamicResponseDto(
                properties = result?.let { getAvailableProperties(result as Any)}?: listOf(),
                dynamicProperties = result?.let { getDynamicProperties(result, dynamicProperties)} ?: mapOf(),
            )

        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting kadastrale objecten" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting kadastrale objecten" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting kadastrale objecten" }
            throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
        }
    }

    private fun getKadastraleObject(kadastraleAanduiding: KadastraleAanduidingDto): KadastraalObject? {
        val infoKadastraleAanduidingRequest = objectFactory
            .createObjectInfoKadastraleAanduiding()
            .apply {
                cdKadastraleGemeente = kadastraleAanduiding.cdKadastraleGemeente
                kadastraleGemeentenaam = kadastraleAanduiding.kadastraleGemeentenaam
                kadastraleSectie = kadastraleAanduiding.kadastraleSectie
                kadastraalPerceelnr = kadastraleAanduiding.kadastraalPerceelnr
                volgnrKadastraalAppartementsrecht = kadastraleAanduiding.volgnrKadastraalAppartementsrecht
            }
        val infoKadastraleAanduidingResponse = kadasterService.objectInfoKadastraleAanduiding(
            infoKadastraleAanduidingRequest
        )
         return infoKadastraleAanduidingResponse.unwrapResponse()
    }

    private fun retrieveKadasterAanduidingen(bsn: String): List<KadastraleAanduiding> {
        val persoonsInfoRequest = objectFactory
            .createPersoonsInfo()
            .apply {
                burgerservicenr = bsn
            }
        val kadasterResponse = this.kadasterService.persoonsInfo(persoonsInfoRequest)
        return kadasterResponse.unwrapResponse()
    }

    private fun mapToAanduidingDto(aanduiding: KadastraleAanduiding) =
        KadastraleAanduidingDto(
            cdKadastraleGemeente = aanduiding.cdKadastraleGemeente,
            kadastraleGemeentenaam = aanduiding.kadastraleGemeentenaam,
            kadastraleSectie = aanduiding.kadastraleSectie,
            kadastraalPerceelnr = aanduiding.kadastraalPerceelnr,
            volgnrKadastraalAppartementsrecht = aanduiding.volgnrKadastraalAppartementsrecht
        )


    private fun PersoonsInfoResponse.unwrapResponse(): List<KadastraleAanduiding> {
        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("PersoonsInfoResponse contains no value")

        return when (responseValue) {
            is ClientSuwiPersoonsInfo -> {
                responseValue.eigendom.onroerendeZaak.map {
                    it.kadastraleAanduiding
                }
            }

            else -> {
                val nietsGevonden = objectFactory.createNietsGevonden("test")
                if (nietsGevonden.name.equals(content[0].name)) {
                    return listOf()
                } else {
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
                }
            }
        }
    }

    private fun ObjectInfoKadastraleAanduidingResponse.unwrapResponse(): KadastraalObject? {
        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("ObjectInfoKadastraleAanduidingResponse contains no value")

        return when (responseValue) {
            is KadastraalObject -> responseValue
            is FWI -> {
                logger.info { "FWI content ${content[0].name}" }
                null
            }

            else -> {
                logger.info { "else content ${content[0].name}" }
                throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
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


    companion object {
        private const val SERVICE_PATH = "KadasterDossierGSD-v0300"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
