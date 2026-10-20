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
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.anyOrNull
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import kotlin.test.assertEquals

class DocumentGeneratorResourceTest {
    private val templateService =
        mock<TemplateService>().also {
            whenever(
                it.generate(
                    any<String>(),
                    any<String>(),
                    any<Map<String, Any?>>(),
                    anyOrNull<Document>(),
                    any<MissingPlaceholderStrategy>(),
                    anyOrNull<String>(),
                ),
            ).thenReturn("preview")
        }
    private val documentGeneratorPlugin = mock<DocumentGeneratorPlugin>()
    private val pluginService =
        mock<PluginService>().also {
            whenever(it.createInstance(eq(DocumentGeneratorPlugin::class.java), any()))
                .thenReturn(documentGeneratorPlugin)
        }
    private val resource = DocumentGeneratorResource(templateService, pluginService)

    @Test
    fun `should keep the full file name in the download header`() {
        val response =
            resource.getTemplatePreview(
                TemplatePreviewRequest(fileName = "Zoë; rapport 1.txt", content = "preview"),
            )

        assertEquals("attachment", response.headers.contentDisposition.type)
        assertEquals("Zoë; rapport 1.txt", response.headers.contentDisposition.filename)
    }

    @Test
    fun `should respond with the preview in its own content type`() {
        MockMvcBuilders
            .standaloneSetup(resource)
            .build()
            .perform(
                post("/api/management/v1/template/preview")
                    .contentType(APPLICATION_JSON)
                    .accept("application/json, text/plain, */*")
                    .content("""{"fileName":"letter.txt","content":"preview"}"""),
            ).andExpect(status().isOk)
            .andExpect(content().contentType("text/plain"))
            .andExpect(content().string("preview"))
    }

    @Test
    fun `should fail the request when the pdf can't be rendered`() {
        whenever(documentGeneratorPlugin.generatePdf(any(), any())).thenThrow(IllegalStateException("invalid XHTML"))

        assertThrows<IllegalStateException> {
            resource.getTemplatePreview(TemplatePreviewRequest(fileName = "letter.pdf", content = "preview"))
        }
    }
}
