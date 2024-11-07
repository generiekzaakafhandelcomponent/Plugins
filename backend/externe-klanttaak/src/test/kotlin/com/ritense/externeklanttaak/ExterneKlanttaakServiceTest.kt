/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.externeklanttaak

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.treeToValue
import com.ritense.externeklanttaak.domain.KlanttaakVersion
import com.ritense.externeklanttaak.model.TaakReceiver.OTHER
import com.ritense.externeklanttaak.model.TaakSoort.URL
import com.ritense.externeklanttaak.model.TaakStatus
import com.ritense.externeklanttaak.model.impl.CreateTaakActionV1x1x0
import com.ritense.externeklanttaak.model.impl.ExterneKlanttaakV1x1x0
import com.ritense.externeklanttaak.service.ExterneKlanttaakService
import com.ritense.externeklanttaak.service.impl.DefaultUtilityService
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectRequest
import com.ritense.objectenapi.client.ObjectWrapper
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.service.CamundaTaskService
import com.ritense.valueresolver.ValueResolverService
import org.camunda.community.mockito.delegate.DelegateExecutionFake
import org.camunda.community.mockito.delegate.DelegateTaskFake
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.KArgumentCaptor
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.net.URI
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset
import java.util.Date
import java.util.UUID
import kotlin.test.assertEquals


internal class ExterneKlanttaakServiceTest {

    private lateinit var objectManagementService: ObjectManagementService
    private lateinit var pluginService: PluginService
    private lateinit var objectenApiPlugin: ObjectenApiPlugin
    private lateinit var objecttypenApiPlugin: ObjecttypenApiPlugin
    private lateinit var valueResolverService: ValueResolverService
    private lateinit var taskService: CamundaTaskService
    private lateinit var utilService: DefaultUtilityService
    private lateinit var objectManagement: ObjectManagement

    private val externalUrl = "https://example.com/external-url"
    private val bsn = "999990755"
    private val objectUrl = "https://example.com/objecten/api/v1/object-id"
    private val objecttypeUrl = "https://example.com/objecttypen/api/v1/object-type"
    private val openTaakObject: JsonNode = objectMapper.readTree(
        """
                {
                  "uuid": "${UUID.randomUUID()}",
                  "url": "$objectUrl",
                  "type" : "$objecttypeUrl",
                  "record" : {
                    "typeVersion" : 1,
                    "data" : {
                      "titel" : "Fake Task",
                      "status" : "open",
                      "soort" : "url",
                      "url" : "https://example.com/",
                      "identificatie" : {
                        "type" : "bsn",
                        "value" : "999990755"
                      },
                      "verloopdatum" : "2024-12-24",
                      "eigenaar" : "GZAC",
                      "verwerker_taak_id" : "fake-task-id"
                    },
                    "startAt" : "2024-11-07"
                  }
                }
            """.trimIndent()
    )

    @BeforeEach
    fun init() {
        objectManagementService = mock()
        pluginService = mock()
        objectenApiPlugin = mock()
        objecttypenApiPlugin = mock()
        valueResolverService = mock()
        taskService = mock()
        utilService = mock()

        objectManagement = ObjectManagement(
            id = UUID.randomUUID(),
            title = "klanttaak",
            objectenApiPluginConfigurationId = UUID.randomUUID(),
            objecttypenApiPluginConfigurationId = UUID.randomUUID(),
            objecttypeId = "object-type",
            objecttypeVersion = 1,
        )
    }

    @Test
    fun `should create klanttaak`() {
        // given
        val externeKlanttaakService =
            ExterneKlanttaakService(
                objectManagementService,
                pluginService,
                valueResolverService,
                taskService,
                utilService
            )

        val klanttaakVersion = KlanttaakVersion.V1_1_0
        val config = CreateTaakActionV1x1x0(
            taakSoort = URL,
            url = "pv:external-url",
            taakReceiver = OTHER,
            identificationKey = "bsn",
            identificationValue = "999990755",
            verloopdatum = "01-01-2025"
        )
        val executionFake = DelegateExecutionFake()
            .withProcessInstanceId("processInstanceId")
        val taskFake = DelegateTaskFake()
            .withName("Fake Task")
            .withId("fake-task-id")
            .withExecution(executionFake)
            .apply {
                dueDate = Date.from(Instant.from(LocalDate.parse("2024-12-24").atStartOfDay(ZoneOffset.UTC)))
            }

        whenever(objectManagementService.getById(objectManagement.id))
            .thenReturn(objectManagement)
        whenever(pluginService.createInstance<ObjectenApiPlugin>(objectManagement.objectenApiPluginConfigurationId))
            .thenReturn(objectenApiPlugin)
        whenever(pluginService.createInstance<ObjecttypenApiPlugin>(objectManagement.objecttypenApiPluginConfigurationId))
            .thenReturn(objecttypenApiPlugin)
        whenever(objecttypenApiPlugin.getObjectTypeUrlById(any()))
            .thenReturn(URI.create("https://example.com/objecttypen/api/v1/${objectManagement.objecttypeId}"))
        whenever(
            valueResolverService.resolveValues(
                any(),
                any(),
                any()
            )
        ).thenReturn(mapOf("pv:external-url" to externalUrl))

        // when
        externeKlanttaakService.createExterneKlanttaak(
            klanttaakVersion = klanttaakVersion,
            objectManagementId = objectManagement.id,
            delegateTask = taskFake,
            config = config
        )

        // then
        val requestCaptor: KArgumentCaptor<ObjectRequest> = argumentCaptor()
        verify(objectenApiPlugin, times(1)).createObject(requestCaptor.capture())

        val createdKlanttaak: ExterneKlanttaakV1x1x0 = objectMapper.treeToValue(requestCaptor.firstValue.record.data!!)
        assertEquals(taskFake.name, createdKlanttaak.titel)
        assertEquals(bsn, createdKlanttaak.identificatie.value)
        assertEquals(externalUrl, createdKlanttaak.url!!.url)
    }

