package com.ritense.valtimoplugins.suwinet.service


import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.AanvraagPersoonResponse
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.BRPInfo
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.ClientSuwi
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.FWI
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.Huwelijk
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.Kind
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.Nationaliteit
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.ObjectFactory
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.Straatadres
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.StraatadresHistorisch
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.VerblijfplaatsHistorisch
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.Verblijfstitel
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.model.AdresDto
import com.ritense.valtimoplugins.suwinet.model.AdresType
import com.ritense.valtimoplugins.suwinet.model.NationaliteitDto
import com.ritense.valtimoplugins.suwinet.model.PersoonDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.camunda.bpm.engine.exception.NotFoundException
import org.springframework.util.StringUtils
import java.time.LocalDate
import java.time.YearMonth

class SuwinetBrpInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val nationaliteitenService: NationaliteitenService,
    private val dateTimeService: DateTimeService
) {
    private lateinit var soapClientConfig: SuwinetSOAPClientConfig

    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun getBRPInfo(): BRPInfo {
        var completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        if (StringUtils.hasText(suffix)) {
            completeUrl = completeUrl.plus(suffix)
        }

        return suwinetSOAPClient
            .getService<BRPInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout,
                soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getPersoonsgegevensByBsn(
        bsn: String, brpService: BRPInfo
    ): PersoonDto? {

        logger.info { "Getting BRP personal info from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        try {
            val request = objectFactory.createRequest().apply {
                burgerservicenr = bsn
            }
            val person = brpService.aanvraagPersoon(request)

            return person.unwrapResponse()

            // SOAPFaultException occur when something is wrong with the request/response
        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting BRP personal info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
            // WebServiceExceptions occur when the service is down
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting BRP personal info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting BRP personal info" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        }
    }

    private fun AanvraagPersoonResponse.unwrapResponse(): PersoonDto? {

        val responseValue =
            content.firstOrNull() ?: throw IllegalStateException("AanvraagPersoonResponse contains no value")

        return when (responseValue.value) {
            is ClientSuwi -> {
                val persoon = responseValue.value as ClientSuwi

                PersoonDto(
                    bsn = persoon.burgerservicenr,
                    voornamen = persoon.voornamen ?: "",
                    achternaam = persoon.significantDeelVanDeAchternaam ?: "",
                    voorvoegsel = persoon.voorvoegsel ?: "",
                    geboortedatum = dateTimeService.fromSuwinetToDateString(persoon.geboortedat),
                    adresBrp = persoon.domicilieAdres?.mapToAdresDto(),
                    postadresBrp = persoon.correspondentieadres?.mapToAdresDto(),
                    verblijfstitel = getVerblijfstitel(persoon.verblijfstitel),
                    verblijfplaatsHistorisch = getVerblijfplaatsHistorisch(persoon.verblijfplaatsHistorisch),
                    nationaliteiten = getNationaliteiten(persoon.nationaliteit),
                    kinderenBsns = getKinderen(persoon.kind),
                    partnerBsn = getPartnerBsn(persoon.huwelijk),
                    datumOverlijden = dateTimeService.fromSuwinetToDateString(persoon.overlijden?.datOverlijden)
                )
            }

            is FWI -> {
                val fwiResponse = responseValue.value as FWI
                throw SuwinetResultFWIException(fwiResponse.foutOrWaarschuwingOrInformatie.joinToString { "${it.name} / ${it.value}\n" })
            }

            else -> {
                val nietsGevonden = objectFactory.createNietsGevonden("test")
                if (nietsGevonden.name.equals(content[0].name)) {
                    null
                } else {
                    throw SuwinetError(NotFoundException("not found"), "SUWINET_BSN_NOT_FOUND")
                }
            }
        }
    }

    private fun getPartnerBsn(huwelijk: List<Huwelijk>) = if (huwelijk.isNotEmpty()) {
        huwelijk[0].partner?.burgerservicenr ?: ""
    } else {
        ""
    }

    private fun getKinderen(kind: MutableList<Kind>) = kind.mapNotNull { it.burgerservicenr }


    private fun getNationaliteiten(nationaliteiten: List<Nationaliteit>) = nationaliteiten.mapNotNull {
        nationaliteitenService.getNationaliteit(
            it.cdNationaliteit?.trimStart('0')
        )?.let { nationaliteit ->
            NationaliteitDto(
                nationaliteit.code, nationaliteit.name
            )
        } ?: it.cdNationaliteit?.let { code ->
            NationaliteitDto(
                "0", "Onbekend"
            )
        }
    }

    private fun getVerblijfstitel(verblijfstitel: Verblijfstitel?) = PersoonDto.Verblijfstitel(
        codeVerblijfstitel = PersoonDto.Verblijfstitel.CodeVerblijfstitel(
            verblijfstitel?.cdVerblijfstitel ?: "-1", ""
        ),
        datumAanvangVerblijfstitel = dateTimeService.fromSuwinetToDateString(verblijfstitel?.datBVerblijfstitel),
        datumEindeVerblijfstitel = dateTimeService.fromSuwinetToDateString(verblijfstitel?.datEVerblijfstitel)
    )

    private fun getVerblijfplaatsHistorisch(
        verblijfplaatsHistorisch: List<VerblijfplaatsHistorisch>?
    ): List<PersoonDto.VerblijfplaatsHistorisch> {
        if (verblijfplaatsHistorisch.isNullOrEmpty()) return emptyList()

        val cutoffDate = LocalDate.now().minusYears(3)

        return buildList {
            for (entry in verblijfplaatsHistorisch) {
                val startDateRaw = entry.aangifteAdreshoudingBrp?.datBAdreshoudingBrp
                val startDate = parseSuwinetDateOrNull(startDateRaw) ?: continue
                if (startDate.isBefore(cutoffDate)) continue
                val datumBeginAdreshouding = dateTimeService.fromSuwinetToDateString(startDateRaw)

                entry.domicilieAdres?.let { domicilieAdres ->
                    add(
                        PersoonDto.VerblijfplaatsHistorisch(
                            type = AdresType.WOONADRES,
                            adres = domicilieAdres.mapToAdresDto(),
                            datumBeginAdreshouding = datumBeginAdreshouding
                        )
                    )
                }
                entry.correspondentieadres?.let { correspondentieadres ->
                    add(
                        PersoonDto.VerblijfplaatsHistorisch(
                            type = AdresType.POSTADRES,
                            adres = correspondentieadres.mapToAdresDto(),
                            datumBeginAdreshouding = datumBeginAdreshouding
                        )
                    )
                }
            }
        }
    }

    private fun Straatadres.mapToAdresDto() = AdresDto(
        straatnaam = straatnaam.orEmpty(),
        huisnummer = huisnr?.toInt() ?: 0,
        huisletter = huisletter.orEmpty(),
        huisnummertoevoeging = huisnrtoevoeging.orEmpty(),
        postcode = postcd.orEmpty(),
        woonplaatsnaam = woonplaatsnaam.orEmpty(),
        aanduidingBijHuisnummer = aanduidingBijHuisnr.orEmpty(),
        locatieomschrijving = locatieoms.orEmpty()
    )

    private fun StraatadresHistorisch.mapToAdresDto() = AdresDto(
        straatnaam = straatnaam.orEmpty(),
        huisnummer = huisnr?.toInt() ?: 0,
        huisletter = huisletter.orEmpty(),
        huisnummertoevoeging = huisnrtoevoeging.orEmpty(),
        postcode = postcd.orEmpty(),
        woonplaatsnaam = woonplaatsnaam.orEmpty(),
        aanduidingBijHuisnummer = aanduidingBijHuisnr.orEmpty(),
        locatieomschrijving = locatieoms.orEmpty()
    )

    private fun parseSuwinetDateOrNull(raw: String?): LocalDate? {
        val digits = raw?.filter(Char::isDigit) ?: return null
        if (digits.length != 8) return null

        val year = digits.substring(0, 4).toInt()
        val month = digits.substring(4, 6).let { if (it == "00") 1 else it.toInt() }
        val day = digits.substring(6, 8).let { if (it == "00") 1 else it.toInt() }
            .coerceIn(1, YearMonth.of(year, month).lengthOfMonth())

        return LocalDate.of(year, month, day)
    }

    companion object {
        const val SERVICE_PATH = "BRPDossierPersoonGSD-v0200"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
