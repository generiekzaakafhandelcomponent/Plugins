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
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
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
import org.springframework.util.StringUtils

class SuwinetBijstandsregelingenService(
    private val suwinetSOAPClient: SuwinetSOAPClient,
    private val dynamicResponseFactory: DynamicResponseFactory,
    private val dateTimeService: DateTimeService
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
        infoService: BijstandsregelingenInfo,
        dynamicProperties: List<String>,
    ): BijstandsRegelingenDto? {
        logger.info { "Getting Bijstandsregelingen from ${soapClientConfig.baseUrl + SERVICE_PATH + (this.suffix ?: "")}" }

        /* retrieve Bijstandsregeling info by bsn */
        val result = runCatching {

            val bijstandsregelingenInfoRequest = ObjectFactory().createBijstandsregelingenInfo_Type()
                .apply {
                    burgerservicenr = bsn
                }
            val response = infoService.bijstandsregelingenInfo(bijstandsregelingenInfoRequest)
            response.unwrapResponse(dynamicProperties)
        }

        return result.getOrThrow()
    }

    private fun BijstandsregelingenInfoResponse.unwrapResponse(dynamicProperties: List<String>): BijstandsRegelingenDto? {
        val responseValue =
            content.firstOrNull() ?: throw IllegalStateException("BijstandsregelingenInfoResponse contains no value")

        return when (responseValue.value) {
            is ClientSuwi -> {
                val bijstandsRegelingenInfo = responseValue.value as ClientSuwi
                return BijstandsRegelingenDto(
                    burgerservicenr = bijstandsRegelingenInfo.burgerservicenr,
                    aanvraagUitkeringen = getAanvraagUitkeringen(bijstandsRegelingenInfo.aanvraagUitkering),
                    specifiekeGegevensBijzBijstandList = getSpeciekeGegevensBijzBijstand(bijstandsRegelingenInfo.specifiekeGegevensBijzBijstand),
                    vorderingen = getVorderingen(bijstandsRegelingenInfo.vordering),
                    propertiesMap = getDynamicProperties(bijstandsRegelingenInfo, dynamicProperties),
                    properties = getAvailableProperties(bijstandsRegelingenInfo)
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

    private fun getAvailableProperties(bijstandsRegelingenInfo: ClientSuwi): List<String> {
        val flatMap = dynamicResponseFactory.toFlatMap(bijstandsRegelingenInfo)
        return flatMap.keys.toList()
    }

    private fun getDynamicProperties(
        bijstandsRegelingenInfo: ClientSuwi,
        dynamicProperties: List<String>
    ): Map<String, Any?> {
        var propertiesMap: MutableMap<String, Any?> = mutableMapOf<String, Any?>()

        val flatMap = dynamicResponseFactory.toFlatMap(bijstandsRegelingenInfo)

        // exact matching
        dynamicProperties.forEach { prop ->
            if (flatMap.containsKey(prop)) {
                propertiesMap[prop] = flatMap[prop]
            }

            // do wildcards
            if (prop.endsWith('*')) {
                val prefixValue = prop.trimEnd(
                    '*'
                )
                flatMap.keys.forEach {
                    if (it.startsWith(prefixValue)) {
                        propertiesMap[it] = flatMap[it]
                    }
                }
            }
        }

        return dynamicResponseFactory.flatMapToNested(propertiesMap)
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
                datBesluitVordering = dateTimeService.fromSuwinetToDateString(vordering.datBesluitVordering),
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
                cdClusterBijzBijstand = specifiekeGegevensBijzBijstandItem.cdClusterBijzBijstand.orEmpty(),
                omsSrtKostenBijzBijstand = specifiekeGegevensBijzBijstandItem.omsSrtKostenBijzBijstand.orEmpty(),
                datBetaalbaarBijzBijstand = dateTimeService.toLocalDate(specifiekeGegevensBijzBijstandItem.datBetaalbaarBijzBijstand, SUWINET_DATEIN_PATTERN),
                partnerBijzBijstand = getPartnerBijstand(specifiekeGegevensBijzBijstandItem.partnerBijzBijstand),
                szWet = SzWetDto(specifiekeGegevensBijzBijstandItem.szWet?.cdSzWet),
                bron = BronDto(
                    cdKolomSuwi = specifiekeGegevensBijzBijstandItem.bron?.cdKolomSuwi ?: 0,
                    cdPartijSuwi = specifiekeGegevensBijzBijstandItem.bron.cdPartijSuwi.orEmpty(),
                    cdVestigingSuwi = specifiekeGegevensBijzBijstandItem.bron.cdVestigingSuwi.orEmpty(),
                )

            )
        }

    private fun getAanvraagUitkeringen(aanvraagUitkering: MutableList<ClientSuwi.AanvraagUitkering>): List<AanvraagUitkeringDto> =
        aanvraagUitkering
            .map { aanvraag ->
                AanvraagUitkeringDto(
                    datAanvraagUitkering = dateTimeService.toLocalDate(aanvraag.datAanvraagUitkering, SUWINET_DATEIN_PATTERN),
                    szWet = SzWetDto(aanvraag.szWet.cdSzWet.orEmpty()),
                    beslissingOpAanvraagUitkering = getBeslissingOpAanvraagUitkering(aanvraag.beslissingOpAanvraagUitkering),
                    partnerAanvraagUitkering = getPartnerBijstand(aanvraag.partnerAanvraagUitkering),
                    bron = getBron(aanvraag.bron)
                )
            }

    private fun getBron(bron: Bron?): BronDto = BronDto(
        cdKolomSuwi = bron?.cdKolomSuwi ?: 0,
        cdPartijSuwi = bron?.cdPartijSuwi.orEmpty(),
        cdVestigingSuwi = bron?.cdVestigingSuwi.orEmpty(),
    )

    private fun getPartnerBijstand(partnerAanvraagUitkering: PartnerBijstand): PartnerBijstandDto =
        PartnerBijstandDto(
            burgerservicenr = partnerAanvraagUitkering.burgerservicenr,
            voorletters = partnerAanvraagUitkering.voorletters.orEmpty(),
            voorvoegsel = partnerAanvraagUitkering.voorvoegsel.orEmpty(),
            significantDeelVanDeAchternaam = partnerAanvraagUitkering.significantDeelVanDeAchternaam,
            geboortedat = dateTimeService.toLocalDate(partnerAanvraagUitkering.geboortedat, SUWINET_DATEIN_PATTERN),
        )

    private fun getBeslissingOpAanvraagUitkering(beslissingOpAanvraagUitkering: ClientSuwi.AanvraagUitkering.BeslissingOpAanvraagUitkering): BeslissingOpAanvraagUitkeringDto =
        BeslissingOpAanvraagUitkeringDto(
            cdBeslissingOpAanvraagUitkering = beslissingOpAanvraagUitkering.cdBeslissingOpAanvraagUitkering.orEmpty(),
            datDagtekeningBeslisOpAanvrUitk = dateTimeService.toLocalDate(beslissingOpAanvraagUitkering.datDagtekeningBeslisOpAanvrUitk, SUWINET_DATEIN_PATTERN)
        )


    companion object {
        private const val SERVICE_PATH = "Bijstandsregelingen-v0500"
        const val SUWINET_DATEIN_PATTERN = "yyyyMMdd"
        private val objectFactory = ObjectFactory()
        private val logger = KotlinLogging.logger {}
    }
}