    @Test
    fun `should create klanttaak and store resultUrl`() {
        // given
        val externeKlanttaakService =
            ExterneKlanttaakService(
                objectManagementService,
                pluginService,
                valueResolverService,
                taskService,
                utilService
            )

        val klanttaakVersion = KlanttaakVersion.V1_1_0
        val config = CreateTaakActionV1x1x0(
            taakSoort = URL,
            url = "pv:external-url",
            taakReceiver = OTHER,
            identificationKey = "bsn",
            identificationValue = "999990755",
            verloopdatum = "01-01-2025",
            resultingKlanttaakObjectUrlVariable = "klanttaakUrl",
        )
        val executionFake = DelegateExecutionFake()
            .withProcessInstanceId("processInstanceId")
        val taskFake = DelegateTaskFake()
            .withName("Fake Task")
            .withId("fake-task-id")
            .withExecution(executionFake)
            .apply {
                dueDate = Date.from(Instant.from(LocalDate.parse("2024-12-24").atStartOfDay(ZoneOffset.UTC)))
            }
        val klanttaakWrapped: ObjectWrapper = objectMapper.treeToValue(openTaakObject)

        whenever(objectManagementService.getById(objectManagement.id))
            .thenReturn(objectManagement)
        whenever(pluginService.createInstance<ObjectenApiPlugin>(objectManagement.objectenApiPluginConfigurationId))
            .thenReturn(objectenApiPlugin)
        whenever(pluginService.createInstance<ObjecttypenApiPlugin>(objectManagement.objecttypenApiPluginConfigurationId))
            .thenReturn(objecttypenApiPlugin)
        whenever(objecttypenApiPlugin.getObjectTypeUrlById(any()))
            .thenReturn(URI.create("https://example.com/objecttypen/api/v1/${objectManagement.objecttypeId}"))
        whenever(objectenApiPlugin.createObject(any())).thenReturn(klanttaakWrapped)
        whenever(
            valueResolverService.resolveValues(
                any(),
                any(),
                any()
            )
        ).thenReturn(mapOf("pv:external-url" to externalUrl))

        // when
        externeKlanttaakService.createExterneKlanttaak(
            klanttaakVersion = klanttaakVersion,
            objectManagementId = objectManagement.id,
            delegateTask = taskFake,
            config = config
        )

        // then
        val requestCaptor: KArgumentCaptor<ObjectRequest> = argumentCaptor()
        verify(objectenApiPlugin, times(1)).createObject(requestCaptor.capture())

        val createdKlanttaak: ExterneKlanttaakV1x1x0 = objectMapper.treeToValue(requestCaptor.firstValue.record.data!!)
        assertEquals(taskFake.name, createdKlanttaak.titel)
        assertEquals(bsn, createdKlanttaak.identificatie.value)
        assertEquals(externalUrl, createdKlanttaak.url!!.url)
        assertTrue(executionFake.variables.containsKey("klanttaakUrl"))
        assertEquals(klanttaakWrapped.url, executionFake.getVariable("klanttaakUrl"))
    }

    @Test
    fun `should complete existing klanttaak`() {
        // given
        val externeKlanttaakService =
            ExterneKlanttaakService(
                objectManagementService,
                pluginService,
                valueResolverService,
                taskService,
                utilService
            )

        val klanttaakVersion = KlanttaakVersion.V1_1_0
        val executionFake = DelegateExecutionFake()
            .withVariables(
                mapOf(
                    "verwerkerTaakId" to "taak-id",
                    "externeKlanttaakObjectUrl" to objectUrl
                )
            )
        val klanttaakWrapped: ObjectWrapper = objectMapper.treeToValue(openTaakObject)

        whenever(objectManagementService.getById(objectManagement.id))
            .thenReturn(objectManagement)
        whenever(pluginService.createInstance<ObjectenApiPlugin>(objectManagement.objectenApiPluginConfigurationId))
            .thenReturn(objectenApiPlugin)
        whenever(pluginService.createInstance<ObjecttypenApiPlugin>(objectManagement.objecttypenApiPluginConfigurationId))
            .thenReturn(objecttypenApiPlugin)
        whenever(objectenApiPlugin.getObject(any()))
            .thenReturn(klanttaakWrapped)
        whenever(objecttypenApiPlugin.getObjectTypeUrlById(any()))
            .thenReturn(URI(objecttypeUrl))
        whenever(
            valueResolverService.resolveValues(
                any(),
                any(),
                any()
            )
        ).thenReturn(mapOf("pv:external-url" to objecttypeUrl))

        // when
        externeKlanttaakService.completeExterneKlanttaak(
            klanttaakVersion = klanttaakVersion,
            objectManagementId = objectManagement.id,
            execution = executionFake,
        )

        // then
        val requestCaptor: KArgumentCaptor<ObjectRequest> = argumentCaptor()
        verify(objectenApiPlugin, times(1)).objectPatch(any(), requestCaptor.capture())

        val patchedKlanttaak: ExterneKlanttaakV1x1x0 = objectMapper.treeToValue(requestCaptor.firstValue.record.data!!)
        assertEquals("https://example.com/", patchedKlanttaak.url!!.url)
        assertEquals(TaakStatus.VERWERKT, patchedKlanttaak.status)
    }

    companion object {
        private val objectMapper = MapperSingleton.get()
    }
}