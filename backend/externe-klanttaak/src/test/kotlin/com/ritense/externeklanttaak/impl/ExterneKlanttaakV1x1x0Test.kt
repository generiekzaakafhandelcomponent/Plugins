package com.ritense.externeklanttaak.impl

import com.ritense.externeklanttaak.domain.IExterneKlanttaak
import com.ritense.externeklanttaak.version.v1x1x0.CreateExterneKlanttaakActionV1x1x0
import com.ritense.externeklanttaak.version.v1x1x0.CreateExterneKlanttaakActionV1x1x0.CreateExterneKlanttaakActionConfigV1x1x0
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.DataBindingConfig
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.FormulierSoort
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakIdentificatie.Companion.TYPE_BSN
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakIdentificatie.Companion.TYPE_KVK
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakKoppelingRegistratie.ZAAK
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakReceiver.OTHER
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakReceiver.ZAAK_INITIATOR
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort.OGONEBETALING
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort.PORTAALFORMULIER
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakV1x1x0.TaakSoort.URL
import com.ritense.externeklanttaak.version.v1x1x0.ExterneKlanttaakVersionV1x1x0
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import com.ritense.zakenapi.ZakenApiPlugin
import com.ritense.zakenapi.domain.rol.BetrokkeneType.NATUURLIJK_PERSOON
import com.ritense.zakenapi.domain.rol.Rol
import com.ritense.zakenapi.domain.rol.RolNatuurlijkPersoon
import org.apache.commons.codec.binary.Base32
import org.camunda.community.mockito.delegate.DelegateExecutionFake
import org.camunda.community.mockito.delegate.DelegateTaskFake
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import java.net.URI
import java.util.Date
import java.util.UUID
import kotlin.test.Test
import kotlin.test.assertTrue

class ExterneKlanttaakV1x1x0Test {
    private lateinit var pluginService: PluginService
    private lateinit var valueResolverService: ValueResolverService
    private lateinit var zaakUrlProvider: ZaakUrlProvider
    private lateinit var taskservice: CamundaTaskService
    private lateinit var zakenApiPlugin: ZakenApiPlugin

    @BeforeEach
    fun setUp() {
        pluginService = mock()
        valueResolverService = mock()
        zaakUrlProvider = mock()
        taskservice = mock()
        zakenApiPlugin = mock()
    }

    @Test
    fun `should throw when create plugin action config is invalid`() {
        // when
        assertThrows<IllegalArgumentException> {
            CreateExterneKlanttaakActionConfigV1x1x0(
                taakSoort = URL,
                taakReceiver = ZAAK_INITIATOR,
                verloopdatum = "2024-10-29"
            )
        }
    }

    @Test
    fun `should create URL Klanttaak instance from valid config`() {
        // given
        val processBusinessKey = UUID.randomUUID().toString()
        val delegateExecutionFake =
            DelegateExecutionFake()
                .withProcessBusinessKey(processBusinessKey)
        val delegateTask =
            DelegateTaskFake()
                .withId("task-id")
                .withName("Do something!")
                .withExecution(delegateExecutionFake)
        val zaakUrl = URI.create("https://example.com/zaak-url")
        val zaakRollen = listOf(
            Rol(
                zaak = zaakUrl,
                roltype = zaakUrl,
                betrokkeneType = NATUURLIJK_PERSOON,
                roltoelichting = "",
                betrokkeneIdentificatie = RolNatuurlijkPersoon(inpBsn = "999990755")
            )
        )
        val externeKlanttaakVersion = ExterneKlanttaakVersionV1x1x0(
            pluginService,
            valueResolverService,
            taskservice,
            zaakUrlProvider
        )
        val createActionConfig =
            CreateExterneKlanttaakActionConfigV1x1x0(
                taakSoort = URL,
                url = "https://example.com/some-task",
                taakReceiver = ZAAK_INITIATOR,
                verloopdatum = "2024-10-29"
            )

        whenever(zaakUrlProvider.getZaakUrl(any()))
            .thenReturn(zaakUrl)
        whenever(pluginService.createInstance<ZakenApiPlugin>(any(), any()))
            .thenReturn(zakenApiPlugin)
        whenever(zakenApiPlugin.getZaakRollen(any(), any()))
            .thenReturn(zaakRollen)

        // when

        val klanttaak: IExterneKlanttaak =
            externeKlanttaakVersion.create(createActionConfig, delegateTask)

        //then
        assertTrue(klanttaak is ExterneKlanttaakV1x1x0)
        assertEquals(delegateTask.id, klanttaak.verwerkerTaakId)
        assertEquals(URL, klanttaak.soort)
        assertEquals(delegateTask.name, klanttaak.titel)
        assertEquals(TYPE_BSN, klanttaak.identificatie.type)
        assertEquals("999990755", klanttaak.identificatie.value)
    }

