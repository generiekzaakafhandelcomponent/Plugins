/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.plugin.text

import com.ritense.authorization.AuthorizationContext.Companion.runWithoutAuthorization
import com.ritense.document.domain.impl.request.NewDocumentRequest
import com.ritense.valtimoplugins.freemarker.BaseIntegrationTest
import com.ritense.plugin.domain.PluginConfiguration
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.processdocument.domain.impl.request.NewDocumentAndStartProcessRequest
import com.ritense.processdocument.service.ProcessDocumentService
import com.ritense.processdocument.service.result.NewDocumentAndStartProcessResult
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimo.camunda.service.CamundaRuntimeService
import com.ritense.valtimo.contract.json.MapperSingleton
import java.util.UUID
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional
import kotlin.test.assertEquals
import kotlin.test.assertNotNull

@Transactional
class TextTemplatePluginIT : BaseIntegrationTest() {

    @Autowired
    lateinit var processDocumentService: ProcessDocumentService

    @Autowired
    lateinit var pluginService: PluginService

    @Autowired
    lateinit var camundaRuntimeService: CamundaRuntimeService

    @Autowired
    lateinit var storageService: TemporaryResourceStorageService

    lateinit var configuration: PluginConfiguration

    @BeforeEach
    internal fun setUp() {
        configuration =
            pluginService.getPluginConfiguration(PluginConfigurationId(UUID.fromString("515cc605-b5e5-4875-bbf0-f609f788f80e")))
    }

    @Test
    fun `save generate text and save to temporary file`() {

        val result = createDocumentAndStartProcess("""{ "lastname": "Doe", "houseNumber": 133 }""")

        val contentId = runWithoutAuthorization {
            camundaRuntimeService.getVariables(
                result.resultingProcessInstanceId().get().toString(),
                listOf("contentId")
            )["contentId"] as String
        }
        assertNotNull(contentId)
        val textContent = storageService.getResourceContentAsInputStream(contentId).bufferedReader().readText()
        assertEquals("<b>Lastname: Doe, House number: 133!</b>", textContent)
    }

    private fun createDocumentAndStartProcess(
        documentContent: String = "{}",
        processVars: Map<String, Any> = emptyMap()
    ): NewDocumentAndStartProcessResult {
        val request = NewDocumentAndStartProcessRequest(
            PROCESS_DEFINITION_KEY,
            NewDocumentRequest(
                DOCUMENT_DEFINITION_NAME,
                MapperSingleton.get().readTree(documentContent)
            )
        )
        request.withProcessVars(processVars)
        val result = runWithoutAuthorization { processDocumentService.newDocumentAndStartProcess(request) }
        if (result.errors().isNotEmpty()) {
            throw IllegalStateException(result.errors().first().asString())
        }
        return result
    }

    companion object {
        private const val PROCESS_DEFINITION_KEY = "TestProcess"
        private const val DOCUMENT_DEFINITION_NAME = "profile"
    }

}
