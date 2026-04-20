package com.ritense.valtimoplugins.suwinet.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.valtimo.TestHelper
import com.ritense.valtimo.implementation.dkd.KadasterInfo.*

import com.ritense.valtimoplugins.BaseTest
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import com.ritense.valtimoplugins.suwinet.dynamic.DynamicResponseFactory
import io.github.oshai.kotlinlogging.KotlinLogging
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
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

    private lateinit var suwinetKadasterInfoService: SuwinetKadasterInfoService

    lateinit var testHelper: TestHelper

    @BeforeEach
    fun setup() {
        testHelper = TestHelper
        suwinetSOAPClient = Mockito.mock()
        val dynamicResponseFactory = DynamicResponseFactory(jacksonObjectMapper())
        suwinetKadasterInfoService = SuwinetKadasterInfoService(suwinetSOAPClient, dynamicResponseFactory)
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

        val result = suwinetKadasterInfoService.getKadastraleAanduidingenByBsn(
            bsn,
            kadasterService,
            dynamicProperties = listOf("*")
        )

        // then
        assertEquals("found kadastrale aanduidingen should be empty", true, result.properties.isEmpty())
    }

    @Test
    fun `retrieving kadaster persoonsinfo should return all kadastraale aanduidingen including those with missing object info`() {
        // given
        val bsn = "111111110"

        // when
        whenever(kadasterService.persoonsInfo(any(PersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<PersoonsInfoResponse>(
                "KadasterDossierGSD_PersoonsInfo_111111110_object_nietgevonden.xml"
            )
        )

        val result = suwinetKadasterInfoService.getKadastraleAanduidingenByBsn(
            bsn,
            kadasterService,
            dynamicProperties = listOf("*")
        )

        printResult(result.dynamicProperties)
        // then
        assertEquals("found kadastrale aanduidingen should be 4", 4, (result.dynamicProperties as List<*>).size)
    }

    private fun printResult(result: Any?) {
        val mapper = jacksonObjectMapper().enable(SerializationFeature.INDENT_OUTPUT)
        val json = mapper.valueToTree<JsonNode>(result)
        val jout = mapper.writeValueAsString(json)
        logger.info { "----- ${jout}" }
    }

    @Test
    fun `retrieving kadaster persoonsinfo should return all included kadastrale aanduidingen`() {
        // given
        val bsn = "111111110"

        // when
        whenever(kadasterService.persoonsInfo(any(PersoonsInfo::class.java))).thenReturn(
            testHelper.unmarshal<PersoonsInfoResponse>(
                "KadasterDossierGSD_PersoonsInfo_111111110.xml"
            )
        )

        val result = suwinetKadasterInfoService.getKadastraleAanduidingenByBsn(
            bsn,
            kadasterService,
            dynamicProperties = listOf("*")
        )

        // then
        assertEquals("found kadastrale aanduidingen should be 4", 4, (result.dynamicProperties as List<*>).size)
    }
}
