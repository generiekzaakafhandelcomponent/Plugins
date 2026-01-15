/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.oipklanttaak.service

import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectRecord
import com.ritense.objectenapi.client.ObjectWrapper
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oipklanttaak.domain.LevelOfAssurance
import com.ritense.valtimoplugins.oipklanttaak.dto.DataBinding
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZaakUrlProvider
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.operaton.bpm.engine.delegate.DelegateExecution
import org.operaton.bpm.engine.delegate.DelegateTask
import java.net.URI
import java.util.UUID

class OipKlanttaakServiceTest {

    private val objectMapper = MapperSingleton.get()

    private lateinit var pluginService: PluginService
    private lateinit var objectManagementService: ObjectManagementService
    private lateinit var taskService: OperatonTaskService
    private lateinit var valueResolverService: ValueResolverService
    private lateinit var zaakUrlProvider: ZaakUrlProvider

    private lateinit var oipKlanttaakService: OipKlanttaakService

    @BeforeEach
    fun setup() {
        pluginService = mock()
        objectManagementService = mock()
        taskService = mock()
        valueResolverService = mock()
        zaakUrlProvider = mock()

        oipKlanttaakService = OipKlanttaakService(
            pluginService = pluginService,
            objectManagementService = objectManagementService,
            objectMapper = objectMapper,
            taskService = taskService,
            valueResolverService = valueResolverService,
            zaakUrlProvider = zaakUrlProvider
        )
    }

    @Test
    fun `delegateTask should create a new task and not throw exceptions`() {
        val delegateTask = mock<DelegateTask> {
            on { id } doReturn "8deb94fb-5ae9-4edf-9915-92bf230842bb"
            on { name } doReturn "Test Task"
        }
        val objectenApiPluginConfigurationId = UUID.fromString("c77c4eb2-0af8-4af3-927b-ac6e3e84b7c7")
        val objectManagementId = UUID.fromString("4fa0e2d0-9cb5-4de1-b0af-4a4395a1c57f")
        val objectManagement = mock<ObjectManagement> {
            on { this.objectenApiPluginConfigurationId } doReturn objectenApiPluginConfigurationId
            on { objecttypeId } doReturn "f39bea24-73ed-4f2d-abab-3f33faed25d0"
            on { objecttypenApiPluginConfigurationId } doReturn UUID.fromString("9a199c9b-9925-43a3-8159-119032926222")
        }

        whenever(objectManagementService.getById(eq(objectManagementId)))
            .thenReturn(objectManagement)
        whenever(pluginService.createInstance<ObjectenApiPlugin>(eq(objectenApiPluginConfigurationId)))
            .thenReturn(mock())

        assertDoesNotThrow {
            oipKlanttaakService.delegateTask(
                delegateTask = delegateTask,
                objectManagementId = objectManagementId,
                authorizeeIdentifier = "TestAuthorizee",
                levelOfAssurance = LevelOfAssurance.MOBILE_TWO_FACTOR_CONTRACT,
                formUri = URI.create("http://example.com/form")
            )
        }
    }

    @Test
    fun `completeDelegatedTask should complete the task and not throw exceptions`() {
        val execution = mock<DelegateExecution> {
            on { getVariable("verwerkerTaakId") } doReturn "adada702-fde1-4d19-af37-e3145449ce58"
            on { getVariable("oipTaskObjectUrl") } doReturn "https://example.com/resource"
        }
        val objectRecord = mock<ObjectRecord> {
            on { data } doReturn objectMapper.createObjectNode()
        }
        val objectWrapper = mock<ObjectWrapper> {
            on { record } doReturn objectRecord
        }
        val objectenApiPluginConfigurationId = UUID.fromString("c77c4eb2-0af8-4af3-927b-ac6e3e84b7c7")
        val objectenApiPlugin = mock<ObjectenApiPlugin> {
            on { getObject(any()) } doReturn objectWrapper
        }
        val objectManagementId = UUID.fromString("4fa0e2d0-9cb5-4de1-b0af-4a4395a1c57f")
        val objectManagement = mock<ObjectManagement> {
            on { this.objectenApiPluginConfigurationId } doReturn objectenApiPluginConfigurationId
        }
        val receivedDataMapping = listOf(
            DataBinding("/data/field1", "value1"),
            DataBinding("/data/field2", "value2")
        )

        whenever(objectManagementService.getById(eq(objectManagementId)))
            .thenReturn(objectManagement)
        whenever(pluginService.createInstance<ObjectenApiPlugin>(eq(objectenApiPluginConfigurationId)))
            .thenReturn(objectenApiPlugin)

        assertDoesNotThrow {
            oipKlanttaakService.completeDelegatedTask(
                execution = execution,
                objectManagementId = objectManagementId,
                saveReceivedData = true,
                receivedDataMapping = receivedDataMapping,
                linkDocuments = false,
                pathToDocuments = null
            )
        }
    }
}