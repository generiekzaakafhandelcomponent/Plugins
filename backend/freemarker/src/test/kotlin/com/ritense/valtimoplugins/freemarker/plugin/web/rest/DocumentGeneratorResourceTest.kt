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

package com.ritense.valtimoplugins.freemarker.plugin.web.rest

import com.ritense.document.domain.Document
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.freemarker.model.MissingPlaceholderStrategy
import com.ritense.valtimoplugins.freemarker.plugin.documentgenerator.DocumentGeneratorPlugin
import com.ritense.valtimoplugins.freemarker.plugin.web.rest.dto.TemplatePreviewRequest
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import kotlin.test.assertEquals

class DocumentGeneratorResourceTest {
    @Test
    fun `should keep the full file name in the download header`() {
        val templateService = mock<TemplateService>()
        whenever(
            templateService.generate(
                any<String>(),
                any<String>(),
                any<Map<String, Any?>>(),
                anyOrNull<Document>(),
                any<MissingPlaceholderStrategy>(),
            ),
        ).thenReturn("preview")
        val pluginService = mock<PluginService>()
        whenever(pluginService.createInstance(eq(DocumentGeneratorPlugin::class.java), any()))
            .thenReturn(mock<DocumentGeneratorPlugin>())
        val resource = DocumentGeneratorResource(templateService, pluginService)

        val response =
            resource.getTemplatePreview(
                TemplatePreviewRequest(fileName = "Zoë; rapport 1.txt", content = "preview"),
            )

        assertEquals("attachment", response.headers.contentDisposition.type)
        assertEquals("Zoë; rapport 1.txt", response.headers.contentDisposition.filename)
    }
}
