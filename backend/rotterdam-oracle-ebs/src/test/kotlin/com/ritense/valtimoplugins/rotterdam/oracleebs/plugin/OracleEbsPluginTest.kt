package com.ritense.valtimoplugins.rotterdam.oracleebs.plugin

import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.BoekingType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurKlasse
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.JournaalpostRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NatuurlijkPersoon
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NietNatuurlijkPersoon
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.SaldoSoort
import com.ritense.valtimoplugins.rotterdam.oracleebs.service.EsbClient
import com.ritense.valueresolver.ValueResolverService
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.assertj.core.api.Assertions.assertThat
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.community.mockito.delegate.DelegateExecutionFake
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import java.time.LocalDateTime

class OracleEbsPluginTest {

    private lateinit var mockWebServer: MockWebServer

    private lateinit var esbClient: EsbClient
    private lateinit var valueResolverService: ValueResolverService

    private lateinit var plugin: OracleEbsPlugin

    @BeforeEach
    fun setUp() {
        mockWebServer = MockWebServer().apply {
            start()
        }

        esbClient = EsbClient()
        valueResolverService = mock()

        plugin = OracleEbsPlugin(
            esbClient, valueResolverService
        ).apply {
            this.baseUrl = mockWebServer.url("/").toUri()
            this.authenticationEnabled = "false"
        }
    }

    @AfterEach
    fun tearDown() {
        mockWebServer.shutdown()
    }

    @Test
    fun `should resolve values`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")
            .withVariable("invoiceAmount", 124.78)
        val invoiceAmount = 124.78
        val lastModified = LocalDateTime.parse("2025-03-19T16:15:30")
        val firstName = "John"
        val fixedValueA = "Fixed Value A"
        val fixedValueB = "Fixed Value B"

        val valuesToResolve = mapOf(
            "invoiceAmount" to "pv:invoiceAmount",
            "userFirstName" to "doc:/user/firstName",
            "caseLastModified" to "case:lastModified",
            "fixedValueA" to fixedValueA,
            "fixedValueB" to fixedValueB
        )

        whenever(valueResolverService.resolveValues(any<String>(), any<DelegateExecution>(), any()))
            .thenReturn(mapOf(
                "pv:invoiceAmount" to invoiceAmount,
                "doc:/user/firstName" to firstName,
                "case:lastModified" to lastModified
            ))

        // when
        plugin.resolveValuesFor(
            execution = execution,
            params = valuesToResolve
        ).let { actual ->
            // then
            assertThat(actual).containsKeys(
                "invoiceAmount", "userFirstName", "caseLastModified", "fixedValueA", "fixedValueB"
            )
            assertThat(actual["invoiceAmount"]).isEqualTo(invoiceAmount)
            assertThat(actual["userFirstName"]).isEqualTo(firstName)
            assertThat(actual["caseLastModified"]).isEqualTo(lastModified)
            assertThat(actual["fixedValueA"]).isEqualTo(fixedValueA)
            assertThat(actual["fixedValueB"]).isEqualTo(fixedValueB)
        }
    }

    @Test
    fun `should push journaalpost`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse("""{
            "isGeslaagd": true,
            "foutcode": null,
            "foutmelding": null,
            "melding": null
        }""".trimIndent())

        // when & then
        assertDoesNotThrow {
            plugin.journaalpostOpvoeren(
                execution = execution,
                procesCode = "98332",
                referentieNummer= "2025-AGV-123456",
                sleutel= "784",
                boekdatumTijd= "2025-03-28T13:34:26+02:00",
                categorie= "Vergunningen",
                saldoSoort = SaldoSoort.Werkelijk,
                omschrijving= "Aanvraag Omgevingsvergunning",
                boekjaar= "2025",
                boekperiode= "2",
                regels = listOf(
                    JournaalpostRegel(
                        grootboekSleutel = "600",
                        boekingType = BoekingType.Credit,
                        bedrag = "150,00",
                        omschrijving = "Afboeken"
                    ),
                    JournaalpostRegel(
                        grootboekSleutel = "400",
                        boekingType = BoekingType.Debet,
                        bedrag = "150",
                        omschrijving = "Inboeken"
                    )
                )
            )
        }

        mockWebServer.takeRequest().let { recordedRequest ->
            assertThat(recordedRequest.method)
                .isEqualTo(HttpMethod.POST.name())
            assertThat(recordedRequest.path)
                .isEqualTo("/journaalpost/opvoeren")
        }
    }

    @Test
    fun `should push verkoopfactuur`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse("""{
            "isGeslaagd": true,
            "foutcode": null,
            "foutmelding": null,
            "melding": null
        }""".trimIndent())

        // when & then
        assertDoesNotThrow {
            plugin.verkoopfactuurOpvoeren(
                execution = execution,
                procesCode = "98332",
                referentieNummer= "2025-AGV-123456",
                factuurKlasse = FactuurKlasse.Creditnota,
                inkoopOrderReferentie = "20250328-098",
                natuurlijkPersoon = NatuurlijkPersoon(
                    achternaam = "Janssen",
                    voornamen = "Jan"
                ),
                nietNatuurlijkPersoon = NietNatuurlijkPersoon(
                    statutaireNaam = "J.Janssen - Groenten en Fruit"
                ),
                regels = listOf(
                    FactuurRegel(
                        hoeveelheid = "25",
                        tarief = "3,58",
                        btwPercentage = "21",
                        grootboekSleutel = "700",
                        omschrijving = "Kilo kruimige aardappelen"
                    )
                )
            )
        }

        mockWebServer.takeRequest().let { recordedRequest ->
            assertThat(recordedRequest.method)
                .isEqualTo(HttpMethod.POST.name())
            assertThat(recordedRequest.path)
                .isEqualTo("/verkoopfactuur/opvoeren")
        }
    }

    private fun mockOkResponse(body: String) {
        MockResponse()
            .setResponseCode(HttpStatus.OK.value())
            .addHeader("Content-Type", "application/json; charset=utf-8")
            .setBody(body).let { response ->
                mockWebServer.enqueue(response)
            }
    }
}
