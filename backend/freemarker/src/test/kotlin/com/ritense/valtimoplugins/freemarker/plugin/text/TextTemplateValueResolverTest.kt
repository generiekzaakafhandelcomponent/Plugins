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
package com.ritense.valtimoplugins.freemarker.plugin.text

import com.ritense.document.domain.Document
import com.ritense.document.service.DocumentService
import com.ritense.valtimoplugins.freemarker.service.TemplateService
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import java.util.function.Function
import kotlin.test.assertEquals

class TextTemplateValueResolverTest {
    private val templateService = mock<TemplateService>()
    private val documentService =
        mock<DocumentService>().also { whenever(it[DOCUMENT_ID]).thenReturn(mock<Document>()) }
    private val resolver = TextTemplateValueResolver(templateService, mock(), documentService)

    @Test
    fun `should fail on a text template that refers to itself`() {
        lateinit var resolve: Function<String, Any?>
        whenever(templateService.generate(any<String>(), any<String>(), any<Document>(), any(), any()))
            .thenAnswer { resolve.apply("loop") }
        resolve = resolver.createResolver(DOCUMENT_ID)

        val exception = assertThrows<IllegalStateException> { resolve.apply("loop") }

        assertEquals("Text template 'loop' refers to itself", exception.message)
    }

    @Test
    fun `should generate a text template again after it failed`() {
        whenever(templateService.generate(any<String>(), any<String>(), any<Document>(), any(), any()))
            .thenThrow(IllegalStateException("failed"))
            .thenReturn("text")
        val resolve = resolver.createResolver(DOCUMENT_ID)

        assertThrows<IllegalStateException> { resolve.apply("letter") }
        assertEquals("text", resolve.apply("letter"))
    }

    companion object {
        private const val DOCUMENT_ID = "ad9e9c5e-0000-0000-0000-000000000000"
    }
}
