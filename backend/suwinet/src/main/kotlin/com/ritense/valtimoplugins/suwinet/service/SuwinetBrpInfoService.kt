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
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.Verblijfstitel
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.AdresDto
import com.ritense.valtimoplugins.suwinet.model.NationaliteitDto
import com.ritense.valtimoplugins.suwinet.model.PersoonDto
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import org.camunda.bpm.engine.exception.NotFoundException
import java.io.IOException

class SuwinetBrpInfoService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val nationaliteitenService: NationaliteitenService,
    private val dateTimeService: DateTimeService
) {
    private lateinit var soapClientConfig: SuwinetSOAPClientConfig

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig) {
        this.soapClientConfig = soapClientConfig
    }

    fun getBRPInfo(): BRPInfo {
        val completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH
        return suwinetSOAPClient
            .configureKeystore(soapClientConfig.keystoreCertificatePath, soapClientConfig.keystoreKey)
            .configureTruststore(soapClientConfig.truststoreCertificatePath, soapClientConfig.truststoreKey)
            .configureBasicAuth(soapClientConfig.basicAuthName, soapClientConfig.basicAuthSecret)
            .getService<BRPInfo>(completeUrl, soapClientConfig.connectionTimeout, soapClientConfig.receiveTimeout)
    }

    fun getPersoonsgegevensByBsn(
        bsn: String, brpService: BRPInfo
    ): PersoonDto? {

        logger.info { "Getting BRP personal info from ${soapClientConfig.baseUrl + SERVICE_PATH}" }

        try {
            val request = objectFactory.createRequest().apply {
                burgerservicenr = bsn
            }
            val person = brpService.aanvraagPersoon(request)

            return person.unwrapResponse()
        } catch (e: WebServiceException) {
            when(e.cause) {
                is IOException -> {
                    logger.error { "Error connecting to Suwinet while getting BRP personal info from $bsn" }
                    throw SuwinetError(e, "SUWINET_CONNECT_ERROR")
                }
                else -> throw e
            }
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
                    adresBrp = getAdres(persoon.domicilieAdres),
                    postadresBrp = getAdres(persoon.correspondentieadres),
                    verblijfstitel = getVerblijfstitel(persoon.verblijfstitel),
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
        nationaliteit ->
        val code = nationaliteit.cdNationaliteit?.trimStart('0')?.takeIf { it.isNotBlank() }
        code?.let {
            nationaliteitenService.getNationaliteit(it)?.let { found ->
                NationaliteitDto(found.code, found.name)
            }
        }
    }

    private fun getVerblijfstitel(verblijfstitel: Verblijfstitel?) = PersoonDto.Verblijfstitel(
        codeVerblijfstitel = PersoonDto.Verblijfstitel.CodeVerblijfstitel(
            verblijfstitel?.cdVerblijfstitel ?: "-1", ""
        ),
        datumAanvangVerblijfstitel = dateTimeService.fromSuwinetToDateString(verblijfstitel?.datBVerblijfstitel),
        datumEindeVerblijfstitel = dateTimeService.fromSuwinetToDateString(verblijfstitel?.datEVerblijfstitel)
    )

    private fun getAdres(adres: Straatadres?) = AdresDto(
        straatnaam = adres?.straatnaam ?: "",
        huisnummer = adres?.huisnr?.toInt() ?: 0,
        huisletter = adres?.huisletter ?: "",
        huisnummertoevoeging = adres?.huisnrtoevoeging ?: "",
        postcode = adres?.postcd ?: "",
        woonplaatsnaam = adres?.woonplaatsnaam ?: "",
        aanduidingBijHuisnummer = adres?.aanduidingBijHuisnr?.toString() ?: "",
        locatieomschrijving = adres?.locatieoms ?: ""
    )

    companion object {
        const val SERVICE_PATH = "BRPDossierPersoonGSD-v0200/v1"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}
