/*
 * Copyright 2026 Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.ritense.valtimoplugins.publictask.plugin

import com.ritense.valtimoplugins.publictask.BaseTest
import com.ritense.valtimoplugins.publictask.domain.PublicTaskData
import com.ritense.valtimoplugins.publictask.service.PublicTaskService
import com.ritense.valueresolver.ValueResolverService
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.entry
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.util.UUID

internal class PublicTaskPluginTest : BaseTest() {
    private lateinit var publicTaskService: PublicTaskService
    private lateinit var valueResolverService: ValueResolverService
    private lateinit var execution: DelegateExecution
    private lateinit var publicTaskPlugin: PublicTaskPlugin

    @BeforeEach
    fun setUp() {
        publicTaskService = mock()
        valueResolverService = mock()
        execution = mock()
        publicTaskPlugin = PublicTaskPlugin(publicTaskService, valueResolverService)

        whenever(execution.getVariableLocal("userTaskId")).thenReturn(USER_TASK_ID.toString())
        whenever(execution.processBusinessKey).thenReturn(BUSINESS_KEY)
        whenever(execution.processInstanceId).thenReturn(PROCESS_INSTANCE_ID)
    }

    @Test
    fun `a metadata value that points at case data is resolved before it is kept with the task`() {
        givenResolved("doc:aanvraag.onderwerp" to "Vergunning dakkapel")

        createPublicTask(mapOf("titel" to "doc:aanvraag.onderwerp"))

        assertThat(savedMetadata()).containsExactly(entry("titel", "Vergunning dakkapel"))
    }

    @Test
    fun `a metadata value that points at a process variable is resolved too`() {
        givenResolved("pv:informatieobjecttypeUrl" to "https://catalogi.example.org/informatieobjecttypen/1")

        createPublicTask(mapOf("informatieobjecttype" to "pv:informatieobjecttypeUrl"))

        assertThat(savedMetadata())
            .containsExactly(entry("informatieobjecttype", "https://catalogi.example.org/informatieobjecttypen/1"))
    }

    @Test
    fun `a fixed metadata value is kept as it is`() {
        givenResolved("Bijlage bij de aanvraag" to "Bijlage bij de aanvraag")

        createPublicTask(mapOf("titel" to "Bijlage bij de aanvraag"))

        assertThat(savedMetadata()).containsExactly(entry("titel", "Bijlage bij de aanvraag"))
    }

    @Test
    fun `a value that resolves to something other than text is filed as text`() {
        givenResolved("pv:volgnummer" to 42L)

        createPublicTask(mapOf("beschrijving" to "pv:volgnummer"))

        assertThat(savedMetadata()).containsExactly(entry("beschrijving", "42"))
    }

    @Test
    fun `ordinary text that happens to contain a colon is kept rather than refused`() {
        // Everything before a ':' reads as a prefix to the resolver, and an unknown one throws.
        whenever(valueResolverService.resolveValues(any<String>(), any(), any()))
            .thenThrow(RuntimeException("No resolver factory found for value prefix Bijlage"))

        createPublicTask(mapOf("titel" to "Bijlage: factuur 2024"))

        assertThat(savedMetadata()).containsExactly(entry("titel", "Bijlage: factuur 2024"))
    }

    @Test
    fun `a value that resolves to nothing is left out rather than filed as a placeholder`() {
        whenever(valueResolverService.resolveValues(any<String>(), any(), any())).thenReturn(emptyMap())

        createPublicTask(mapOf("titel" to "pv:bestaatNiet"))

        assertThat(savedMetadata()).isEmpty()
    }

    @Test
    fun `a process link without metadata resolves nothing`() {
        createPublicTask(null)

        assertThat(savedMetadata()).isEmpty()
    }

    private fun givenResolved(vararg resolved: Pair<String, Any>) {
        whenever(valueResolverService.resolveValues(any<String>(), any(), any()))
            .thenAnswer { invocation ->
                @Suppress("UNCHECKED_CAST")
                val requested = invocation.arguments[2] as Collection<String>
                resolved.toMap().filterKeys { it in requested }
            }
    }

    private fun createPublicTask(documentMetadata: Map<String, String?>?) {
        publicTaskPlugin.createPublicTask(
            execution = execution,
            pvAssigneeCandidateContactData = "pv:assigneeCandidate",
            timeToLive = null,
            maxAttachments = null,
            maxAttachmentSizeInBytes = null,
            acceptedMimeTypes = null,
            documentMetadata = documentMetadata,
        )
    }

    private fun savedMetadata(): Map<String, String> {
        val captor = argumentCaptor<PublicTaskData>()
        verify(publicTaskService).createAndSendPublicTaskUrl(any(), captor.capture(), anyOrNull())
        return captor.firstValue.documentMetadata.fields
    }

    private companion object {
        private val USER_TASK_ID: UUID = UUID.fromString("11111111-1111-1111-1111-111111111111")

        private const val BUSINESS_KEY = "22222222-2222-2222-2222-222222222222"

        private const val PROCESS_INSTANCE_ID = "33333333-3333-3333-3333-333333333333"
    }
}
