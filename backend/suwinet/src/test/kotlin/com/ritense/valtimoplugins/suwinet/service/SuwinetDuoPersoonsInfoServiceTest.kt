package com.ritense.valtimoplugins.suwinet.service


import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOInfo
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOPersoonsInfo
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOPersoonsInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.any
import org.mockito.Mockito.mock
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.kotlin.whenever
import org.mockito.quality.Strictness
import kotlin.test.junit5.JUnit5Asserter.assertEquals

@MockitoSettings(strictness = Strictness.LENIENT)
internal class SuwinetDuoPersoonsInfoServiceTest : BaseTest() {

    @Mock
    lateinit var duoInfoService: DUOInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    @InjectMocks
    lateinit var suwinetDuoPersoonsInfoService: SuwinetDuoPersoonsInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = mock()
        suwinetDuoPersoonsInfoService.setConfig(suwinetSOAPClientConfig)
    }

    @Test
    fun `happy path retrieving duo persoonsinfo`() {
        // given
        val bsn = "999991954"

        // when
        whenever(duoInfoService.duoPersoonsInfo(any(DUOPersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<DUOPersoonsInfoResponse>(
                "DUODossierPersoonGSD_DUOPersoonsInfo_999991954.xml"
            )
        )
        val result = suwinetDuoPersoonsInfoService.getPersoonsInfoByBsn(
            bsn,
            duoInfoService
        )

        // then
        assertEquals("found bsn should be equal to input parameter", result.burgerservicenummer, bsn)
        assertEquals("number of onderwijsOvereenkomsten should be 1", result.onderwijsOvereenkomst.size, 1 )
        assertEquals("brin should match 20KD", result.onderwijsOvereenkomst.get(0).brin, "20KD" )
    }

    @Test
    fun `unhappy path retrieving duo persoonsinfo`() {
        // given
        val bsn = "333333330"

        // when
        whenever(duoInfoService.duoPersoonsInfo(any(DUOPersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<DUOPersoonsInfoResponse>(
                "DUOPersoonsInfoResponse_Nietsgevonden.xml"
            )
        )
        val result = suwinetDuoPersoonsInfoService.getPersoonsInfoByBsn(
            bsn,
            duoInfoService
        )

        // then
        assertEquals("found bsn should be equal to input parameter", result.burgerservicenummer, bsn)
        assertEquals("number of onderwijsOvereenkomsten should be 1", result.onderwijsOvereenkomst.size, 0 )
    }
}
