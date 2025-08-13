package com.ritense.valtimoplugins.rotterdam.oracleebs.plugin

import com.fasterxml.jackson.module.kotlin.treeToValue
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimoplugins.mtlssslcontext.MTlsSslContext
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.AdresLocatie
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.AdresPostbus
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.AdresType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.BoekingType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurKlasse
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.FactuurRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.JournaalpostRegel
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NatuurlijkPersoon
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.NietNatuurlijkPersoon
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.RelatieType
import com.ritense.valtimoplugins.rotterdam.oracleebs.domain.SaldoSoort
import com.ritense.valtimoplugins.rotterdam.oracleebs.service.EsbClient
import com.ritense.valueresolver.ValueResolverService
import com.rotterdam.esb.opvoeren.models.Grootboekrekening
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.assertj.core.api.Assertions.assertThat
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.community.mockito.delegate.DelegateExecutionFake
import org.hibernate.validator.constraints.Length
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
import kotlin.String

class OracleEbsPluginTest {

    private val objectMapper = MapperSingleton.get()

    private lateinit var mockWebServer: MockWebServer

    private lateinit var esbClient: EsbClient
    private lateinit var valueResolverService: ValueResolverService
    private lateinit var mTlsSslContext: MTlsSslContext

    private lateinit var plugin: OracleEbsPlugin

    @BeforeEach
    fun setUp() {
        mockWebServer = MockWebServer().apply {
            start()
        }

        esbClient = EsbClient()
        valueResolverService = mock()
        mTlsSslContext = mock()

        plugin = OracleEbsPlugin(
            esbClient = esbClient,
            valueResolverService = valueResolverService,
            objectMapper = objectMapper
        ).apply {
            this.baseUrl = mockWebServer.url("/").toUri()
            this.mTlsSslContextConfiguration = mTlsSslContext
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
            .thenReturn(
                mapOf(
                    "pv:invoiceAmount" to invoiceAmount,
                    "doc:/user/firstName" to firstName,
                    "case:lastModified" to lastModified
                )
            )

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

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.journaalpostOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                sleutel = "784",
                boekdatumTijd = "2025-03-28T13:34:26+02:00",
                categorie = "Vergunningen",
                saldoSoort = SaldoSoort.WERKELIJK.title,
                omschrijving = "Aanvraag Omgevingsvergunning",
                grootboek = "100",
                boekjaar = "2025",
                boekperiode = "2",
                regels = journaalpostRegelsMetGrootboekSleutel()
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
    fun `should push journaalpost (regels via resolver as serialised JSON)`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.journaalpostOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                sleutel = "784",
                boekdatumTijd = "2025-03-28T13:34:26+02:00",
                categorie = "Vergunningen",
                saldoSoort = SaldoSoort.WERKELIJK.title,
                omschrijving = "Aanvraag Omgevingsvergunning",
                grootboek = "R10",
                boekjaar = "2025",
                boekperiode = "2",
                regelsViaResolver = objectMapper.writeValueAsString(journaalpostRegelsMetGrootboekSleutel())
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
    fun `should push journaalpost (regels via resolver as ArrayList (from doc or pv)) from grootboeksleutel`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.journaalpostOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                sleutel = "784",
                boekdatumTijd = "2025-03-28T13:34:26+02:00",
                categorie = "Vergunningen",
                saldoSoort = SaldoSoort.WERKELIJK.title,
                omschrijving = "Aanvraag Omgevingsvergunning",
                boekjaar = "2025",
                boekperiode = "2",
                regelsViaResolver = journaalpostRegelsMetGrootboekSleutel().map { journaalpostRegel ->
                    linkedMapOf(
                        GROOTBOEK_SLEUTEL to journaalpostRegel.grootboekSleutel,
                        BRON_SLEUTEL to journaalpostRegel.bronSleutel,
                        BOEKING_TYPE to journaalpostRegel.boekingType,
                        BEDRAG to journaalpostRegel.bedrag,
                        OMSCHRIJVING to journaalpostRegel.omschrijving
                    )
                }.let { ArrayList(it) }
            )
        }

