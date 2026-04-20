package com.ritense.valtimoplugins.suwinet.service


import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVIkvInfo
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVPersoonsIkvInfo
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVPersoonsIkvInfoResponse
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
internal class SuwinetUwvPersoonsIkvServiceTest : BaseTest() {
    private val logger = KotlinLogging.logger {}

    @Mock
    lateinit var uwvService: UWVIkvInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    private lateinit var suwinetUwvPersoonsIkvService: SuwinetUwvPersoonsIkvService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = Mockito.mock()
        val dynamicResponseFactory = DynamicResponseFactory(jacksonObjectMapper())
        suwinetUwvPersoonsIkvService = SuwinetUwvPersoonsIkvService(
            suwinetSOAPClient,
            dynamicResponseFactory
        )
        suwinetUwvPersoonsIkvService.setConfig(suwinetSOAPClientConfig, "")
    }

    @Test
    fun `retrieving UWV persoonsinfo should return ikv info node`() {
        // given
        val bsn = "243000388"

        // when
        whenever(uwvService.uwvPersoonsIkvInfo(any(UWVPersoonsIkvInfo::class.java))).thenReturn(
            testHelper.unmarshal<UWVPersoonsIkvInfoResponse>(
                "UWVDossierInkomstenGSD_UWVPersoonsIkvInfo_243000388.xml"
            )
        )

        val result = suwinetUwvPersoonsIkvService.getUWVInkomstenInfoByBsn(
            bsn,
            uwvService,
            dynamicProperties = listOf("*")
        )

        // then
        val inkomstenverhouding = (result.dynamicProperties as Map<*, *>)["inkomstenverhouding"] as List<*>
        assertEquals("found bsn should be equal", 1, inkomstenverhouding.size)
    }

    @Test
    fun `retrieving UWV persoonsinfo should return ikv info node 111111110`() {
        // given
        val bsn = "111111110"

        // when
        whenever(uwvService.uwvPersoonsIkvInfo(any(UWVPersoonsIkvInfo::class.java))).thenReturn(
            testHelper.unmarshal<UWVPersoonsIkvInfoResponse>(
                "UWVDossierInkomstenGSD_UWVPersoonsIkvInfo_111111110.xml"
            )
        )
        val result = suwinetUwvPersoonsIkvService.getUWVInkomstenInfoByBsn(
            bsn,
            uwvService,
            dynamicProperties = listOf("*")
        )
        // then
        val inkomstenverhouding = (result.dynamicProperties as Map<*, *>)["inkomstenverhouding"] as List<*>
        assertEquals("found bsn should be equal", 2, inkomstenverhouding.size)
        val opgaven0 = ((inkomstenverhouding[0] as Map<*, *>)["inkomstenopgave"] as List<*>)
        val opgaven1 = ((inkomstenverhouding[1] as Map<*, *>)["inkomstenopgave"] as List<*>)
        assertEquals("found opgaven should be equal to", 1, opgaven0.size)
        assertEquals("found opgaven should be equal to", 37, opgaven1.size)
    }

    @Test
    fun `retrieving UWV persoonsinfo should return ikv info node over long period`() {
        // given
        val bsn = "243000388"

        // when
        whenever(uwvService.uwvPersoonsIkvInfo(any(UWVPersoonsIkvInfo::class.java))).thenReturn(
            testHelper.unmarshal<UWVPersoonsIkvInfoResponse>(
                "UWVDossierInkomstenGSD_UWVPersoonsIkvInfo_243000388_1.xml"
            )
        )
        val result = suwinetUwvPersoonsIkvService.getUWVInkomstenInfoByBsn(
            bsn,
            uwvService,
            dynamicProperties = listOf("*")
        )
        // then
        val inkomstenverhouding = (result.dynamicProperties as Map<*, *>)["inkomstenverhouding"] as List<*>
        assertEquals("found bsn should be equal", 1, inkomstenverhouding.size)
    }

    @Test
    fun `retrieving UWV persoonsinfo should return 4 verhoudingen`() {
        // given
        val bsn = "768510338"

        // when
        whenever(uwvService.uwvPersoonsIkvInfo(any(UWVPersoonsIkvInfo::class.java))).thenReturn(
            testHelper.unmarshal<UWVPersoonsIkvInfoResponse>(
                "UWVDossierInkomstenGSD_UWVPersoonsIkvInfo_444444440.xml"
            )
        )

        val result = suwinetUwvPersoonsIkvService.getUWVInkomstenInfoByBsn(
            bsn,
            uwvService,
            dynamicProperties = listOf("*")
        )
        logger.info { "$result" }
        // then
        val inkomstenverhouding = (result.dynamicProperties as Map<*, *>)["inkomstenverhouding"] as List<*>
        assertEquals("found bsn should be equal", 4, inkomstenverhouding.size)
    }

    @Test
    fun `retrieving UWV persoonsinfo should return no value`() {
        // given
        val bsn = "111111110"

        // when
        whenever(uwvService.uwvPersoonsIkvInfo(any(UWVPersoonsIkvInfo::class.java))).thenReturn(
            testHelper.unmarshal<UWVPersoonsIkvInfoResponse>(
                "UWVDossierInkomstenGSD_UWVPersoonsIkvInfo_Nietsgevonden.xml"
            )
        )

        val result = suwinetUwvPersoonsIkvService.getUWVInkomstenInfoByBsn(
            bsn,
            uwvService,
            dynamicProperties = listOf("*")
        )

        // then
        assertEquals("found uwv clientsuwi should be empty", true, result.properties.isEmpty())
    }
}
