package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.AanvraagPersoonResponse
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.BRPInfo
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.Request
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.model.NationaliteitDto
import com.ritense.valtimoplugins.suwinet.model.PersoonDto
import io.github.oshai.kotlinlogging.KotlinLogging
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.any
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.kotlin.whenever
import org.mockito.quality.Strictness
import kotlin.test.junit5.JUnit5Asserter.assertEquals


@MockitoSettings(strictness = Strictness.LENIENT)
internal class SuwinetBrpInfoServiceTest : BaseTest() {
    private val logger = KotlinLogging.logger {}

    @Mock
    lateinit var brpService: BRPInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    @Mock
    lateinit var nationaliteitenService: NationaliteitenService

    private lateinit var suwinetBrpInfoService: SuwinetBrpInfoService

    lateinit var testHelper: TestHelper

    lateinit var dateTimeService: DateTimeService

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        dateTimeService = DateTimeService()
        suwinetSOAPClient = Mockito.mock()
        nationaliteitenService = Mockito.mock()
        suwinetBrpInfoService = SuwinetBrpInfoService(suwinetSOAPClient, nationaliteitenService, dateTimeService)
        suwinetBrpInfoService.setConfig(suwinetSOAPClientConfig)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi including 4 child bsns`() {
        // given
        val bsn = "111111110"

        // when
        val paramBrpInfo = ArgumentCaptor.forClass(Request::class.java)
        whenever(
            brpService.aanvraagPersoon(paramBrpInfo.capture())
        ).thenAnswer {
            val brpRequest = it.arguments[0] as Request
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_${brpRequest.burgerservicenr}.xml"
            )
        }

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )

        // then
        assertEquals("found brp bsn should be as input", bsn, result?.bsn)
        assertEquals("found brp person kind size should be 4", 4, result?.kinderenBsns?.size)
        printResult(result)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi 111111110 with 5 nationalities`() {
        // given
        val bsn = "111111110"
        val cdNationaliteit1 = "0001".trimStart('0')
        val cdNationaliteit2 = "0002".trimStart('0')
        val cdNationaliteit3 = "0013".trimStart('0')
        val cdNationaliteit4 = "144".trimStart('0')
        val cdNationaliteit5 = "0175".trimStart('0')

        // when
        val paramBrpInfo = ArgumentCaptor.forClass(Request::class.java)
        whenever(
            brpService.aanvraagPersoon(paramBrpInfo.capture())
        ).thenAnswer {
            val brpRequest = it.arguments[0] as Request
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_${brpRequest.burgerservicenr}.xml"
            )
        }
        val nationaliteitDto1 = NationaliteitDto(cdNationaliteit1, "Nederland")
        val nationaliteitDto2 = NationaliteitDto(cdNationaliteit2,"Behandeld als Nederlander")
        val nationaliteitDtoOnbekend = NationaliteitDto(cdNationaliteit3,"Onbekend")
        val nationaliteitDto4 = NationaliteitDto(cdNationaliteit4,"Burger van Sáo Tomé en Principe")