    @Test
    fun `should create PORTAALFORM Klanttaak instance from valid config`() {
        // given
        val processBusinessKey = UUID.randomUUID().toString()
        val processInstanceId = UUID.randomUUID().toString()
        val delegateExecutionFake =
            DelegateExecutionFake()
                .withBusinessKey(processBusinessKey)
                .withProcessInstanceId(processInstanceId)
        val delegateTask =
            DelegateTaskFake()
                .withId("task-id")
                .withName("Do something!")
                .withExecution(delegateExecutionFake)

        val createActionConfig =
            CreateExterneKlanttaakActionConfigV1x1x0(
                taakSoort = PORTAALFORMULIER,
                portaalformulierSoort = FormulierSoort.URL,
                portaalformulierValue = "http://example.com/objecten/api/v1/form-object",
                portaalformulierData = listOf(
                    DataBindingConfig(
                        key = "pv:voornaam",
                        value = "/voornaam",
                    )
                ),
                taakReceiver = OTHER,
                identificationKey = TYPE_KVK,
                identificationValue = "000000001",
                koppelingRegistratie = ZAAK,
                koppelingUuid = UUID.randomUUID().toString(),
            )
        whenever(valueResolverService.resolveValues(any(), any()))
            .thenReturn(
                mapOf(
                    "pv:voornaam" to "Jan"
                )
            )

        // when
        val klanttaak =
            CreateExterneKlanttaakActionV1x1x0(
                pluginService,
                valueResolverService,
                zaakUrlProvider
            )
                .create(createActionConfig, delegateTask)

        //then
        assertTrue(klanttaak is ExterneKlanttaakV1x1x0)
        assertEquals(delegateTask.id, klanttaak.verwerkerTaakId)
        assertEquals(PORTAALFORMULIER, klanttaak.soort)
        assertEquals(delegateTask.name, klanttaak.titel)
        assertEquals(TYPE_KVK, klanttaak.identificatie.type)
        assertEquals("000000001", klanttaak.identificatie.value)
        assertEquals("Jan", klanttaak.portaalformulier?.data?.get("voornaam"))
    }

    @Test
    fun `should create PAYMENT Klanttaak instance from valid config`() {
        // given
        val processBusinessKey = UUID.randomUUID().toString()
        val kenmerk = Base32().encode(processBusinessKey.toByteArray()).toString(Charsets.UTF_8)
        val delegateExecutionFake =
            DelegateExecutionFake()
                .withProcessBusinessKey(processBusinessKey)
        val delegateTask =
            DelegateTaskFake()
                .withId("task-id")
                .withName("Do something!")
                .withExecution(delegateExecutionFake)
                .apply {
                    dueDate = Date()
                }

        val createActionConfig =
            CreateExterneKlanttaakActionConfigV1x1x0(
                taakSoort = OGONEBETALING,
                ogoneBedrag = "300.39",
                ogoneBetaalkenmerk = kenmerk,
                ogonePspid = "some-id",
                taakReceiver = OTHER,
                identificationKey = TYPE_BSN,
                identificationValue = "000000000",
                koppelingRegistratie = ZAAK,
                koppelingUuid = UUID.randomUUID().toString(),
            )

        // when

        val klanttaak = CreateExterneKlanttaakActionV1x1x0(
            pluginService,
            valueResolverService,
            zaakUrlProvider
        )
            .create(createActionConfig, delegateTask)

        //then
        assertTrue(klanttaak is ExterneKlanttaakV1x1x0)
        assertEquals(delegateTask.id, klanttaak.verwerkerTaakId)
        assertEquals(OGONEBETALING, klanttaak.soort)
        assertEquals(createActionConfig.ogoneBedrag?.toDouble(), klanttaak.ogonebetaling?.bedrag)
        assertEquals(kenmerk, klanttaak.ogonebetaling?.betaalkenmerk)
        assertEquals("some-id", klanttaak.ogonebetaling?.pspid)
        assertEquals(delegateTask.name, klanttaak.titel)
        assertEquals(TYPE_BSN, klanttaak.identificatie.type)
        assertEquals("000000000", klanttaak.identificatie.value)
    }
}