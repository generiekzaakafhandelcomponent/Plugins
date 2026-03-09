package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.AanvraagPersoonResponse
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.BRPInfo
import com.ritense.valtimoplugins.dkd.brpdossierpersoongsd.Request
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import io.github.oshai.kotlinlogging.KotlinLogging
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.kotlin.whenever
import org.mockito.quality.Strictness
import kotlin.test.junit5.JUnit5Asserter.assertEquals


@MockitoSettings(strictness = Strictness.LENIENT)
internal class SuwinetBrpInfoServiceTest2 : BaseTest() {
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
    }

    @Test
    fun `retrieving BRP Aanvraag should return brp clientsuwi 241001420 with 2 nationality`() {
        // given
        val bsn = "241001420"
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
        assertEquals("found brp person nationaliteiten size should be 2", 2, (r["nationaliteit"] as List<*>).size)
    }
}
