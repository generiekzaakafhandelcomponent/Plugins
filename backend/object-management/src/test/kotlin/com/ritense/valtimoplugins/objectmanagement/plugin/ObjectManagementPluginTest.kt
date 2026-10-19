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

package com.ritense.valtimoplugins.objectmanagement.plugin

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.objectmanagement.service.ObjectManagementCrudService
import com.ritense.valueresolver.ValueResolverService
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.net.URI
import java.util.UUID
import kotlin.test.assertEquals

class ObjectManagementPluginTest {

    private val objectMapper = jacksonObjectMapper()

    private lateinit var crudService: ObjectManagementCrudService
    private lateinit var valueResolverService: ValueResolverService
    private lateinit var execution: DelegateExecution
    private lateinit var plugin: ObjectManagementPlugin

    @BeforeEach
    fun setUp() {
        val pluginService: PluginService = mock()
        whenever(pluginService.getObjectMapper()).thenReturn(objectMapper)
        crudService = mock()
        valueResolverService = mock()
        execution = mock()
        whenever(execution.businessKey).thenReturn("business-key")
        plugin = ObjectManagementPlugin(pluginService, crudService, valueResolverService)
    }

    @Test
    fun `update-object should apply configured fields on top of the existing object data`() {
        val configurationId = UUID.randomUUID()
        val objectUrl = URI("https://objecten.example.com/api/v2/objects/123")
        val existingData = objectMapper.readTree(
            """{"keep":"me","nested":{"x":1,"y":2}}"""
        )
        whenever(crudService.getObjectData(configurationId, objectUrl)).thenReturn(existingData)
        whenever(valueResolverService.resolveValues(any(), any(), any()))
            .thenReturn(mapOf("pv:x" to 5, "pv:added" to "new", "pv:empty" to null))

        plugin.updateObject(
            execution,
            objectUrl,
            configurationId,
            listOf(
                DataBindingConfig("/nested/x", "pv:x"),
                DataBindingConfig("/added", "pv:added"),
                DataBindingConfig("/keep", "pv:empty"),
            ),
        )

        val captor = argumentCaptor<JsonNode>()
        verify(crudService).updateObject(eq(configurationId), eq(objectUrl), captor.capture())
        assertEquals(
            objectMapper.readTree("""{"keep":"me","nested":{"x":5,"y":2},"added":"new"}"""),
            captor.firstValue,
        )
        // the fetched object data must not be mutated
        assertEquals(objectMapper.readTree("""{"keep":"me","nested":{"x":1,"y":2}}"""), existingData)
    }
}
