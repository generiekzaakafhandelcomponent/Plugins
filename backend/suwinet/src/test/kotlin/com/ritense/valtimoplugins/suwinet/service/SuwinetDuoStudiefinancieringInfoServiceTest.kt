package com.ritense.valtimoplugins.suwinet.service


import com.ritense.valtimo.TestHelper
import com.ritense.valtimo.implementation.dkd.duodossierstudiefinancieringgsd.DUOInfo
import com.ritense.valtimo.implementation.dkd.duodossierstudiefinancieringgsd.DUOStudiefinancieringInfo
import com.ritense.valtimo.implementation.dkd.duodossierstudiefinancieringgsd.DUOStudiefinancieringInfoResponse
import com.ritense.valtimoplugins.BaseTest
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
internal class SuwinetDuoStudiefinancieringInfoServiceTest : BaseTest() {

    @Mock
    lateinit var duoInfoService: DUOInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    @InjectMocks
    lateinit var suwinetDuoStudiefinancieringInfoService: SuwinetDuoStudiefinancieringInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = mock()
        suwinetDuoStudiefinancieringInfoService.setConfig(suwinetSOAPClientConfig)
    }

    @Test
    fun `happy path retrieving duo studiefinanciering`() {
        // given
        val bsn = "999991954"

        // when
        whenever(duoInfoService.duoStudiefinancieringInfo(any(DUOStudiefinancieringInfo::class.java))).thenReturn(
            testHelper.unmarshal<DUOStudiefinancieringInfoResponse>(
                "DUODossierStudiefinancieringGSD_DUOStudiefinancieringInfo_999991954.xml"
            )
        )
        val result = suwinetDuoStudiefinancieringInfoService.getStudiefinancieringInfoByBsn(
            bsn,
            duoInfoService
        )
        // then
        assertEquals("found bsn should be equal to input parameter", result.burgerservicenummer, bsn)
        assertEquals("found studiefinancieringen should be 5", result.studiefinancieringen.size, 5)
    }

    @Test
    fun `unhappy path retrieving duo studiefinanciering niet gevonden`() {
        // given
        val bsn = "999991954"

        // when
        whenever(duoInfoService.duoStudiefinancieringInfo(any(DUOStudiefinancieringInfo::class.java))).thenReturn(
            testHelper.unmarshal<DUOStudiefinancieringInfoResponse>(
                "DUODossierStudiefinancieringGSD_DUOStudiefinancieringInfo_Nietsgevonden.xml"
            )
        )
        val result = suwinetDuoStudiefinancieringInfoService.getStudiefinancieringInfoByBsn(
            bsn,
            duoInfoService
        )

        // then
        assertEquals("found bsn should be equal to input parameter", result.burgerservicenummer, bsn)
    }

}
