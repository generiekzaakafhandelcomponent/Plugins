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

package com.ritense.valtimoplugins.oipklanttaak.listener

import com.ritense.authorization.AuthorizationContext
import com.ritense.notificatiesapi.event.NotificatiesApiNotificationReceivedEvent
import com.ritense.notificatiesapi.exception.NotificatiesNotificationEventException
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectenapi.client.ObjectRecord
import com.ritense.objectenapi.client.ObjectWrapper
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valtimo.operaton.domain.OperatonTask
import com.ritense.valtimo.service.OperatonProcessService
import com.ritense.valtimo.service.OperatonTaskService
import com.ritense.valtimoplugins.oipklanttaak.domain.Authorizee
import com.ritense.valtimoplugins.oipklanttaak.domain.Betrokkene
import com.ritense.valtimoplugins.oipklanttaak.domain.Formulier
import com.ritense.valtimoplugins.oipklanttaak.domain.Klanttaak
import com.ritense.valtimoplugins.oipklanttaak.domain.LegalSubject
import com.ritense.valtimoplugins.oipklanttaak.domain.LevelOfAssurance
import com.ritense.valtimoplugins.oipklanttaak.domain.Portaalformulier
import com.ritense.valtimoplugins.oipklanttaak.domain.Status
import com.ritense.valtimoplugins.oipklanttaak.plugin.OipKlanttaakPlugin
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertDoesNotThrow
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.doReturn
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.verifyNoInteractions
import org.mockito.kotlin.whenever
import java.net.URI
import java.time.LocalDate
import java.util.UUID

class OipKlanttaakEventListenerTest {

    private val objectMapper = MapperSingleton.get()

    private lateinit var pluginServiceMock: PluginService
    private lateinit var objectManagementServiceMock: ObjectManagementService
    private lateinit var processDocumentServiceMock: ProcessDocumentService
    private lateinit var processServiceMock: OperatonProcessService
    private lateinit var taskServiceMock: OperatonTaskService

    private lateinit var listener: OipKlanttaakEventListener

    @BeforeEach
    fun setup() {
        pluginServiceMock = mock()
        objectManagementServiceMock = mock()
        processDocumentServiceMock = mock()
        processServiceMock = mock()
        taskServiceMock = mock()

        listener = OipKlanttaakEventListener(
            pluginService = pluginServiceMock,
            objectManagementService = objectManagementServiceMock,
            objectMapper = objectMapper,
            processDocumentService = processDocumentServiceMock,
            processService = processServiceMock,
            taskService = taskServiceMock
        )
    }

    @Test
    fun `handle should process valid event when task is found`() {
        // given
        val event = notificatiesApiNotificationReceivedEvent()

        val taskId = "c9f7d131-9289-4a39-8bff-fcdeba4c3915"
        val mockedTask = mock<OperatonTask> {
            on { id } doReturn taskId
        }

        doReturn(objectManagementConfiguration())
            .whenever(objectManagementServiceMock).findByObjectTypeId(eq(objectTypeId()))

        doReturn(pluginConfiguration())
            .whenever(pluginServiceMock).findPluginConfiguration<OipKlanttaakPlugin>(any(), any())

        doReturn(objectenApiPlugin())
            .whenever(pluginServiceMock).createInstance<ObjectenApiPlugin>(eq(objectenApiPluginConfigurationId()))

        doReturn(mockedTask)
            .whenever(taskServiceMock).findTaskById(eq(taskId))

        whenever(processDocumentServiceMock.getDocumentId(any(), any()))
            .thenReturn(mock())

        // when
        AuthorizationContext.runWithoutAuthorization<Any> {
            assertDoesNotThrow { listener.handle(event) }
        }

        // then
        verify(processServiceMock, times(1)).startProcess(any(), any(), any())
    }

    @Test
    fun `handle should skip event if criteria do not match`() {
        // given
        val event = mock<NotificatiesApiNotificationReceivedEvent> {
            on { kanaal } doReturn "other"
            on { actie } doReturn "create"
            on { kenmerken } doReturn mapOf("objectType" to "https://example.com/objectType")
        }

        // when
        assertDoesNotThrow {
            listener.handle(event)
        }

        // then
        verifyNoInteractions(
            objectManagementServiceMock,
            taskServiceMock,
            processServiceMock
        )
    }

