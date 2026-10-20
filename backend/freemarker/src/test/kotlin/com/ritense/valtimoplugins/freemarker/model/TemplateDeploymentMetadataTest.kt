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
package com.ritense.valtimoplugins.freemarker.model

import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class TemplateDeploymentMetadataTest {
    @Test
    fun `should read the inline content`() {
        assertEquals("Hi", metadata(content = "Hi", contentRef = "/application.yml").readContent())
    }

    @Test
    fun `should read a referenced template file`() {
        val content = metadata(contentRef = "/config/template/letter.ftlh").readContent()

        assertTrue(content.isNotBlank())
    }

    @Test
    fun `should not read a referenced file that is not a template`() {
        assertThrows<IllegalArgumentException> {
            metadata(contentRef = "/config/application.yml").readContent()
        }
    }

    @Test
    fun `should report a referenced template that does not exist`() {
        val exception =
            assertThrows<IllegalArgumentException> {
                metadata(contentRef = "/config/missing.ftlh").readContent()
            }

        assertEquals("contentRef '/config/missing.ftlh' not found", exception.message)
    }

    private fun metadata(
        content: String? = null,
        contentRef: String? = null,
    ) = TemplateDeploymentMetadata(
        templateKey = "letter",
        templateType = TEMPLATE_TYPE_TEXT,
        content = content,
        contentRef = contentRef,
    )
}
