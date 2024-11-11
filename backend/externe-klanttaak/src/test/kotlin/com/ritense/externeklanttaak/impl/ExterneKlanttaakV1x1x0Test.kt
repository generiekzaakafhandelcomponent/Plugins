package com.ritense.externeklanttaak.impl

import com.ritense.externeklanttaak.domain.DataBindingConfig
import com.ritense.externeklanttaak.model.FormulierSoort
import com.ritense.externeklanttaak.model.TaakIdentificatie
import com.ritense.externeklanttaak.model.TaakIdentificatie.Companion.TYPE_BSN
import com.ritense.externeklanttaak.model.TaakIdentificatie.Companion.TYPE_KVK
import com.ritense.externeklanttaak.model.TaakKoppelingRegistratie.ZAAK
import com.ritense.externeklanttaak.model.TaakReceiver.OTHER
import com.ritense.externeklanttaak.model.TaakReceiver.ZAAK_INITIATOR
import com.ritense.externeklanttaak.model.TaakSoort
import com.ritense.externeklanttaak.model.TaakSoort.OGONEBETALING
import com.ritense.externeklanttaak.model.TaakSoort.PORTAALFORMULIER
import com.ritense.externeklanttaak.model.TaakSoort.URL
import com.ritense.externeklanttaak.model.impl.CreateTaakActionV1x1x0
import com.ritense.externeklanttaak.model.impl.ExterneKlanttaakV1x1x0
import com.ritense.externeklanttaak.service.impl.DefaultUtilityService
import org.apache.commons.codec.binary.Base32
import org.camunda.community.mockito.delegate.DelegateExecutionFake
import org.camunda.community.mockito.delegate.DelegateTaskFake
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.mock
import org.mockito.kotlin.any
import org.mockito.kotlin.whenever
import java.util.Date
import java.util.UUID
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ExterneKlanttaakV1x1x0Test {
    private lateinit var utilService: DefaultUtilityService

    @BeforeEach
    fun setUp() {
        utilService = mock()
    }

    @Test
    fun `should throw when create plugin action config is invalid`() {
        // when
        assertThrows<IllegalArgumentException> {
            CreateTaakActionV1x1x0(
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
        val identificatie =
            TaakIdentificatie(
                type = "bsn",
                value = "000000000"
            )

        val createActionConfig =
            CreateTaakActionV1x1x0(
                taakSoort = URL,
                url = "https://example.com/some-task",
                taakReceiver = ZAAK_INITIATOR,
                verloopdatum = "2024-10-29"
            )

        whenever(utilService.getZaakinitiatorByDocumentId(any()))
            .thenReturn(identificatie)

        // when

        val klanttaak = ExterneKlanttaakV1x1x0.create().invoke(createActionConfig, delegateTask, utilService)

        //then
        assertTrue(klanttaak is ExterneKlanttaakV1x1x0)
        assertEquals(delegateTask.id, klanttaak.verwerkerTaakId)
        assertEquals(TaakSoort.URL, klanttaak.soort)
        assertEquals(delegateTask.name, klanttaak.titel)
        assertEquals(TaakIdentificatie.TYPE_BSN, klanttaak.identificatie.type)
        assertEquals("000000000", klanttaak.identificatie.value)
    }

    @Test
    fun `should create PORTAALFORM Klanttaak instance from valid config`() {
        // given
        val processBusinessKey = UUID.randomUUID().toString()
        val processInstanceId = UUID.randomUUID().toString()
        val delegateExecutionFake =
            DelegateExecutionFake()
                .withProcessBusinessKey(processBusinessKey)
                .withProcessInstanceId(processInstanceId)
        val delegateTask =
            DelegateTaskFake()
                .withId("task-id")
                .withName("Do something!")
                .withExecution(delegateExecutionFake)

        val createActionConfig =
            CreateTaakActionV1x1x0(
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

        whenever(utilService.resolveFormulierTaakData(any(), any(), any()))
            .thenReturn(
                mapOf(
                    "voornaam" to "Jan"
                )
            )

        // when
        val klanttaak = ExterneKlanttaakV1x1x0.create().invoke(createActionConfig, delegateTask, utilService)

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
            CreateTaakActionV1x1x0(
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

        val klanttaak = ExterneKlanttaakV1x1x0.create().invoke(createActionConfig, delegateTask, utilService)

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