package com.ritense.valtimoplugins.suwinet.service


import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfo
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfoResponse

import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito.*
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.kotlin.whenever
import org.mockito.quality.Strictness
import kotlin.test.assertEquals


@MockitoSettings(strictness = Strictness.LENIENT)
class SuwinetBijstandsregelingenServiceTest: BaseTest() {

    @Mock
    private lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    private lateinit var soapClientConfig: SuwinetSOAPClientConfig

    @Mock
    lateinit var info: BijstandsregelingenInfo

    private lateinit var service: SuwinetBijstandsregelingenService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        val dynamicResponseFactory = DynamicResponseFactory(jacksonObjectMapper())
        service = SuwinetBijstandsregelingenService(suwinetSOAPClient, dynamicResponseFactory)
        service.setConfig(soapClientConfig, "")
    }


    @Test
    fun `getBijstandsregelingenByBsn should return valid response for ClientSuwi`() {
        val bsn = "111111110"

        // when
        whenever(info.bijstandsregelingenInfo(any())).thenReturn(
            testHelper.unmarshal<BijstandsregelingenInfoResponse>(
                "Bijstandsregelingen_Info_111111110.xml"
            )
        )

        val result = service.getBijstandsregelingenByBsn(
            bsn, info,
            dynamicProperties = listOf("*")
        )?.dynamicProperties as Map<*, *>

        assertEquals(bsn, result["burgerservicenr"])
        assertEquals(2, (result["aanvraagUitkering"] as List<*>).size)
        assertEquals(2, (result["specifiekeGegevensBijzBijstand"] as List<*>).size)
        assertEquals(2, (result["vordering"] as List<*>).size)
    }
}
