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
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import com.ritense.valtimoplugins.suwinet.model.DynamicResponseDto
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

    private lateinit var suwinetBrpInfoService: SuwinetBrpInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = Mockito.mock()
        val dynamicResponseFactory = DynamicResponseFactory(jacksonObjectMapper())
        suwinetBrpInfoService = SuwinetBrpInfoService(suwinetSOAPClient, dynamicResponseFactory)
        suwinetBrpInfoService.setConfig(suwinetSOAPClientConfig, "")
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
            brpService,
            dynamicProperties = listOf("*")
        )

        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found brp bsn should be as input", bsn, r["burgerservicenr"])
        assertEquals("found brp person kind size should be 4", 4, (r["kind"] as List<*>).size)
        printResult(result)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi 111111110 with 5 nationalities`() {
        // given
        val bsn = "111111110"
        val cdNationaliteit1 = "0001"

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
            brpService,
            dynamicProperties = listOf("*")
        )

        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found brp bsn should be as input", bsn, r["burgerservicenr"])
        val nationaliteit = r["nationaliteit"] as List<*>
        assertEquals("found brp person nationaliteiten size should be 5", 5, nationaliteit.size)
        assertEquals("first nationaliteit cdNationaliteit should be 0001", cdNationaliteit1, (nationaliteit[0] as Map<*, *>)["cdNationaliteit"])
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

        val result = suwinetBrpInfoService.getPersoonsgegevensByBsn(
            bsn,
            brpService,
            dynamicProperties = listOf("*")
        )

        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found brp bsn should be as input", bsn, r["burgerservicenr"])
        assertEquals("found brp person nationaliteiten size should be 2", 2, (r["nationaliteit"] as List<*>).size)
        printResult(result)
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi 231001230 with 2 nationality`() {
        // given
        val bsn = "231001230"

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
            brpService,
            dynamicProperties = listOf("*")
        )

        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found brp bsn should be as input", bsn, r["burgerservicenr"])
        assertEquals("found brp expected nationalities: 2", 2, (r["nationaliteit"] as List<*>).size)
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
            brpService,
            dynamicProperties = listOf("*")
        )

        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found brp bsn should be as input", bsn, r["burgerservicenr"])
        val huwelijk = r["huwelijk"] as List<*>
        val partner = (huwelijk[0] as Map<*, *>)["partner"] as Map<*, *>
        assertEquals("found brp partner bsn should be $partnerBsn", partnerBsn, partner["burgerservicenr"])
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
            brpService,
            dynamicProperties = listOf("*")
        )
        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found brp bsn should be as input", bsn, r["burgerservicenr"])
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
            brpService,
            dynamicProperties = listOf("*")
        )
        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found brp bsn should be as input", bsn, r["burgerservicenr"])
        val huwelijk = r["huwelijk"] as? List<*>
        val partnerBsn = huwelijk?.firstOrNull()
            ?.let { (it as Map<*, *>)["partner"] as? Map<*, *> }
            ?.get("burgerservicenr")
        assertEquals("found brp bsn without partner should have empty partner bsn", true, partnerBsn == null || partnerBsn == "")
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
            brpService,
            dynamicProperties = listOf("*")
        )
        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found brp bsn should be as input", bsn, r["burgerservicenr"])
        val kind = r["kind"] as? List<*>
        assertEquals("found brp person kind size should be 0", 0, kind?.size ?: 0)
        printResult(result)
    }

    private fun printResult(result: DynamicResponseDto?) {
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
            brpService,
            dynamicProperties = listOf("*")
        )
        // then
        assertEquals("person not found", null, result)
    }
}
