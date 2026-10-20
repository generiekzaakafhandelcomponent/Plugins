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

package com.ritense.valtimoplugins.publictask.htmlrenderer.service

import com.ritense.valtimoplugins.publictask.BaseTest
import com.ritense.valtimoplugins.publictask.htmlrenderer.config.FreemarkerConfig
import freemarker.core.HTMLOutputFormat
import freemarker.template.Template
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.io.StringWriter

internal class PublicTaskHtmlTemplateTest : BaseTest() {
    private val htmlRenderService = HtmlRenderService(FreemarkerConfig())

    @Test
    fun `a form value that closes the script element cannot break out of it`() {
        val formIoForm =
            """
            {
              "components": [
                { "key": "naam", "defaultValue": "</script><img src=x onerror=alert(1)>" }
              ]
            }
            """.trimIndent()

        val html = render(formIoForm)

        // No '<' survives in the data block, so nothing in it can close the element or open an HTML comment.
        assertThat(jsonDataBlockOf(html)).doesNotContain("<")
        assertThat(html).doesNotContain("<img")
        assertThat(html).contains("\\u003C/script>\\u003Cimg src=x onerror=alert(1)>")
    }

    @Test
    fun `a valid form definition is still readable as json after escaping`() {
        val formIoForm =
            objectMapper
                .createObjectNode()
                .put("quotes", """He said "hi" and \ left""")
                .put("unicode", "Ruben ë ç 😀")
                .put("newlines", "line one\nline two\ttabbed")
                .put("slashes", "https://example.org/a/b?c=d&e=f")
                .put("markup", "</script> <!-- <b>bold</b>")
                .toPrettyString()

        val html = render(formIoForm)

        assertThat(objectMapper.readTree(jsonDataBlockOf(html)))
            .isEqualTo(objectMapper.readTree(formIoForm))
    }

    @Test
    fun `the submit url is escaped for the javascript string literal it is placed in`() {
        val html = render(publicTaskUrl = """https://valtimo.example.org/api/v1/public-task/1' + alert(1) + '""")

        assertThat(html).doesNotContain("""' + alert(1) + '""")
        assertThat(html).contains("""\' + alert(1) + \'""")
    }

    @Test
    fun `the freemarker configuration escapes interpolations by default`() {
        assertThat(FreemarkerConfig().outputFormat).isEqualTo(HTMLOutputFormat.INSTANCE)

        // Guards the setting behaviourally as well: an interpolation without an explicit encoder must be escaped.
        val rendered =
            StringWriter()
                .apply {
                    Template("auto-escaping-check", "\${value}", FreemarkerConfig())
                        .process(mapOf("value" to "</script>"), this)
                }.toString()

        assertThat(rendered).doesNotContain("</script>")
    }

    @Test
    fun `the page uploads to the public task, and not to a target the form definition chooses`() {
        val html = render()

        assertThat(html).contains("Formio.Providers.addProvider('storage', 'publicTask', publicTaskStorage)")
        assertThat(html).contains(
            "const attachmentUrl = 'https://valtimo.example.org/api/v1/public-task/$PUBLIC_TASK_ID/attachment'",
        )
        assertThat(html).contains("request.open('POST', attachmentUrl)")
    }

    @Test
    fun `the attachment url is escaped for the javascript string literal it is placed in`() {
        val html =
            render(
                publicTaskAttachmentUrl =
                    """https://valtimo.example.org/api/v1/public-task/1/attachment' + alert(1) + '""",
            )

        assertThat(html).doesNotContain("""attachment' + alert(1) + '""")
        assertThat(html).contains("""attachment\' + alert(1) + \'""")
    }

    @Test
    fun `the upload field is one large target carrying one message`() {
        val html = render()

        assertThat(html).contains("content: 'Click here to upload a file'")
        assertThat(html).contains("font-size: 0;")
        assertThat(html).contains(".list-group:not(:has(.list-group-item:not(.list-group-header)))")
        assertThat(html).contains("""browse.click()""")
        assertThat(html).contains("""new DragEvent('drop', {dataTransfer: event.dataTransfer, bubbles: false})""")
    }