    @Test
    fun `handle should throw exception if process start fails`() {
        // given
        val event = notificatiesApiNotificationReceivedEvent()

        doReturn(objectManagementConfiguration())
            .whenever(objectManagementServiceMock).findByObjectTypeId(eq(objectTypeId()))

        doReturn(pluginConfiguration())
            .whenever(pluginServiceMock).findPluginConfiguration<OipKlanttaakPlugin>(any(), any())

        doReturn(objectenApiPlugin())
            .whenever(pluginServiceMock).createInstance<ObjectenApiPlugin>(eq(objectenApiPluginConfigurationId()))

        whenever(processServiceMock.startProcess(any(), any(), any()))
            .thenThrow(RuntimeException("Process start failed"))

        // when
        assertThrows<NotificatiesNotificationEventException> {
            listener.handle(event)
        }

        // then
        verify(processServiceMock, times(1)).startProcess(any(), any(), any())
    }

    @Test
    fun `handle should skip task if status is not UITGEVOERD`() {
        // given
        val event = notificatiesApiNotificationReceivedEvent()

        doReturn(objectManagementConfiguration())
            .whenever(objectManagementServiceMock).findByObjectTypeId(eq(objectTypeId()))

        doReturn(pluginConfiguration())
            .whenever(pluginServiceMock).findPluginConfiguration<OipKlanttaakPlugin>(any(), any())

        doReturn(objectenApiPlugin())
            .whenever(pluginServiceMock).createInstance<ObjectenApiPlugin>(eq(objectenApiPluginConfigurationId()))

        // when
        assertDoesNotThrow {
            listener.handle(event)
        }

        // then
        verify(taskServiceMock, never()).findTaskById(any())
    }

    private fun klanttaak(status: Status = Status.UITGEVOERD) = Klanttaak(
        titel = "Klanttaak",
        status = status,
        eigenaar = "GZAC",
        betrokkene = Betrokkene(
            levelOfAssurance = LevelOfAssurance.MOBILE_TWO_FACTOR_CONTRACT,
            authorizee = Authorizee(
                legalSubject = LegalSubject(identifier = "Authorizee")
            )
        ),
        portaalformulier = Portaalformulier(
            formulier = Formulier(
                value = URI.create("https://example.com/form/123")
            ),
        ),
        verwerkerTaakId = UUID.fromString("99ab6902-80a1-46f9-8c79-5c040ebd118f")
    )

    private fun notificatiesApiNotificationReceivedEvent() = mock<NotificatiesApiNotificationReceivedEvent> {
        on { kanaal } doReturn "objecten"
        on { actie } doReturn "update"
        on { resourceUrl } doReturn "https://example.com/resource/9aa32593-6e0a-42f9-9e36-3e1ee180003f"
        on { kenmerken } doReturn mapOf("objectType" to "https://example.com/objectType/${objectTypeId()}")
    }

    private fun pluginConfigurationId() = UUID.fromString("5489f080-8355-4f28-a305-5ebd88ecdd22")

    private fun pluginConfiguration() = PluginConfiguration(
        id = PluginConfigurationId.existingId(pluginConfigurationId()),
        title = "OIP Klanttaak Plugin Configuration",
        pluginDefinition = mock()
    )

    private fun objectManagementConfigurationId() = UUID.fromString("135851f4-ace3-4e8c-832b-ec71b0a28352")

    private fun objecttypenApiPluginConfigurationId() = UUID.fromString("edde7ae6-6ad3-40b7-aeb2-7e5cc6bc5ca2")

    private fun objectenApiPluginConfigurationId() = UUID.fromString("c77c4eb2-0af8-4af3-927b-ac6e3e84b7c7")

    private fun objectTypeId() = "72d10488-30b6-48cc-8670-edc07c0e7252"

    private fun objectManagementConfiguration() = ObjectManagement(
        id = objectManagementConfigurationId(),
        title = "OIP Klanttaak",
        objecttypenApiPluginConfigurationId = objecttypenApiPluginConfigurationId(),
        objecttypeId = objectTypeId(),
        objectenApiPluginConfigurationId = objectenApiPluginConfigurationId()
    )

    private fun objectenApiPlugin(): ObjectenApiPlugin {
        val objectRecord = ObjectRecord(
            typeVersion = 1,
            startAt = LocalDate.parse("2023-01-01"),
            data = objectMapper.valueToTree(klanttaak())
        )
        val objectWrapper = ObjectWrapper(
            url = mock(),
            uuid = UUID.fromString("fbf7f397-946f-4656-9cce-46d539ea43a7"),
            type = mock(),
            record = objectRecord
        )
        return mock<ObjectenApiPlugin> {
            on { getObject(any() ) } doReturn objectWrapper
        }
    }
}