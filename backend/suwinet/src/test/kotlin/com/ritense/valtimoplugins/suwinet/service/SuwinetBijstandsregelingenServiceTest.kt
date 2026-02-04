package com.ritense.valtimoplugins.suwinet.service


import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfo
import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfoResponse

import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.InjectMocks
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

    @Mock
    lateinit var dateTimeService: DateTimeService

    @InjectMocks
    private lateinit var service: SuwinetBijstandsregelingenService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
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

        val result = service.getBijstandsregelingenByBsn(bsn, info)

        assertEquals(bsn, result?.burgerservicenr)
        assertEquals(2, result?.aanvraagUitkeringen?.size)
        assertEquals(2, result?.specifiekeGegevensBijzBijstandList?.size)
        assertEquals(2, result?.vorderingen?.size)
    }
}
