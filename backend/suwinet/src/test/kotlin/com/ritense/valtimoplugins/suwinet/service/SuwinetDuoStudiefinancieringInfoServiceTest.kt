package com.ritense.valtimoplugins.suwinet.service


import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.DUOInfo
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.DUOStudiefinancieringInfo
import com.ritense.valtimoplugins.dkd.duodossierstudiefinancieringgsd.DUOStudiefinancieringInfoResponse
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
import kotlin.test.junit5.JUnit5Asserter.assertEquals

@MockitoSettings(strictness = Strictness.LENIENT)
internal class SuwinetDuoStudiefinancieringInfoServiceTest : BaseTest() {

    @Mock
    lateinit var duoInfoService: DUOInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    private lateinit var suwinetDuoStudiefinancieringInfoService: SuwinetDuoStudiefinancieringInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = mock()
        val dynamicResponseFactory = DynamicResponseFactory(jacksonObjectMapper())
        suwinetDuoStudiefinancieringInfoService = SuwinetDuoStudiefinancieringInfoService(suwinetSOAPClient, dynamicResponseFactory)
        suwinetDuoStudiefinancieringInfoService.setConfig(suwinetSOAPClientConfig, "")
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
            duoInfoService,
            dynamicProperties = listOf("*")
        )
        // then
        val r = result.dynamicProperties as Map<*, *>
        assertEquals("found bsn should be equal to input parameter", bsn, r["burgerservicenr"])
        val studiefinancieringen = r["studiefinanciering"] as List<*>
        assertEquals("found studiefinancieringen should be 5", 5, studiefinancieringen.size)
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
            duoInfoService,
            dynamicProperties = listOf("*")
        )

        // then
        assertEquals("result should have no properties when not found", true, result.properties.isEmpty())
    }
}
