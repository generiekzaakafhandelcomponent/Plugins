package com.ritense.externeklanttaak

import com.fasterxml.jackson.module.kotlin.treeToValue
import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.externeklanttaak.TestHelper.afgerondeTaakObject
import com.ritense.externeklanttaak.TestHelper.objectMapper
import com.ritense.externeklanttaak.TestHelper.objectUrl
import com.ritense.externeklanttaak.TestHelper.objecttypeId
import com.ritense.externeklanttaak.TestHelper.objecttypeUrl
import com.ritense.externeklanttaak.domain.IExterneKlanttaakVersion
import com.ritense.externeklanttaak.listener.ExterneKlanttaakEventListener
import com.ritense.externeklanttaak.plugin.ExterneKlanttaakPlugin
import com.ritense.externeklanttaak.service.ExterneKlanttaakService
import com.ritense.notificatiesapi.event.NotificatiesApiNotificationReceivedEvent
import com.ritense.objectenapi.ObjectenApiPlugin
import com.ritense.objectmanagement.domain.ObjectManagement
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.objecttypenapi.ObjecttypenApiPlugin
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.camunda.domain.CamundaTask
import com.ritense.valtimo.service.CamundaProcessService
import com.ritense.valtimo.service.CamundaTaskService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.util.UUID

class ExterneKlanttaakEventListenerTest {

    private lateinit var externeklanttaakEventListener: ExterneKlanttaakEventListener
    private lateinit var objectManagementService: ObjectManagementService
    private lateinit var pluginService: PluginService
    private lateinit var taskService: CamundaTaskService
    private lateinit var processDocumentService: ProcessDocumentService
    private lateinit var processService: CamundaProcessService
    private lateinit var objectManagement: ObjectManagement
    private lateinit var externeKlanttaakPluginConfig: PluginConfiguration
    private lateinit var objectenApiPlugin: ObjectenApiPlugin
    private lateinit var objecttypenApiPlugin: ObjecttypenApiPlugin
    private lateinit var externeKlanttaakPlugin: ExterneKlanttaakPlugin
    private lateinit var externeKlanttaakService: ExterneKlanttaakService
    private lateinit var camundaTask: CamundaTask

    @BeforeEach
    fun setUp() {
        objectManagementService = mock()
        pluginService = mock()
        taskService = mock()
        processDocumentService = mock()
        processService = mock()
        objectManagement = mock()
        objectenApiPlugin = mock()
        objecttypenApiPlugin = mock()
        externeKlanttaakPluginConfig = mock()
        externeKlanttaakService = mock()
        camundaTask = mock()

        externeKlanttaakPlugin =
            ExterneKlanttaakPlugin(
                externeKlanttaakService = externeKlanttaakService,
                availableExterneKlanttaakVersions = mock<List<IExterneKlanttaakVersion>>()
            )

        externeklanttaakEventListener = ExterneKlanttaakEventListener(
            objectManagementService,
            pluginService,
            taskService,
            processDocumentService,
            processService,
        )
    }

    @Test
    fun `should invoke complete function for compatible event`() {
        // given
        val objectenApiPluginId = UUID.randomUUID()
        val externeKlanttaakPluginId = UUID.randomUUID()
        val finalizerProcess = "test-finalizer-process"
        val event = NotificatiesApiNotificationReceivedEvent(
            "objecten",
            objectUrl,
            "update",
            mapOf(
                "objectType" to objecttypeUrl,
            )
        )

        whenever(objectManagementService.findByObjectTypeId(objecttypeId))
            .thenReturn(objectManagement)
        whenever(objectManagement.objectenApiPluginConfigurationId)
            .thenReturn(objectenApiPluginId)
        whenever(pluginService.findPluginConfiguration(eq(ExterneKlanttaakPlugin::class.java), any()))
            .thenReturn(externeKlanttaakPluginConfig)
        whenever(externeKlanttaakPluginConfig.id)
            .thenReturn(PluginConfigurationId.existingId(externeKlanttaakPluginId))
        whenever(objectenApiPlugin.getObject(any()))
            .thenReturn(objectMapper.treeToValue(afgerondeTaakObject))
        whenever(pluginService.createInstance<ObjectenApiPlugin>(objectenApiPluginId))
            .thenReturn(objectenApiPlugin)
        whenever(pluginService.createInstance<ExterneKlanttaakPlugin>(externeKlanttaakPluginId))
            .thenReturn(
                externeKlanttaakPlugin
                    .also {
                        it.finalizerProcess = finalizerProcess
                    }
            )
        whenever(taskService.findTaskById(any()))
            .thenReturn(camundaTask)
        whenever(camundaTask.getProcessInstanceId())
            .thenReturn(UUID.randomUUID().toString())
        whenever(processDocumentService.getDocumentId(any(), any()))
            .thenReturn(JsonSchemaDocumentId.newId(UUID.randomUUID()))

        // when
        externeklanttaakEventListener.handle(event)

        // then
        verify(objectenApiPlugin, times(1)).getObject(any())
        verify(processDocumentService, times(1)).getDocumentId(any(), any())
        verify(taskService, times(1)).findTaskById(any())
    }
}