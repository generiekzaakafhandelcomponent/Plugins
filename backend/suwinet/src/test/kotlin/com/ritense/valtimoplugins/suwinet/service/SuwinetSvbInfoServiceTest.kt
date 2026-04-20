package com.ritense.valtimoplugins.suwinet.service


import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBInfo
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBPersoonsInfo
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBPersoonsInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import io.github.oshai.kotlinlogging.KotlinLogging
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.any
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.kotlin.whenever
import org.mockito.quality.Strictness
import kotlin.test.junit5.JUnit5Asserter.assertEquals

@MockitoSettings(strictness = Strictness.LENIENT)
internal class SuwinetSvbInfoServiceTest : BaseTest() {
    private val logger = KotlinLogging.logger {}

    @Mock
    lateinit var svbInfo: SVBInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    private lateinit var suwinetSVBPersoonsInfoService: SuwinetSvbPersoonsInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = Mockito.mock()
        val dynamicResponseFactory = DynamicResponseFactory(jacksonObjectMapper())
        suwinetSVBPersoonsInfoService = SuwinetSvbPersoonsInfoService(suwinetSOAPClient, dynamicResponseFactory)
        suwinetSVBPersoonsInfoService.setConfig(suwinetSOAPClientConfig, "")
    }

    @Test
    fun `retrieving SVB Aanvraag should return svbDto that includes 2 uitkeringen`() {
        // given
        val bsn = "111111110"

        // when
        whenever(svbInfo.svbPersoonsInfo(any(SVBPersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<SVBPersoonsInfoResponse>(
                "SVBDossierPersoonGSD_SVBPersoonsInfo_111111110.xml"
            )
        )

        val result = suwinetSVBPersoonsInfoService.getPersoonsgegevensByBsn(
            bsn,
            svbInfo,
            dynamicProperties = listOf("*")
        )
        logger.info { "$result" }
        val uitkeringsverhouding = (result.dynamicProperties as Map<*, *>)["uitkeringsverhouding"] as List<*>
        assertEquals("found svb bsn should be contain 2 uitkeringen", 2, uitkeringsverhouding.size)
    }

    @Test
    fun `retrieving SVB persoons info should return one AOW uitkering`() {
        // given
        val bsn = "444444440"

        // when
        whenever(svbInfo.svbPersoonsInfo(any(SVBPersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<SVBPersoonsInfoResponse>(
                "SVBDossierPersoonGSD_SVBPersoonsInfo_444444440.xml"
            )
        )
        val result = suwinetSVBPersoonsInfoService.getPersoonsgegevensByBsn(
            bsn,
            svbInfo,
            dynamicProperties = listOf("*")
        )
        // then
        val uitkeringsverhouding = (result.dynamicProperties as Map<*, *>)["uitkeringsverhouding"] as List<*>
        assertEquals("found svb bsn should be contain 1 uitkering", 1, uitkeringsverhouding.size)
    }

    @Test
    fun `retrieving SVB persoons info should return no value`() {
        // given
        val bsn = "333333330"

        // when
        whenever(svbInfo.svbPersoonsInfo(any(SVBPersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<SVBPersoonsInfoResponse>(
                "SVBDossierPersoonGSD_SVBPersoonsInfo_Nietsgevonden.xml"
            )
        )

        val result = suwinetSVBPersoonsInfoService.getPersoonsgegevensByBsn(
            bsn,
            svbInfo,
            dynamicProperties = listOf("*")
        )
        // then
        assertEquals("no uitkeringen not found", true, result.properties.isEmpty())
    }
}