        whenever(nationaliteitenService.getNationaliteit(cdNationaliteit1)).thenReturn(nationaliteitDto1)
        whenever(nationaliteitenService.getNationaliteit(cdNationaliteit2)).thenReturn(nationaliteitDto2)
        whenever(nationaliteitenService.getNationaliteit(cdNationaliteit3)).thenReturn(nationaliteitDtoOnbekend)
        whenever(nationaliteitenService.getNationaliteit(cdNationaliteit4)).thenReturn(nationaliteitDto4)
        whenever(nationaliteitenService.getNationaliteit(cdNationaliteit5)).thenReturn(nationaliteitDtoOnbekend)

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )

        // then
        assertEquals("found brp bsn should be as input", bsn, result?.bsn)
        assertEquals("found brp person nationaliteiten size should be 5", 5, result?.nationaliteiten?.size)
        assertEquals("found brp person nationaliteiten size should be nationality Nederland", nationaliteitDto1, result?.nationaliteiten?.get(0))
        assertEquals("found brp person nationaliteiten size should be an unknown nationality", nationaliteitDtoOnbekend, result?.nationaliteiten?.get(4))
        printResult(result)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi 241001420 with 1 nationality`() {
        // given
        val bsn = "241001420"

        // when
        val paramBrpInfo = ArgumentCaptor.forClass(Request::class.java)
        whenever(
            brpService.aanvraagPersoon(paramBrpInfo.capture())
        ).thenAnswer {
            val brpRequest = it.arguments[0] as Request
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_${brpRequest.burgerservicenr}.xml"
            )
        }
        val nationaliteitCode = "1"
        val nationaliteitDto = NationaliteitDto("1","Nederland")

        whenever(nationaliteitenService.getNationaliteit(nationaliteitCode)).thenReturn(nationaliteitDto)

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )

        // then
        assertEquals("found brp bsn should be as input", bsn, result?.bsn)
        assertEquals("found brp person nationaliteiten size should be 1", 1, result?.nationaliteiten?.size)
        printResult(result)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi 231001230 with 1 nationality`() {
        // given
        val bsn = "231001230"
        val nationaliteitCode1 = "1"
        val nationaliteitDto1 = NationaliteitDto( nationaliteitCode1,"Nederland")
        whenever(nationaliteitenService.getNationaliteit(nationaliteitCode1)).thenReturn(nationaliteitDto1)

        // when
        val paramBrpInfo = ArgumentCaptor.forClass(Request::class.java)
        whenever(
            brpService.aanvraagPersoon(paramBrpInfo.capture())
        ).thenAnswer {
            val brpRequest = it.arguments[0] as Request
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_${brpRequest.burgerservicenr}.xml"
            )
        }

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )

        // then
        assertEquals("found brp bsn should be as input", bsn, result?.bsn)
        assertEquals("found brp expected nationalities: 1", 1, result?.nationaliteiten?.size)
        printResult(result)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi including additional partner bsn`() {
        // given
        val bsn = "111111110"
        val partnerBsn = "999991954"

        // when
        val paramBrpInfo = ArgumentCaptor.forClass(Request::class.java)
        whenever(
            brpService.aanvraagPersoon(paramBrpInfo.capture())
        ).thenAnswer {
            val brpRequest = it.arguments[0] as Request
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_${brpRequest.burgerservicenr}.xml"
            )
        }

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )

        // then
        assertEquals("found brp bsn should be as input", bsn, result?.bsn)
        assertEquals("found brp partner bsn should be $partnerBsn", partnerBsn, result?.partnerBsn)
    }

    @Test
    fun `retrieving kinderen`() {
        // given
        val bsn = "243000017"

        // when
        whenever(brpService.aanvraagPersoon(any(Request::class.java))).thenReturn(
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_${bsn}.xml"
            )
        )

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )
        // then
        assertEquals("found brp bsn should be as input", bsn, result?.bsn)
    //      printResult(result)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi object without partner`() {
        // given
        val bsn = "444444440"

        // when
        whenever(brpService.aanvraagPersoon(any(Request::class.java))).thenReturn(
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_444444440.xml"
            )
        )

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )
        // then
        assertEquals("found brp bsn should be as input", bsn, result?.bsn)
        assertEquals("found brp bsn should be as input", "", result?.partnerBsn)
        printResult(result)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi object without children`() {
        // given
        val bsn = "444444440"

        // when
        whenever(brpService.aanvraagPersoon(any(Request::class.java))).thenReturn(
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_444444440.xml"
            )
        )

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )
        // then
        assertEquals("found brp bsn should be as input", bsn, result?.bsn)
        assertEquals("found brp person kind size should be 0", 0, result?.kinderenBsns?.size)
        printResult(result)
    }

    private fun printResult(result: PersoonDto?) {
        val mapper = jacksonObjectMapper().enable(SerializationFeature.INDENT_OUTPUT)
        val json = mapper.valueToTree<JsonNode>(result)
        val jout = mapper.writeValueAsString(json)
        logger.info { "----- ${jout}" }
    }

    @Test
    fun `retrieving BRP aanvraag persoon should return no value`() {
        // given
        val bsn = "333333330"

        // when
        whenever(brpService.aanvraagPersoon(any(Request::class.java))).thenReturn(
            testHelper.unmarshal<AanvraagPersoonResponse>(
                "BRPDossierPersoonGSD_AanvraagPersoon_Nietsgevonden.xml"
            )
        )

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService
        )
        // then
        assertEquals("person not found", null, result)
    }
}
