package com.ritense.valtimoplugins.suwinet.service


import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOInfo
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOPersoonsInfo
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOPersoonsInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito.any
import org.mockito.Mockito.mock
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.kotlin.whenever
import org.mockito.quality.Strictness
import kotlin.test.assertNull
import kotlin.test.junit5.JUnit5Asserter.assertEquals

@MockitoSettings(strictness = Strictness.LENIENT)
internal class SuwinetDuoPersoonsInfoServiceTest : BaseTest() {

    @Mock
    lateinit var duoInfoService: DUOInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    private lateinit var suwinetDuoPersoonsInfoService: SuwinetDuoPersoonsInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = mock()
        val dynamicResponseFactory = DynamicResponseFactory(jacksonObjectMapper())
        suwinetDuoPersoonsInfoService = SuwinetDuoPersoonsInfoService(suwinetSOAPClient, dynamicResponseFactory)
        suwinetDuoPersoonsInfoService.setConfig(suwinetSOAPClientConfig, "")
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
            duoInfoService,
            dynamicProperties = listOf("*")
        )

        // then
        val r = result?.dynamicProperties as Map<*, *>
        assertEquals("found bsn should be equal to input parameter", bsn, r["burgerservicenr"])
        val onderwijsOvereenkomst = r["onderwijsovereenkomst"] as List<*>
        assertEquals("number of onderwijsOvereenkomsten should be 1", 1, onderwijsOvereenkomst.size)
        val brinList = (onderwijsOvereenkomst[0] as Map<*, *>)["brin"] as List<*>
        assertEquals("brin should match 20KD", "20KD", (brinList[0] as Map<*, *>)["brinNr"])
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
            duoInfoService,
            dynamicProperties = listOf("*")
        )

        // then
        assertNull(result, "result should be null when not found")
    }
}
