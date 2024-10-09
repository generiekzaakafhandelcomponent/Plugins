package com.ritense.valtimo.suwinet.service

import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.AanvraagPersoonResponse
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.BRPInfo
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.ClientSuwi
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.FWI
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.Huwelijk
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.Kind
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.Nationaliteit
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.ObjectFactory
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.Straatadres
import com.ritense.valtimo.implementation.dkd.BRPDossierPersoonGSD.Verblijfstitel
import com.ritense.valtimo.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimo.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimo.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimo.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimo.suwinet.model.AdresDto
import com.ritense.valtimo.suwinet.model.NationaliteitDto
import com.ritense.valtimo.suwinet.model.PersoonDto
import mu.KotlinLogging

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

        val result = runCatching {

            val request = objectFactory.createRequest().apply {
                burgerservicenr = bsn
            }
            val person = brpService.aanvraagPersoon(request)
            person.unwrapResponse()
        }
        return result.getOrThrow()
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
                    throw SuwinetResultNotFoundException("SuwiNet response: $responseValue")
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
        val nationaliteit = nationaliteitenService.getNationaliteit(
            it.cdNationaliteit.trimStart('0')
        )
        nationaliteit?.let {
            NationaliteitDto(
                nationaliteit.code, nationaliteit.name
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
