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
import com.ritense.valtimoplugins.suwinet.error.SuwinetError
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultFWIException
import com.ritense.valtimoplugins.suwinet.exception.SuwinetResultNotFoundException
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.AanvraagUitkeringDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.BeslissingOpAanvraagUitkeringDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.BijstandsRegelingenDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.BronDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.PartnerBijstandDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.PartnerDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.SpecifiekeGegevensBijzBijstandDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.SzWetDto
import com.ritense.valtimoplugins.suwinet.model.bijstandsregelingen.VorderingDto

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.WebServiceException
import jakarta.xml.ws.soap.SOAPFaultException
import org.springframework.util.StringUtils
import java.time.LocalDate

class SuwinetBijstandsregelingenService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
) {
    lateinit var soapClientConfig: SuwinetSOAPClientConfig

    var suffix: String? = ""

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig, suffix: String?) {
        this.soapClientConfig = soapClientConfig
        this.suffix = suffix
    }

    fun createBijstandsregelingenService(): BijstandsregelingenInfo {
        var completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH

        if (StringUtils.hasText(suffix)) {
            completeUrl = completeUrl.plus(suffix)
        }

        return suwinetSOAPClient
            .getService<BijstandsregelingenInfo>(
                completeUrl,
                soapClientConfig.connectionTimeout, soapClientConfig.receiveTimeout,
                soapClientConfig.authConfig
            )
    }

    fun getBijstandsregelingenByBsn(
        bsn: String,
        infoService: BijstandsregelingenInfo
    ): BijstandsRegelingenDto? {
        logger.info { "Getting Bijstandsregelingen from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }
        try {
            /* retrieve Bijstandsregeling info by bsn */
            val bijstandsregelingenInfoRequest = ObjectFactory().createBijstandsregelingenInfo_Type()
                .apply {
                    burgerservicenr = bsn
                }
            val response = infoService.bijstandsregelingenInfo(bijstandsregelingenInfoRequest)
            return response.unwrapResponse()

            // SOAPFaultException occur when something is wrong with the request/response
        } catch (e: SOAPFaultException) {
            logger.error(e) { "SOAPFaultException - Error getting Bijstandsregelingen" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
            // WebServiceExceptions occur when the service is down
        } catch (e: WebServiceException) {
            logger.error(e) { "WebServiceException - Error getting Bijstandsregelingen" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        } catch (e: Exception) {
            logger.error(e) { "Other Exception - Error getting Bijstandsregelingen" }
            throw SuwinetError(
                e,
                "SUWINET_CONNECT_ERROR"
            )
        }
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
                    specifiekeGegevensBijzBijstandList = getSpeciekeGegevensBijzBijstand(bijstandsRegelingenInfo.specifiekeGegevensBijzBijstand),
                    vorderingen = getVorderingen(bijstandsRegelingenInfo.vordering)
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

    private fun getVorderingen(vorderingen: MutableList<ClientSuwi.Vordering>): List<VorderingDto> =
        vorderingen.map { vordering ->
            VorderingDto(
                bron = BronDto(
                    cdKolomSuwi = vordering.bron.cdKolomSuwi,
                    cdVestigingSuwi = vordering.bron.cdVestigingSuwi,
                    cdPartijSuwi = vordering.bron.cdPartijSuwi
                ),
                cdRedenVordering = vordering.cdRedenVordering,
                datBesluitVordering = vordering.datBesluitVordering,
                identificatienrVordering = vordering.identificatienrVordering,
                partnersVordering = getPartners(vordering.partnerVordering),
                szWet = SzWetDto(cdSzWet = vordering.szWet.cdSzWet)
            )
        }

    private fun getPartners(partnerVordering: MutableList<ClientSuwi.Vordering.PartnerVordering>): MutableList<PartnerDto> =
        partnerVordering.map { partnerVordering ->
            PartnerDto(burgerservicenr = partnerVordering.burgerservicenr)
        } as MutableList<PartnerDto>

    private fun getSpeciekeGegevensBijzBijstand(specifiekeGegevensBijzBijstand: MutableList<ClientSuwi.SpecifiekeGegevensBijzBijstand>): List<SpecifiekeGegevensBijzBijstandDto> =
        specifiekeGegevensBijzBijstand.map { specifiekeGegevensBijzBijstandItem ->
            SpecifiekeGegevensBijzBijstandDto(
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

    private fun getAanvraagUitkeringen(aanvraagUitkering: MutableList<ClientSuwi.AanvraagUitkering>): List<AanvraagUitkeringDto> =
        aanvraagUitkering
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

    private fun getPartnerBijstand(partnerAanvraagUitkering: PartnerBijstand): PartnerBijstandDto =
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