        mockWebServer.takeRequest().let { recordedRequest ->
            assertThat(recordedRequest.method)
                .isEqualTo(HttpMethod.POST.name())
            assertThat(recordedRequest.path)
                .isEqualTo("/journaalpost/opvoeren")

            objectMapper.readTree(recordedRequest.body.readUtf8()).let { body ->
                objectMapper.treeToValue<Grootboekrekening>(
                    body.get("journaalpost").get("journaalpostregels").get(0).get("grootboekrekening")
                ).let { grootboekRekening ->
                    assertThat(grootboekRekening.bronsleutel).isNull()
                    assertThat(grootboekRekening.grootboeksleutel).isEqualTo("600")
                }
                objectMapper.treeToValue<Grootboekrekening>(
                    body.get("journaalpost").get("journaalpostregels").get(1).get("grootboekrekening")
                ).let { grootboekRekening ->
                    assertThat(grootboekRekening.bronsleutel).isNull()
                    assertThat(grootboekRekening.grootboeksleutel).isEqualTo("400")
                }
            }
        }
    }

    @Test
    fun `should push journaalpost (regels via resolver as ArrayList (from doc or pv)) with bronsleutel`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.journaalpostOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                sleutel = "784",
                boekdatumTijd = "2025-03-28T13:34:26+02:00",
                categorie = "Vergunningen",
                saldoSoort = SaldoSoort.WERKELIJK.title,
                omschrijving = "Aanvraag Omgevingsvergunning",
                boekjaar = "2025",
                boekperiode = "2",
                regelsViaResolver = journaalpostRegelMetBronsleutel().map { journaalpostRegel ->
                    linkedMapOf(
                        GROOTBOEK_SLEUTEL to journaalpostRegel.grootboekSleutel,
                        BRON_SLEUTEL to journaalpostRegel.bronSleutel,
                        BOEKING_TYPE to journaalpostRegel.boekingType,
                        BEDRAG to journaalpostRegel.bedrag,
                        OMSCHRIJVING to journaalpostRegel.omschrijving
                    )
                }.let { ArrayList(it) }
            )
        }

        mockWebServer.takeRequest().let { recordedRequest ->
            assertThat(recordedRequest.method)
                .isEqualTo(HttpMethod.POST.name())
            assertThat(recordedRequest.path)
                .isEqualTo("/journaalpost/opvoeren")


            objectMapper.readTree(recordedRequest.body.readUtf8()).let { body ->
                objectMapper.treeToValue<Grootboekrekening>(
                    body.get("journaalpost").get("journaalpostregels").get(0).get("grootboekrekening")
                ).let { grootboekRekening ->
                    assertThat(grootboekRekening.bronsleutel).isEqualTo("345")
                    assertThat(grootboekRekening.grootboeksleutel).isNull()
                }
            }
        }
    }

    @Test
    fun `should push journaalpost (regels via resolver as ArrayNode)`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.journaalpostOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                sleutel = "784",
                boekdatumTijd = "2025-03-28T13:34:26+02:00",
                categorie = "Vergunningen",
                saldoSoort = SaldoSoort.WERKELIJK.title,
                omschrijving = "Aanvraag Omgevingsvergunning",
                boekjaar = "2025",
                boekperiode = "2",
                regelsViaResolver = journaalpostRegelsMetGrootboekSleutel().map { journaalpostRegel ->
                    objectMapper.createObjectNode().apply {
                        this.put(GROOTBOEK_SLEUTEL, journaalpostRegel.grootboekSleutel)
                        this.put(BOEKING_TYPE, journaalpostRegel.boekingType)
                        this.put(BEDRAG, journaalpostRegel.bedrag)
                        this.put(OMSCHRIJVING, journaalpostRegel.omschrijving)
                    }
                }.let {
                    objectMapper.createArrayNode().apply {
                        this.addAll(it)
                    }
                }
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

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.verkoopfactuurOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                factuurKlasse = FactuurKlasse.CREDITNOTA.title,
                factuurDatum = "2025-05-21",
                factuurAdresType = AdresType.LOCATIE.title,
                factuurAdresLocatie = adresLocatie(),
                factuurAdresPostbus = null,
                inkoopOrderReferentie = "20250328-098",
                relatieType = RelatieType.NATUURLIJK_PERSOON.title,
                natuurlijkPersoon = natuurlijkPersoon(),
                nietNatuurlijkPersoon = null,
                regels = verkoopfactuurRegels()
            )
        }

        mockWebServer.takeRequest().let { recordedRequest ->
            assertThat(recordedRequest.method)
                .isEqualTo(HttpMethod.POST.name())
            assertThat(recordedRequest.path)
                .isEqualTo("/verkoopfactuur/opvoeren")
        }
    }

    @Test
    fun `should push verkoopfactuur (regels via resolver as serialised JSON)`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.verkoopfactuurOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                factuurKlasse = FactuurKlasse.CREDITNOTA.title,
                factuurDatum = "2025-05-21",
                factuurAdresType = AdresType.POSTBUS.title,
                factuurAdresLocatie = null,
                factuurAdresPostbus = adresPostbus(),
                inkoopOrderReferentie = "20250328-098",
                relatieType = RelatieType.NIET_NATUURLIJK_PERSOON.title,
                natuurlijkPersoon = null,
                nietNatuurlijkPersoon = nietNatuurlijkPersoon(),
                regelsViaResolver = objectMapper.writeValueAsString(verkoopfactuurRegels())
            )
        }

        mockWebServer.takeRequest().let { recordedRequest ->
            assertThat(recordedRequest.method)
                .isEqualTo(HttpMethod.POST.name())
            assertThat(recordedRequest.path)
                .isEqualTo("/verkoopfactuur/opvoeren")
        }
    }

    @Test
    fun `should push verkoopfactuur (regels via resolver as ArrayList (from doc or pv)`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.verkoopfactuurOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                factuurKlasse = FactuurKlasse.CREDITNOTA.title,
                factuurDatum = "2025-05-21",
                factuurAdresType = AdresType.POSTBUS.name,
                factuurAdresLocatie = null,
                factuurAdresPostbus = adresPostbus(),
                inkoopOrderReferentie = "20250328-098",
                relatieType = RelatieType.NIET_NATUURLIJK_PERSOON.title,
                natuurlijkPersoon = null,
                nietNatuurlijkPersoon = nietNatuurlijkPersoon(),
                regelsViaResolver = verkoopfactuurRegels().map { factuurRegel ->
                    linkedMapOf(
                        HOEVEELHEID to factuurRegel.hoeveelheid,
                        TARIEF to factuurRegel.tarief,
                        BTW_PERCENTAGE to factuurRegel.btwPercentage,
                        GROOTBOEK_SLEUTEL to factuurRegel.grootboekSleutel,
                        BRON_SLEUTEL to factuurRegel.bronSleutel,
                        OMSCHRIJVING to factuurRegel.omschrijving
                    )
                }.let { ArrayList(it) }
            )
        }

        mockWebServer.takeRequest().let { recordedRequest ->
            assertThat(recordedRequest.method)
                .isEqualTo(HttpMethod.POST.name())
            assertThat(recordedRequest.path)
                .isEqualTo("/verkoopfactuur/opvoeren")
        }
    }

    @Test
    fun `should push verkoopfactuur (regels via resolver as ArrayNode)`() {
        // given
        val execution = DelegateExecutionFake()
            .withProcessInstanceId("92edbc6c-c736-470d-8deb-382a69f25f43")

        mockOkResponse(verwerkingsstatusGeslaagdAsJson())

        // when & then
        assertDoesNotThrow {
            plugin.verkoopfactuurOpvoeren(
                execution = execution,
                pvResultVariable = "verwerkingsstatus",
                procesCode = "98332",
                referentieNummer = "2025-AGV-123456",
                factuurKlasse = FactuurKlasse.CREDITNOTA.title,
                factuurDatum = "2025-05-21",
                factuurAdresType = AdresType.POSTBUS.title,
                factuurAdresLocatie = null,
                factuurAdresPostbus = adresPostbus(),
                inkoopOrderReferentie = "20250328-098",
                relatieType = RelatieType.NIET_NATUURLIJK_PERSOON.title,
                natuurlijkPersoon = null,
                nietNatuurlijkPersoon = nietNatuurlijkPersoon(),
                regelsViaResolver = verkoopfactuurRegels().map { factuurRegel ->
                    objectMapper.createObjectNode().apply {
                        this.put(HOEVEELHEID, factuurRegel.hoeveelheid)
                        this.put(TARIEF, factuurRegel.tarief)
                        this.put(BTW_PERCENTAGE, factuurRegel.btwPercentage)
                        this.put(GROOTBOEK_SLEUTEL, factuurRegel.grootboekSleutel)
                        this.put(BRON_SLEUTEL, factuurRegel.grootboekSleutel)
                        this.put(OMSCHRIJVING, factuurRegel.omschrijving)
                    }
                }.let {
                    objectMapper.createArrayNode().apply {
                        this.addAll(it)
                    }
                }
            )
        }

        mockWebServer.takeRequest().let { recordedRequest ->
            assertThat(recordedRequest.method)
                .isEqualTo(HttpMethod.POST.name())
            assertThat(recordedRequest.path)
                .isEqualTo("/verkoopfactuur/opvoeren")
        }
    }

    private fun adresLocatie() = AdresLocatie(
        naamContactpersoon = null,
        vestigingsnummerRotterdam = null,
        straatnaam = "Testlaan",
        huisnummer = "78",
        huisnummertoevoeging = null,
        postcode = "1234AB",
        plaatsnaam = "Abcoude",
        landcode = "NL"
    )

    private fun adresPostbus() = AdresPostbus(
        naamContactpersoon = null,
        vestigingsnummerRotterdam = null,
        postbus = "102",
        postcode = "1234AB",
        plaatsnaam = "Abcoude",
        landcode = "NL"
    )

    private fun natuurlijkPersoon() = NatuurlijkPersoon(
        bsn = "202525061",
        achternaam = "Janssen",
        voornamen = "Jan"
    )

    private fun nietNatuurlijkPersoon() = NietNatuurlijkPersoon(
        kvkNummer = "",
        kvkVestigingsnummer = "",
        statutaireNaam = "J.Janssen - Groenten en Fruit"
    )

    private fun journaalpostRegelsMetGrootboekSleutel() = listOf(
        JournaalpostRegel(
            grootboekSleutel = "600",
            bronSleutel = null,
            boekingType = BoekingType.CREDIT.title,
            bedrag = "150,00",
            omschrijving = "Afboeken"
        ),
        JournaalpostRegel(
            grootboekSleutel = "400",
            bronSleutel = "  ",
            boekingType = BoekingType.DEBET.title,
            bedrag = "150",
            omschrijving = "Inboeken"
        )
    )

    private fun journaalpostRegelMetBronsleutel() = listOf(
        JournaalpostRegel(
            grootboekSleutel = null,
            bronSleutel = "345",
            boekingType = BoekingType.CREDIT.title,
            bedrag = "150,00",
            omschrijving = "Afboeken"
        ),
        JournaalpostRegel(
            grootboekSleutel = " ",
            bronSleutel = "567",
            boekingType = BoekingType.DEBET.title,
            bedrag = "150",
            omschrijving = "Inboeken"
        )
    )

    private fun verkoopfactuurRegels() = listOf(
        FactuurRegel(
            hoeveelheid = "25",
            tarief = "3,58",
            btwPercentage = "21",
            grootboekSleutel = "700",
            bronSleutel = "",
            omschrijving = "Kilo kruimige aardappelen"
        )
    )

    private fun verwerkingsstatusGeslaagdAsJson(): String = objectMapper.writeValueAsString(
        mapOf(
            "isGeslaagd" to true,
            "foutcode" to null,
            "foutmelding" to null,
            "melding" to null
        )
    )

    private fun mockOkResponse(body: String) {
        MockResponse()
            .setResponseCode(HttpStatus.OK.value())
            .addHeader("Content-Type", "application/json; charset=utf-8")
            .setBody(body).let { response ->
                mockWebServer.enqueue(response)
            }
    }

    companion object {
        private const val BOEKING_TYPE = "boekingType"
        private const val BEDRAG = "bedrag"
        private const val HOEVEELHEID = "hoeveelheid"
        private const val TARIEF = "tarief"
        private const val BTW_PERCENTAGE = "btwPercentage"
        private const val GROOTBOEK_SLEUTEL = "grootboekSleutel"
        private const val BRON_SLEUTEL = "bronSleutel"
        private const val OMSCHRIJVING = "omschrijving"
    }
}
