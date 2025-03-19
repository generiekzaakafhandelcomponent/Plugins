package com.ritense.valtimoplugins.rotterdam.oracleebs.plugin

import com.ritense.valtimoplugins.rotterdam.oracleebs.service.EsbClient
import com.ritense.valueresolver.ValueResolverService
import org.assertj.core.api.Assertions.assertThat
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.community.mockito.delegate.DelegateExecutionFake
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import java.time.LocalDateTime

class OracleEbsPluginTest {

    private lateinit var esbClient: EsbClient
    private lateinit var valueResolverService: ValueResolverService

    private lateinit var plugin: OracleEbsPlugin

    @BeforeEach
    fun setUp() {
        esbClient = mock()
        valueResolverService = mock()

        plugin = OracleEbsPlugin(
            esbClient, valueResolverService
        )
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
}
