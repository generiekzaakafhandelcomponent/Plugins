package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfo
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfoResponse
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.FWI
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfoResponse.ClientSuwi
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.Bron
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.ObjectFactory
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.PartnerBijstand
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.AanvraagUitkeringDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.BeslissingOpAanvraagUitkeringDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.BijstandsRegelingenDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.BronDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.PartnerBijstandDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.SpecifiekeGegevensBijzBijstandDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.SzWetDto

import io.github.oshai.kotlinlogging.KotlinLogging
import java.time.LocalDate

class SuwinetBijstandsregelingenService (
    private val suwinetSOAPClient: SuwinetSOAPClient,
) {
    lateinit var soapClientConfig: SuwinetSOAPClientConfig

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig) {
        this.soapClientConfig = soapClientConfig
    }

    fun createBijstandsregelingenService(): BijstandsregelingenInfo {
        val completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH
        return suwinetSOAPClient.configureKeystore(
            soapClientConfig.keystoreCertificatePath,
            soapClientConfig.keystoreKey
        )
            .configureTruststore(soapClientConfig.truststoreCertificatePath, soapClientConfig.truststoreKey)
            .configureBasicAuth(soapClientConfig.basicAuthName, soapClientConfig.basicAuthSecret)
            .getService<BijstandsregelingenInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout, soapClientConfig.receiveTimeout
            )
    }

    fun getBijstandsregelingenByBsn(
        bsn: String
    ): BijstandsRegelingenDto? {
        logger.info { "Getting Bijstandsregelingen from ${soapClientConfig.baseUrl + SERVICE_PATH}" }

        /* retrieve duo studiefinanciering info by bsn */
        val result = runCatching {

            val bijstandsregelingenInfoRequest = ObjectFactory().createBijstandsregelingenInfo_Type()
                .apply {
                    burgerservicenr = bsn
                }
            val response = createBijstandsregelingenService().bijstandsregelingenInfo(bijstandsregelingenInfoRequest)
            response.unwrapResponse()
        }

        return result.getOrThrow()
    }

    private fun BijstandsregelingenInfoResponse.unwrapResponse(): BijstandsRegelingenDto? {
        val responseValue =
            content.firstOrNull() ?: throw IllegalStateException("BijstandsregelingenInfoResponse contains no value")

        return when (responseValue.value) {
            is ClientSuwi -> {
                val bijstandsRegelingenInfo = responseValue.value as ClientSuwi
                return BijstandsRegelingenDto(
                    burgerservicenr = bijstandsRegelingenInfo.burgerservicenr,
                    aanvraagUitkeringen = getAanvraagUitkeringen(bijstandsRegelingenInfo.aanvraagUitkering),
                    specifiekeGegevensBijzBijstandList = getSpeciekeGegevensBijzBijstand(bijstandsRegelingenInfo.specifiekeGegevensBijzBijstand)
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

    private fun getSpeciekeGegevensBijzBijstand(specifiekeGegevensBijzBijstand: MutableList<ClientSuwi.SpecifiekeGegevensBijzBijstand>): kotlin.collections.List<com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.SpecifiekeGegevensBijzBijstandDto> =
       specifiekeGegevensBijzBijstand.map {
           specifiekeGegevensBijzBijstandItem -> SpecifiekeGegevensBijzBijstandDto(
               cdClusterBijzBijstand = specifiekeGegevensBijzBijstandItem.cdClusterBijzBijstand,
                omsSrtKostenBijzBijstand = specifiekeGegevensBijzBijstandItem.omsSrtKostenBijzBijstand,
               datBetaalbaarBijzBijstand = LocalDate.parse(specifiekeGegevensBijzBijstandItem.datBetaalbaarBijzBijstand),
                partnerBijzBijstand = getPartnerBijstand(specifiekeGegevensBijzBijstandItem.partnerBijzBijstand),
               szWet = SzWetDto(specifiekeGegevensBijzBijstandItem.szWet.cdSzWet),
               bron = BronDto(
                   cdKolomSuwi = specifiekeGegevensBijzBijstandItem.bron.cdKolomSuwi,
                   cdPartijSuwi = specifiekeGegevensBijzBijstandItem.bron.cdPartijSuwi,
                   cdVestigingSuwi = specifiekeGegevensBijzBijstandItem.bron.cdVestigingSuwi,
                   )

           )
       }

    private fun getAanvraagUitkeringen(aanvraagUitkering: MutableList<ClientSuwi.AanvraagUitkering>): List<AanvraagUitkeringDto> = aanvraagUitkering
        .map { aanvraag ->
            AanvraagUitkeringDto(
                datAanvraagUitkering = LocalDate.parse(aanvraag.datAanvraagUitkering),
                szWet = SzWetDto(aanvraag.szWet.cdSzWet),
                beslissingOpAanvraagUitkering = getBeslissingOpAanvraagUitkering(aanvraag.beslissingOpAanvraagUitkering),
                partnerAanvraagUitkering = getPartnerBijstand(aanvraag.partnerAanvraagUitkering),
                bron = getBron(aanvraag.bron)
            )
        }

    private fun getBron(bron: Bron): BronDto? = BronDto(
        cdKolomSuwi = bron.cdKolomSuwi,
        cdPartijSuwi = bron.cdPartijSuwi,
        cdVestigingSuwi = bron.cdVestigingSuwi,
    )

    private fun getPartnerBijstand(partnerAanvraagUitkering: PartnerBijstand): PartnerBijstandDto  =
        PartnerBijstandDto(
            burgerservicenr = partnerAanvraagUitkering.burgerservicenr,
            voorletters = partnerAanvraagUitkering.voorletters,
            voorvoegsel = partnerAanvraagUitkering.voorvoegsel,
            significantDeelVanDeAchternaam = partnerAanvraagUitkering.significantDeelVanDeAchternaam,
            geboortedat = LocalDate.parse(partnerAanvraagUitkering.geboortedat),
        )

    private fun getBeslissingOpAanvraagUitkering(beslissingOpAanvraagUitkering: ClientSuwi.AanvraagUitkering.BeslissingOpAanvraagUitkering): BeslissingOpAanvraagUitkeringDto =
        BeslissingOpAanvraagUitkeringDto(
            cdBeslissingOpAanvraagUitkering = beslissingOpAanvraagUitkering.cdBeslissingOpAanvraagUitkering,
            datDagtekeningBeslisOpAanvrUitk = LocalDate.parse(beslissingOpAanvraagUitkering.datDagtekeningBeslisOpAanvrUitk)
        )


    companion object {
        private const val SERVICE_PATH = "Bijstandsregelingen-v0500"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}