    @Test
    fun `a file that was added can be removed again`() {
        val html = render()

        // Form.io's remove buttons are empty Font Awesome <i>s, and this page loads no icon font.
        assertThat(html).contains(""".formio-component-file [ref="removeLink"]""")
        assertThat(html).contains(""".formio-component-file [ref="fileStatusRemove"]""")
        assertThat(html).contains("""content: '\2715';""")
        // A click on those buttons is Form.io's to handle, so it must not be forwarded to the browse link.
        assertThat(html).contains("""const FILE_LIST = '.list-group, .file';""")
        assertThat(html).contains("""event.target.closest(FILE_LIST)""")
    }

    @Test
    fun `a file that was refused is not shown as one that was added`() {
        val html = render()

        // Form.io lists a refused file's name and size above the reason; only the reason is left.
        assertThat(html).contains(".formio-component-file .file:has(.alert-danger) .fileSize")
        assertThat(html).contains(".formio-component-file .file:has(.alert-danger) .fileName")
    }

    @Test
    fun `the form renderer is pinned, and checked against its hash`() {
        val html = render()

        // The styling and the handlers in this page are written against the markup of this exact version.
        assertThat(html).contains("https://cdn.form.io/formiojs/4.21.2/formio.full.min.js")
        assertThat(html).contains("integrity=\"sha384-")
        assertThat(html).doesNotContain("https://cdn.form.io/formiojs/formio.full.min.js")
    }

    @Test
    fun `text meant for a screen reader is not shown to everyone`() {
        val html = render()

        // Bootstrap 5 renamed .sr-only; left unstyled, a failed upload states its message twice.
        assertThat(html).contains(".sr-only {")
        assertThat(html).contains("clip: rect(0, 0, 0, 0);")
    }

    @Test
    fun `the page tells the server which field a file was chosen in`() {
        val html = render()

        assertThat(html).contains("const componentKey = options && options.componentKey;")
        assertThat(html).contains("body.append('componentKey', componentKey)")
    }

    @Test
    fun `the maximum attachment size reaches the page as a number, not as a formatted one`() {
        val html = render(maxAttachmentSizeInBytes = 10_485_760)

        // Freemarker would otherwise render this as "10,485,760", which is not valid JavaScript.
        assertThat(html).contains("const maxAttachmentSizeInBytes = 10485760;")
    }

    private fun render(
        formIoForm: String = "{}",
        publicTaskUrl: String = "https://valtimo.example.org/api/v1/public-task/$PUBLIC_TASK_ID",
        publicTaskAttachmentUrl: String = "$publicTaskUrl/attachment",
        maxAttachmentSizeInBytes: Long = 10_485_760,
    ): String =
        htmlRenderService.generatePublicTaskHtml(
            fileName = "public_task_html",
            variables =
                mapOf(
                    "form_io_form" to formIoForm,
                    "public_task_url" to publicTaskUrl,
                    "public_task_attachment_url" to publicTaskAttachmentUrl,
                    "max_attachment_size_in_bytes" to maxAttachmentSizeInBytes,
                ),
        )

    private fun jsonDataBlockOf(html: String): String =
        requireNotNull(JSON_DATA_BLOCK.find(html)) {
            "The rendered page does not contain a <script type=\"application/json\"> data block:\n$html"
        }.groupValues[1]

    companion object {
        private const val PUBLIC_TASK_ID = "3f2a1c4e-0b7d-4a19-9c5e-8d6f0a1b2c3d"

        private val JSON_DATA_BLOCK =
            Regex(
                """<script id="form-io-form" type="application/json">(.*?)</script>""",
                RegexOption.DOT_MATCHES_ALL,
            )
    }
}
