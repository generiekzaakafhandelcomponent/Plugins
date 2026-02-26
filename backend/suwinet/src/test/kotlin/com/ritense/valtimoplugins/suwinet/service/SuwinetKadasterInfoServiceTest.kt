package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimo.implementation.dkd.KadasterInfo.*

import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.model.KadastraleObjectDto
import io.github.oshai.kotlinlogging.KotlinLogging
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
internal class SuwinetKadasterInfoServiceTest : BaseTest() {
    private val logger = KotlinLogging.logger {}

    @Mock
    lateinit var kadasterService: KadasterInfo

    @Mock
    lateinit var suwinetSOAPClient: SuwinetSOAPClient

    @Mock
    lateinit var suwinetSOAPClientConfig: SuwinetSOAPClientConfig

    @InjectMocks
    lateinit var suwinetKadasterInfoService: SuwinetKadasterInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = Mockito.mock()
        suwinetKadasterInfoService.setConfig(suwinetSOAPClientConfig, "")
    }
    @Test
    fun `retrieving kadaster persoonsinfo with not found bsn should return empty list`() {
        // given
        val bsn = "333333330"

        // when
        whenever(kadasterService.persoonsInfo(any(PersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<PersoonsInfoResponse>(
                "KadasterDossierGSD_PersoonsInfo_Nietsgevonden.xml"
            )
        )

        val result = suwinetKadasterInfoService.getPersoonsinfoByBsn(
            bsn,
            kadasterService
        )

        // then
        assertEquals("found kadastrale objecten should be empty", 0, result.onroerendeGoederen.size)
    }
    @Test
    fun `retrieving kadaster persoonsinfo should return only the found kadastrale objecten and skip the missing`() {
        // given
        val bsn = "111111110"

        // when
        whenever(kadasterService.persoonsInfo(any(PersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<PersoonsInfoResponse>(
                "KadasterDossierGSD_PersoonsInfo_111111110_object_nietgevonden.xml"
            )
        )

        val param = ArgumentCaptor.forClass(ObjectInfoKadastraleAanduiding::class.java)
        whenever(
            kadasterService.objectInfoKadastraleAanduiding(param.capture())
        ).thenAnswer {
            val ka = it.arguments[0] as ObjectInfoKadastraleAanduiding
            testHelper.unmarshal<ObjectInfoKadastraleAanduidingResponse>(
                "KadasterDossierGSD_ObjectInfoKadastraleAanduiding_${ka.cdKadastraleGemeente}_${ka.kadastraalPerceelnr}.xml"
            )
        }
        val result = suwinetKadasterInfoService.getPersoonsinfoByBsn(
            bsn,
            kadasterService
        )

        printResult(result)
        // then
        assertEquals("found kadastrale objecten should be 3", 3, result.onroerendeGoederen.size)
    }


    private fun printResult(result: KadastraleObjectDto) {
        val mapper = jacksonObjectMapper().enable(SerializationFeature.INDENT_OUTPUT)
        val json = mapper.valueToTree<JsonNode>(result)
        val jout = mapper.writeValueAsString(json)
        logger.info { "----- ${jout}" }
    }

    @Test
    fun `retrieving kadaster persoonsinfo should return all included kadastrale objecten`() {
        // given
        val bsn = "111111110"

        // when
        whenever(kadasterService.persoonsInfo(any(PersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<PersoonsInfoResponse>(
                "KadasterDossierGSD_PersoonsInfo_111111110.xml"
            )
        )

        val param = ArgumentCaptor.forClass(ObjectInfoKadastraleAanduiding::class.java)
        whenever(
            kadasterService.objectInfoKadastraleAanduiding(param.capture())
        ).thenAnswer {
            val ka = it.arguments[0] as ObjectInfoKadastraleAanduiding
            testHelper.unmarshal<ObjectInfoKadastraleAanduidingResponse>(
                "KadasterDossierGSD_ObjectInfoKadastraleAanduiding_${ka.cdKadastraleGemeente}_${ka.kadastraalPerceelnr}.xml"
            )
        }
        val result = suwinetKadasterInfoService.getPersoonsinfoByBsn(
            bsn,
            kadasterService
        )

        // then
        assertEquals("found kadastrale objecten should be 4", 4, result.onroerendeGoederen.size)
    }
}
