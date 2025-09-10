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
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.AdresDto
import com.ritense.valtimoplugins.suwinet.model.KadastraleObjectenDto
import io.github.oshai.kotlinlogging.KotlinLogging
import java.time.LocalDate
import java.time.format.DateTimeFormatter

class SuwinetKadasterInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient
) {

    lateinit var kadasterService: KadasterInfo
    lateinit var soapClientConfig: SuwinetSOAPClientConfig

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig) {
        this.soapClientConfig = soapClientConfig
    }

    fun createKadasterService(): KadasterInfo {
        val completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH
        return suwinetSOAPClient.configureKeystore(
            soapClientConfig.keystoreCertificatePath,
            soapClientConfig.keystoreKey
        )
            .configureTruststore(soapClientConfig.truststoreCertificatePath, soapClientConfig.truststoreKey)
            .configureBasicAuth(soapClientConfig.basicAuthName, soapClientConfig.basicAuthSecret)
            .getService<KadasterInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout, soapClientConfig.receiveTimeout
            )
    }

    fun getPersoonsinfoByBsn(
        bsn: String,
        kadasterService: KadasterInfo
    ): KadastraleObjectenDto {
        logger.info { "Getting kadastrale objecten from ${soapClientConfig.baseUrl + SERVICE_PATH}" }

        val result = runCatching {
            this.kadasterService = kadasterService

            /* retrieve kadasterInfo by bsn */
            val kadastraleAanduidingen = retrieveKadasterPersoonsInfo(bsn)

            /* retrieve and enrich kadaster objects from kadasterObjects list */
            getKadastraleObjects(kadastraleAanduidingen)
        }
        return result.getOrThrow()
    }

    private fun getKadastraleObjects(kadastraleAanduidingen: List<KadastraleAanduiding>) =
        KadastraleObjectenDto(
            kadastraleAanduidingen.mapNotNull {
                getKadastraalObjectByAanduiding(it)
            }
        )

    private fun retrieveKadasterPersoonsInfo(bsn: String): List<KadastraleAanduiding> {
        val persoonsInfoRequest = objectFactory
            .createPersoonsInfo()
            .apply {
                burgerservicenr = bsn
            }
        val kadasterResponse = this.kadasterService.persoonsInfo(persoonsInfoRequest)
        return kadasterResponse.unwrapResponse()
    }

    fun getKadastraalObjectByAanduiding(
        kadastraleAanduiding: KadastraleAanduiding,
    ) = try {
        retrieveKadastraleObject(kadastraleAanduiding)?.let {
            mapToKadasterObject(it)
        }
    } catch (e: Error) {
        logger.error { "error retrieving: $e" }
        null
    }

    private fun mapToKadasterObject(kadastraleObject: KadastraalObject) =
        KadastraleObjectenDto.KadastraalObjectDto(
            codeTypeOnroerendeZaak = kadastraleObject.cdTypeOnroerendeZaak.name,
            datumOntstaan = toDate(kadastraleObject.datOntstaan),
            kadastraleAanduiding = mapKadastraleAanduiding(kadastraleObject.kadastraleAanduiding),
            omschrijving = kadastraleObject.omsKadastraalObject,
            zakelijkRecht = mapZakelijkRecht(kadastraleObject.zakelijkRecht.firstOrNull()),
            locatieOz = mapLocatieOz(kadastraleObject.locatieOZ.firstOrNull()),
            publiekrechtelijkeBeperking = listOf(mapPubliekrechtelijkeBeperking(kadastraleObject.publiekrechtelijkeBeperking.firstOrNull())),
            indicatieMeerGerechtigden = kadastraleObject.indMeerGerechtigden
        )

    private fun mapKadastraleAanduiding(aanduiding: KadastraleAanduiding) =
        KadastraleObjectenDto.KadastraalObjectDto.KadastraleAanduidingDto(
            codeKadastraleGemeente = aanduiding.cdKadastraleGemeente,
            kadastraleGemeentenaam = aanduiding.kadastraleGemeentenaam,
            kadastraleSectie = aanduiding.kadastraleSectie,
            kadastraalPerceelnr = aanduiding.kadastraalPerceelnr,
            volgnrKadastraalAppartementsrecht = aanduiding.volgnrKadastraalAppartementsrecht
        )

    private fun mapZakelijkRecht(zakelijkRecht: ZakelijkRecht?) =
        KadastraleObjectenDto.KadastraalObjectDto.ZakelijkRechtDto(
            omschrijvingZakelijkRecht = zakelijkRecht?.omsZakelijkRecht ?: "",
            datumEZakelijkRecht = zakelijkRecht?.datEZakelijkRecht?.let { toDate(it) } ?: ""
        )

    private fun mapLocatieOz(locatieOz: Locatie?) =
        locatieOz?.straatadresBag?.let {
            AdresDto(
                straatnaam = it.straatnaam,
                huisnummer = it.huisnr?.toInt() ?: 0,
                huisletter = it.huisletter ?: "",
                huisnummertoevoeging = it.huisnrtoevoeging ?: "",
                postcode = it.postcd,
                woonplaatsnaam = it.woonplaatsnaam,
                aanduidingBijHuisnummer = it.aanduidingBijHuisnr ?: "",
                locatieomschrijving = it.locatieoms ?: ""
            )
        }

    private fun mapPubliekrechtelijkeBeperking(beperking: PubliekrechtelijkeBeperking?) =
        beperking?.aantekeningKadastraalObject?.let {
            KadastraleObjectenDto.KadastraalObjectDto.PubliekrechtelijkeBeperkingDto(
                aantekeningKadastraal = KadastraleObjectenDto.KadastraalObjectDto.PubliekrechtelijkeBeperkingDto.AantekeningKadastraalDto(
                    datumEAantekeningKadastraal = toDate(it.datEAantekeningKadastraalObject) ?: "",
                    omschrijvingAantekeningKadastraal = it.omsAantekeningKadastraalObject ?: ""
                )
            )
        }

    private fun retrieveKadastraleObject(kadastraleAanduiding: KadastraleAanduiding): KadastraalObject? {
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
                    return listOf<KadastraleAanduiding>()
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

    private fun toDateString(date: LocalDate) = date.format(dateOutFormatter)
    private fun toDate(date: String) = toDateString(LocalDate.parse(date, dateInFormatter))

    companion object {
        private const val SERVICE_PATH = "KadasterDossierGSD-v0300/v1"
        private const val SUWINET_DATE_IN_PATTERN = "yyyyMMdd"
        private const val DATE_OUT_PATTERN = "yyyy-MM-dd"
        private val dateInFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(SUWINET_DATE_IN_PATTERN)
        private val dateOutFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(DATE_OUT_PATTERN)
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
