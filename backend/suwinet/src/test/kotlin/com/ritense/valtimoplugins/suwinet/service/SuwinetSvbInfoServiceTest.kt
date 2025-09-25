package com.ritense.valtimoplugins.suwinet.service


import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBInfo
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBPersoonsInfo
import com.ritense.valtimoplugins.dkd.svbdossierpersoongsd.SVBPersoonsInfoResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.model.CodesUitkeringsperiodeDto
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


//private const val suwinetDateInPattern = "yyyyMMdd"
//private val dateInFormatter: DateTimeFormatter = DateTimeFormatter.ofPattern(suwinetDateInPattern)

@MockitoSettings(strictness = Strictness.LENIENT)
internal class SuwinetSvbInfoServiceTest : BaseTest() {
    private val logger = KotlinLogging.logger {}

    @Mock
    lateinit var svbInfo: SVBInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    @Mock
    lateinit var codesUitkeringsperiodeService: CodesUitkeringsperiodeService

    @InjectMocks
    lateinit var suwinetSVBPersoonsInfoService: SuwinetSvbPersoonsInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = Mockito.mock()
        codesUitkeringsperiodeService = Mockito.mock()
        suwinetSVBPersoonsInfoService.setConfig(suwinetSOAPClientConfig)
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
        val codeUitkeringsperiode = CodesUitkeringsperiodeDto(
            "6",
            "maand"
        )
        whenever(codesUitkeringsperiodeService.getCodesUitkeringsperiode("6")).thenReturn(codeUitkeringsperiode)

        val result = suwinetSVBPersoonsInfoService.getPersoonsgegevensByBsn(
            bsn,
            svbInfo,
            3
        )
        logger.info { "$result" }
        assertEquals("found svb bsn should be contain 2 uitkeringen", 2, result?.svbUitkeringen?.size)
        val aow = result?.svbUitkeringen?.first { it.codeSzWet == "AOW" }
        assertEquals("found svb total AOW uitkering periodes:", 3, aow?.periodes?.size)
        val ww = result?.svbUitkeringen?.first { it.codeSzWet == "AIO" }
        assertEquals("found svb total  WW uitkering periodes:", 3, ww?.periodes?.size)
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
            2
        )
        // then
        assertEquals("found svb bsn should be contain 1 uitkering", 1, result?.svbUitkeringen?.size)
        val aow = result?.svbUitkeringen?.first { it.codeSzWet == "AOW" }
        assertEquals("found svb total AOW uitkering periodes:", 2, aow?.periodes?.size)
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
            3
        )
        // then
        assertEquals("no uitkeringen not found", null, result)
    }

//    private fun getTotalBedrag(dto: SvbDto?, brutoNetto: BrutoNetto): BigDecimal? {
//        return dto?.uitkeringen?.sumOf { uitkeringsverhouding ->
//            uitkeringsverhouding.uitkeringsPeriode.sumOf { uitkeringsPeriode ->
//                uitkeringsPeriode.uitkeringsBedrag.filter { uitkeringsBedrag ->
//                    uitkeringsBedrag.brutoOfNetto.type == brutoNetto.type
//                }.sumOf{ it.waardeBedrag }
//            }
//        }
//    }
//

}
