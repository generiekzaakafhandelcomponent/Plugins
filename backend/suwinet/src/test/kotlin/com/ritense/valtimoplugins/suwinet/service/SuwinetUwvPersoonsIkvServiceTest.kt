package com.ritense.valtimoplugins.suwinet.service


import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVIkvInfo
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVPersoonsIkvInfo
import com.ritense.valtimoplugins.dkd.UWVDossierInkomstenGSD.UWVPersoonsIkvInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import io.github.oshai.kotlinlogging.KotlinLogging
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
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
    lateinit var dateTimeService: DateTimeService

    @Mock
    lateinit var uwvSoortIkvService: UwvSoortIkvService

    @Mock
    lateinit var uwvCodeService: UwvCodeService

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    @InjectMocks
    lateinit var suwinetUwvPersoonsIkvService: SuwinetUwvPersoonsIkvService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = Mockito.mock()
        dateTimeService = DateTimeService()
        uwvCodeService = UwvCodeService()
        uwvSoortIkvService = UwvSoortIkvService()
        suwinetUwvPersoonsIkvService = SuwinetUwvPersoonsIkvService(
            suwinetSOAPClient,
            dateTimeService,
            uwvCodeService,
            uwvSoortIkvService
        )
        suwinetUwvPersoonsIkvService.setConfig(suwinetSOAPClientConfig)
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
            3
        )

        // then
        assertEquals("found bsn should be equal", 1, result?.inkomsten?.size)
    }

    @Test
    fun `retrieving UWV persoonsinfo should return ikv info node 111111110`() {
        // given
        val bsn = "111111110"
        val maxPeriods = 3
        // when
        whenever(uwvService.uwvPersoonsIkvInfo(any(UWVPersoonsIkvInfo::class.java))).thenReturn(
            testHelper.unmarshal<UWVPersoonsIkvInfoResponse>(
                "UWVDossierInkomstenGSD_UWVPersoonsIkvInfo_111111110.xml"
            )
        )
        val result = suwinetUwvPersoonsIkvService.getUWVInkomstenInfoByBsn(
            bsn,
            uwvService,
            maxPeriods
        )
        // then
        assertEquals("found bsn should be equal", 2, result?.inkomsten?.size)
        assertEquals("found opgaven should be equal to", 1, result?.inkomsten?.get(0)?.opgaven?.size)
        assertEquals("found opgaven should be equal to", maxPeriods, result?.inkomsten?.get(1)?.opgaven?.size)
    }

    @Test
    fun `retrieving UWV persoonsinfo should return ikv info node over long period`() {
        // given
        val bsn = "243000388"
        val maxPeriods = 4
        // when
        whenever(uwvService.uwvPersoonsIkvInfo(any(UWVPersoonsIkvInfo::class.java))).thenReturn(
            testHelper.unmarshal<UWVPersoonsIkvInfoResponse>(
                "UWVDossierInkomstenGSD_UWVPersoonsIkvInfo_243000388_1.xml"
            )
        )
        val result = suwinetUwvPersoonsIkvService.getUWVInkomstenInfoByBsn(
            bsn,
            uwvService,
            maxPeriods
        )
        // then
        assertEquals("found bsn should be equal", 1, result?.inkomsten?.size)
        assertEquals("found inkomsten opgaven should be equal", maxPeriods, result?.inkomsten?.get(0)?.opgaven?.size)
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
            3
        )
        logger.info { "$result" }
        // then
        assertEquals("found bsn should be equal", 4, result?.inkomsten?.size)
        logger.info { "0 - ${result?.inkomsten?.get(0)?.opgaven?.size}" }
        logger.info { "1 - ${result?.inkomsten?.get(1)?.opgaven?.size}" }
        logger.info { "2 - ${result?.inkomsten?.get(2)?.opgaven?.size}" }
        logger.info { "3 - ${result?.inkomsten?.get(3)?.opgaven?.size}" }
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
            3
        )

        // then
        assertEquals("found uwv clientsuwi should be null", null, result)
    }
}
