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

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.document.domain.impl.JsonSchemaDocumentId
import com.ritense.externeklanttaak.domain.KlanttaakVersion
import com.ritense.externeklanttaak.domain.SpecVersion
import com.ritense.externeklanttaak.model.IPluginActionConfig
import com.ritense.externeklanttaak.model.TaakReceiver.OTHER
import com.ritense.externeklanttaak.model.TaakSoort.URL
import com.ritense.externeklanttaak.model.impl.CreateTaakActionV1x1x0
import com.ritense.externeklanttaak.plugin.ExterneKlanttaakPlugin
import com.ritense.externeklanttaak.service.ExterneKlanttaakService
import com.ritense.externeklanttaak.service.impl.DefaultUtilityService
import com.ritense.objectmanagement.service.ObjectManagementService
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.valtimo.contract.json.MapperSingleton
import com.ritense.valueresolver.ValueResolverService
import com.ritense.zakenapi.ZakenApiPlugin
import com.ritense.zakenapi.link.ZaakInstanceLinkService
import org.camunda.bpm.engine.delegate.DelegateTask
import org.camunda.community.mockito.delegate.DelegateTaskFake
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.util.UUID


internal class ExterneKlanttaakPluginTest {

    private lateinit var objectManagementService: ObjectManagementService
    private lateinit var pluginService: PluginService
    private lateinit var valueResolverService: ValueResolverService
    private lateinit var processDocumentService: ProcessDocumentService
    private lateinit var zaakInstanceLinkService: ZaakInstanceLinkService
    private lateinit var externeKlanttaakPlugin: ExterneKlanttaakPlugin
    private lateinit var externeKlanttaakService: ExterneKlanttaakService
    private lateinit var utilService: DefaultUtilityService
    private lateinit var zakenApiPlugin: ZakenApiPlugin
    private lateinit var objectMapper: ObjectMapper
    private val delegateTask = mock<DelegateTask>()
    private val bsn = "688223436"
    private val kvk = "12345678"
    private val jsonSchemaDocumentId = mock<JsonSchemaDocumentId>()

    @BeforeEach
    fun init() {
        objectManagementService = mock()
        pluginService = mock()
        valueResolverService = mock()
        processDocumentService = mock()
        zaakInstanceLinkService = mock()
        externeKlanttaakService = mock()
        utilService = mock()
        zakenApiPlugin = mock()
        objectMapper = MapperSingleton.get()
        whenever(pluginService.getObjectMapper()).thenReturn(objectMapper)
        externeKlanttaakPlugin = ExterneKlanttaakPlugin(
            externeKlanttaakService,
        )
        externeKlanttaakPlugin.notificatiesApiPluginConfiguration = mock()
        externeKlanttaakPlugin.objectManagementConfigurationId = mock()
    }

    @Test
    fun `should throw exception with unsupported action`() {
        val version = KlanttaakVersion.V1_1_0
        val oldUnsupportedConfig = OldUnsupportedAction()
        val futureUnsupportedConfig = FutureUnsupportedAction()

        externeKlanttaakPlugin.klanttaakVersion = version

        assertThrows<IllegalArgumentException> {
            externeKlanttaakPlugin.createExterneKlanttaak(
                DelegateTaskFake(),
                oldUnsupportedConfig
            )
        }
        assertThrows<IllegalArgumentException> {
            externeKlanttaakPlugin.createExterneKlanttaak(
                DelegateTaskFake(),
                futureUnsupportedConfig
            )
        }
    }

    @Test
    fun `should pass version check for supported action`() {
        // given
        val action = CreateTaakActionV1x1x0(
            taakSoort = URL,
            url = "pv:external-url",
            taakReceiver = OTHER,
            identificationKey = "bsn",
            identificationValue = "999990755",
            verloopdatum = "01-01-2025"
        )
        val pluginTaakVersion = KlanttaakVersion.V1_1_0
        externeKlanttaakPlugin.klanttaakVersion = pluginTaakVersion
        externeKlanttaakPlugin.objectManagementConfigurationId = UUID.randomUUID()

        // when
        externeKlanttaakPlugin.createExterneKlanttaak(delegateTask, action)

        // then
        verify(externeKlanttaakService, times(1)).createExterneKlanttaak(any(), any(), any(), any())
    }

    companion object {
        @SpecVersion(min = "0.1.0", max = "1.0.0")
        class OldUnsupportedAction(
            override val resultingKlanttaakObjectUrlVariable: String? = null,
            override val klanttaakObjectUrl: String? = null,
        ) : IPluginActionConfig

        @SpecVersion("2.0.0")
        class FutureUnsupportedAction(
            override val resultingKlanttaakObjectUrlVariable: String? = null,
            override val klanttaakObjectUrl: String? = null,
        ) : IPluginActionConfig
    }
}