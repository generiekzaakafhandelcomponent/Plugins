package com.ritense.valtimoplugins.suwinet.service


import com.ritense.valtimo.TestHelper
import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.dkd.rdwdossier.KentekenInfo
import com.ritense.valtimoplugins.dkd.rdwdossier.KentekenInfoResponse
import com.ritense.valtimoplugins.dkd.rdwdossier.ObjectFactory
import com.ritense.valtimoplugins.dkd.rdwdossier.RDW
import com.ritense.valtimoplugins.dkd.rdwdossier.VoertuigbezitInfoPersoonResponse
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import io.github.oshai.kotlinlogging.KotlinLogging
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito
import org.mockito.Mockito.any
import org.mockito.junit.jupiter.MockitoSettings
import org.mockito.kotlin.whenever
import org.mockito.quality.Strictness
import kotlin.test.junit5.JUnit5Asserter.assertEquals

@MockitoSettings(strictness = Strictness.LENIENT)
internal class SuwinetRdwServiceTest : BaseTest() {
    private val logger = KotlinLogging.logger {}

    @Mock
    lateinit var rdwService: RDW

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    @Mock
    lateinit var dynamicResponseFactory: DynamicResponseFactory

    @InjectMocks
    lateinit var suwinetRdwService: SuwinetRdwService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = Mockito.mock()
        suwinetRdwService.setConfig(suwinetSOAPClientConfig, "")
    }

    @Test
    fun `retrieving voertuig bezit and details with 2 voertuigen from RDW suwinet to Motorvoertuigen lijst in doc`() {
        // given
        val bsn = "111111110"
        val kenteken_MH74DZ = "MH74DZ"
        val kenteken_16ZDLX = "16ZDLX"
        // when
        whenever(rdwService.voertuigbezitInfoPersoon(any())).thenReturn(
            testHelper.unmarshal<VoertuigbezitInfoPersoonResponse>(
                "RDWDossierGSD_VoertuigbezitInfoPersoon_111111110.xml"
            )
        )
        val paramKentekenInfo = ArgumentCaptor.forClass(KentekenInfo::class.java)
        whenever(
            rdwService.kentekenInfo(paramKentekenInfo.capture())
        ).thenAnswer {
            val kentekenInfo = it.arguments[0] as KentekenInfo
            testHelper.unmarshal<KentekenInfoResponse>(
                "RDWDossierGSD_KentekenInfo_${kentekenInfo.kentekenVoertuig}.xml"
            )
        }
        val result = suwinetRdwService.getVoertuigbezitInfoPersoonByBsn(bsn, rdwService, dynamicProperties = listOf("*"))
        // then
        assertEquals("found motorvoertuigen should be 2", result.motorVoertuigen.size, 2)
        assertEquals("found motorvoertuig should have kenteken", result.motorVoertuigen[0].propertiesMap["kenteken"], kenteken_MH74DZ)
        assertEquals("found motorvoertuig should have kenteken", result.motorVoertuigen[1].propertiesMap["kenteken"], kenteken_16ZDLX)
    }

    @Test
    fun `unhappy path return nietgevonden retrieving voertuig bezit`() {
        // given
        val bsn = "333333330"

        // when
        whenever(rdwService.voertuigbezitInfoPersoon(any())).thenReturn(
            testHelper.unmarshal<VoertuigbezitInfoPersoonResponse>(
                "RDWDossierGSD_VoertuigbezitInfoPersoon_Nietsgevonden.xml"
            )
        )
        val result = suwinetRdwService.getVoertuigbezitInfoPersoonByBsn(bsn, rdwService, dynamicProperties = listOf("*"))

        // then
        assertEquals("List motorvoertuigen should be empty", result.motorVoertuigen.size, 0)
    }

    @Test
    fun `retrieving voertuig bezit with 3 voertuigen from RDW with second details call kenteken not found to Motorvoertuigen lijst in doc`() {

        // given
        val bsn = "111111110"
        val kenteken_MH74DZ = "MH74DZ"
        val kenteken_AA00BB = "ONBEKE"
        val kenteken_16ZDLX = "16ZDLX"

        // when
        whenever(rdwService.voertuigbezitInfoPersoon(any())).thenReturn(
            testHelper.unmarshal<VoertuigbezitInfoPersoonResponse>(
                "RDWDossierGSD_VoertuigbezitInfoPersoon_111111110_voertuig_ontbreekt.xml"
            )
        )

        val paramKentekenInfo = ArgumentCaptor.forClass(KentekenInfo::class.java)
        whenever(
            rdwService.kentekenInfo(paramKentekenInfo.capture())
        ).thenAnswer {
            val kentekenInfo = it.arguments[0] as KentekenInfo
            testHelper.unmarshal<KentekenInfoResponse>(
                "RDWDossierGSD_KentekenInfo_${kentekenInfo.kentekenVoertuig}.xml"
            )
        }
        val result = suwinetRdwService.getVoertuigbezitInfoPersoonByBsn(bsn, rdwService, dynamicProperties = listOf("*"))
        result.motorVoertuigen.forEach {
            logger.info { "voertuig: ${it}" }
        }
        // then
        assertEquals("found motorvoertuigen should be 3", result.motorVoertuigen.size, 3)
        assertEquals("found motorvoertuig should have kenteken", result.motorVoertuigen[0].propertiesMap["kenteken"], kenteken_MH74DZ)
        assertEquals("found motorvoertuig should have kenteken", result.motorVoertuigen[1].propertiesMap["kenteken"], kenteken_AA00BB)
        assertEquals("found motorvoertuig should have kenteken", result.motorVoertuigen[2].propertiesMap["kenteken"], kenteken_16ZDLX)
    }

    @Test
    fun `happy flow retrieving voertuig bezit and details with 1 voertuig from RDW suwinet to Motorvoertuigen lijst in doc`() {
        // given
        val bsn = "444444440"
        val kenteken = "MH74DZ"

        // when
        whenever(rdwService.voertuigbezitInfoPersoon(any())).thenReturn(
            testHelper.unmarshal<VoertuigbezitInfoPersoonResponse>(
                "RDWDossierGSD_VoertuigbezitInfoPersoon_444444440.xml"
            )
        )
        whenever(rdwService.kentekenInfo(any())).thenReturn(
            testHelper.unmarshal<KentekenInfoResponse>(
                "RDWDossierGSD_KentekenInfo_MH74DZ.xml"
            )
        )

        val result = suwinetRdwService.getVoertuigbezitInfoPersoonByBsn(
            bsn,
            rdwService,
            dynamicProperties = listOf("*")
        )

        // then
        assertEquals("found motorvoertuigen should be 1", result.motorVoertuigen.size, 1)
        assertEquals("found motorvoertuig should have kenteken", result.motorVoertuigen[0].propertiesMap["kenteken"], kenteken)
    }

    @Test
    fun `should map RDW voertuig to SimpleMotorVoertuig with given kenteken`() {
        //given
        val kenteken = "AA00BB"
        val rdwVoertuig = getRdwVoertuig(kenteken)

        // when
        val simpleMotorvoertuig = suwinetRdwService.mapToSimpleMotorvoertuig(rdwVoertuig, listOf("*"))

        // then
        assertThat(simpleMotorvoertuig.propertiesMap.isNotEmpty())
        assertThat(simpleMotorvoertuig.propertiesMap["soortMotorvoertuig"])
    }

    @Test
    fun `should map RDW voertuig to empty simple motor voertuig with soort 'onbekend'`() {
        //given
        val rdwVoertuig = null

        // when
        val simpleMotorvoertuig = suwinetRdwService.mapToSimpleMotorvoertuig(rdwVoertuig, listOf("*"))

        // then
        assertThat(simpleMotorvoertuig.propertiesMap.isEmpty())
    }

    @Test
    fun `should map RDW voertuig to SimpleMotorVoertuig with soortvoertuig 'onbekend'`() {
        //given
        val kenteken = "AA00BB"
        val rdwVoertuig = getRdwVoertuig(kenteken)

        // when
        val simpleMotorvoertuig = suwinetRdwService.mapToSimpleMotorvoertuig(rdwVoertuig, listOf("*"))
        // then
        assertThat(simpleMotorvoertuig.propertiesMap.isNotEmpty())
    }

    @Test
    fun `should map RDW voertuig to SimpleMotorVoertuig with empty kenteken`() {
        //given
        val kenteken = ""
        val rdwVoertuig = getRdwVoertuig(kenteken)

        // when
        val simpleMotorvoertuig = suwinetRdwService.mapToSimpleMotorvoertuig(rdwVoertuig, listOf("*"))
        // then
        assertThat(simpleMotorvoertuig.propertiesMap.isNotEmpty())
    }

    private fun getRdwVoertuig(kenteken: String): KentekenInfoResponse.ClientSuwi.Aansprakelijke {
        val rdwVoertuig = ObjectFactory().createKentekenInfoResponseClientSuwiAansprakelijke()

        // Ensure voertuig is initialized
        if (rdwVoertuig.voertuig == null) {
            rdwVoertuig.voertuig = KentekenInfoResponse.ClientSuwi.Aansprakelijke.Voertuig()
        }
        rdwVoertuig.voertuig.kentekenVoertuig = kenteken
        return rdwVoertuig
    }
}
