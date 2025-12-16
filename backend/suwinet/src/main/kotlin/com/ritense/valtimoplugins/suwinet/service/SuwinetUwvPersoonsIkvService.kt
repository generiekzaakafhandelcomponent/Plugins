package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.FWI
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.ObjectFactory
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.StandaardBedr
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVIkvInfo
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVPersoonsIkvInfo
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVPersoonsIkvInfoResponse
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.Straatadres
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.AdresDto
import com.ritense.valtimoplugins.suwinet.model.UwvPersoonsIkvDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import java.io.IOException
import java.math.BigDecimal
import kotlin.properties.Delegates

class SuwinetUwvPersoonsIkvService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val dateTimeService: DateTimeService,
    private val uwvCodeService: UwvCodeService,
    private val uwvSoortIkvService: UwvSoortIkvService
) {
    private lateinit var soapClientConfig: SuwinetSOAPClientConfig
    private var maxPeriods by Delegates.notNull<Int>()
    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun getUWVIkvInfoService(): UWVIkvInfo {
        val completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        return suwinetSOAPClient
            .getService<UWVIkvInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout,
                soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getUWVInkomstenInfoByBsn(
        bsn: String,
        uwvIkvInfoService: UWVIkvInfo,
        maxPeriods: Int
    ): UwvPersoonsIkvDto? {
        logger.info { "Getting UWV inkomsten info from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix?:"")}" }
        this.maxPeriods = maxPeriods
        try {
            val uwvPersoonsIkvInfo: UWVPersoonsIkvInfo = objectFactory
                .createUWVPersoonsIkvInfo()
                .apply {
                    burgerservicenr = bsn
                }

            val uwvPersoonsIkvInfoResponse: UWVPersoonsIkvInfoResponse =
                uwvIkvInfoService.uwvPersoonsIkvInfo(uwvPersoonsIkvInfo)
            return uwvPersoonsIkvInfoResponse.unwrapResponse()

        } catch (e: WebServiceException) {
            when (e.cause) {
                is IOException -> {
                    logger.error(e) {
                        "Error connecting to Suwinet while getting UWV inkomsten info for BSN $bsn"
                    }
                    throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
                }

                else -> throw e
            }
        }
    }

    private fun UWVPersoonsIkvInfoResponse.unwrapResponse(): UwvPersoonsIkvDto? {

        val responseValue = content
            .firstOrNull()
            ?.value
            ?: throw IllegalStateException("UWVPersoonsIkvInfoResponse contains no value")

        return when (responseValue) {
            is UWVPersoonsIkvInfoResponse.ClientSuwi -> UwvPersoonsIkvDto(
                getInkomsten(responseValue.inkomstenverhouding)
            )

            is FWI -> {
                logger.info { "content: ${content[0].name}" }
                null
            }

            else -> {
                val nietsGevonden = objectFactory.createNietsGevonden("test")
                if (nietsGevonden.name.equals(content[0].name)) {
                    null
                } else {
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
                }
            }
        }
    }

    private fun getInkomsten(inkomstenverhouding: List<UWVPersoonsIkvInfoResponse.ClientSuwi.Inkomstenverhouding>) =
        inkomstenverhouding.map {
            UwvPersoonsIkvDto.Inkomsten(
                naamRechtspersoon = it.administratieveEenheid?.rechtspersoonAdministratieveEenh?.naamRechtspersoon,
                loonheffingennummer = it.administratieveEenheid?.loonheffingennr,
                straatadres = getAdres(it.administratieveEenheid?.feitelijkAdresAeh?.firstOrNull()?.straatadres),
                cdSector = it.sectorRisicogroepIkv.firstOrNull()?.sectorBeroepsEnBedrijfsleven?.cdSector,
                datumBeginIkv = dateTimeService.fromSuwinetToDateString(it.datBIkv),
                datumEindIkv = dateTimeService.fromSuwinetToDateString(it.datEIkv),
                opgaven = getInkomstenOpgaven(
                    it.inkomstenopgave,
                    getInkomstenPeriodes(it.inkomstenperiode),
                    it.administratieveEenheid?.rechtspersoonAdministratieveEenh?.naamRechtspersoon
                )
            )
        }

    private fun getInkomstenPeriodes(inkomstenperiode: List<UWVPersoonsIkvInfoResponse.ClientSuwi.Inkomstenverhouding.Inkomstenperiode>) =
        inkomstenperiode.map {
            UwvPersoonsIkvDto.InkomstenPeriode(
                datumAanvangPeriode = dateTimeService.toLocalDate(it.datBIkp, SUWINET_DATEIN_PATTERN),
                datumEindPeriode = dateTimeService.toLocalDate(it.datEIkp, SUWINET_DATEIN_PATTERN),
                codeSoortIkv = it.cdSrtIkv,
                codeSoortArbeidscontract = it.cdTypeArbeidscontract ?: "-1",
                codeAardIkv = it.cdAardIkv ?: "-1",
                indLoonheffingskortingToegepast = it.indLoonheffingskortingToegepast ?: "-1",
                indRegelmatigArbeidspatroon = it.indRegelmatigArbeidspatroon ?: "-1",
                indLoonIsMedeAowAlleenstaande = it.indLoonIsMedeAowAlleenstaande ?: "-1",
                indLoonInclusiefWajongUitkering = it.indLoonInclusiefWajongUitkering ?: "-1"
            )
        }

    private fun <T> selectMaxPeriods(
        periods: List<T>
    ) = periods.drop(if (periods.size - maxPeriods < 1) 0 else periods.size - maxPeriods)


    private fun getMatchingPeriod(
        inkomstenPeriodes: List<UwvPersoonsIkvDto.InkomstenPeriode>,
        datBIko: String,
        datEIko: String
    ): UwvPersoonsIkvDto.InkomstenPeriode? {
        val start = dateTimeService.toLocalDate(datBIko, DATEIN_PATTERN)
        val end = dateTimeService.toLocalDate(datEIko, DATEIN_PATTERN)
        return inkomstenPeriodes.firstOrNull {
            it.datumAanvangPeriode.isBefore(start) || it.datumAanvangPeriode.isEqual(start)
                    && it.datumEindPeriode.isAfter(end) || it.datumEindPeriode.isEqual(end)
        }
    }

    private fun getWaarde(bedrag: StandaardBedr?) =
        if (bedrag == null) {
            BigDecimal(0)
        } else if (bedrag.cdPositiefNegatief == "+") {
            BigDecimal(bedrag.waardeBedr)
        } else {
            BigDecimal(bedrag.waardeBedr).negate()
        }

    private fun getInkomstenOpgaven(
        inkomstenopgaven: List<UWVPersoonsIkvInfoResponse.ClientSuwi.Inkomstenverhouding.Inkomstenopgave>,
        inkomstenPeriodes: List<UwvPersoonsIkvDto.InkomstenPeriode>,
        naamRechtspersoon: String?
    ) =
        selectMaxPeriods(
            inkomstenopgaven.map {
                val opgave = UwvPersoonsIkvDto.InkomstenOpgave(
                    brutoSocialeVerzekeringsLoon = getWaarde(it.bedrBrutoloonSv),
                    loonLbPremieVolksverzekering = getWaarde(it.bedrLoonLbPremieVolksverz),
                    ingehoudenLbPremieVolksverzekering = getWaarde(it.bedrIngehoudenLbPremieVolksverz),
                    vakantietoeslag = getWaarde(it.bedrVakantietoeslag),
                    opgbRechtVakantietoeslag = getWaarde(it.bedrVakantietoeslag),
                    extraPrdSalaris = getWaarde(it.bedrExtraPrdSalaris),
                    opgbRechtExtraPrdSalaris = getWaarde(it.bedrOpgbRechtExtraPrdSalaris),
                    vergoedingReiskostenOnbelast = getWaarde(it.bedrVergoedingReiskostenOnbelast),
                    datumAanvangOpgave = dateTimeService.fromSuwinetToDateString(it.datBIko),
                    datumEindOpgave = dateTimeService.fromSuwinetToDateString(it.datEIko),
                    aantalVerloondeUren = it.aantVerloondeUrenIko?.toInt() ?: -1,
                    aantalSvDagen = it.aantSvDagenIko ?: -1,
                    naamRechtspersoon = naamRechtspersoon,
                )
                getMatchingPeriod(
                    inkomstenPeriodes,
                    opgave.datumAanvangOpgave,
                    opgave.datumEindOpgave
                )?.let { period ->
                    opgave.codeAardIkv = uwvCodeService.getCodeArbeidsverhouding(period.codeAardIkv)
                    opgave.codeSoortIkv = uwvSoortIkvService.getCodesoortInkomstenverhouding(period.codeSoortIkv)
                    opgave.codeSoortArbeidscontract =
                        uwvCodeService.getTypeArbeidscontract(period.codeSoortArbeidscontract)
                    opgave.indLoonheffingskortingToegepast =
                        uwvCodeService.getCodeJaNee(period.indLoonheffingskortingToegepast)
                    opgave.indRegelmatigArbeidspatroon =
                        uwvCodeService.getCodeJaNee(period.indRegelmatigArbeidspatroon)
                    opgave.indLoonIsMedeAowAlleenstaande =
                        uwvCodeService.getCodeJaNee(period.indLoonIsMedeAowAlleenstaande)
                    opgave.indLoonInclusiefWajongUitkering =
                        uwvCodeService.getCodeJaNee(period.indLoonInclusiefWajongUitkering)
                }
                opgave
            }

        )

    private fun getAdres(adres: Straatadres?) = AdresDto(
        straatnaam = adres?.straatnaam ?: "",
        huisnummer = adres?.huisnr?.toInt() ?: 0,
        huisnummertoevoeging = adres?.huisnrtoevoeging ?: "",
        postcode = adres?.postcd ?: "",
        woonplaatsnaam = adres?.woonplaatsnaam ?: "",
        locatieomschrijving = adres?.locatieoms ?: ""
    )

    companion object {
        const val SERVICE_PATH = "UWVDossierInkomstenGSD-v0200"
        const val SUWINET_DATEIN_PATTERN = "yyyyMMdd"
        const val DATEIN_PATTERN = "yyyy-MM-dd"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
