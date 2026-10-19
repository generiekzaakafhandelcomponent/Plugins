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

import com.ritense.valtimoplugins.publictask.BaseTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource
import org.junit.jupiter.params.provider.ValueSource

internal class PublicTaskUploadFieldTest : BaseTest() {
    @ParameterizedTest
    @ValueSource(strings = ["file", "valtimo-file", "documenten-api-file"])
    fun `the limits of an upload field are read for every upload component Valtimo recognises`(type: String) {
        val form = formWith("""{"key": "bijlage", "type": "$type", "input": true, "fileMaxSize": "2MB"}""")

        assertThat(PublicTaskUploadField.limitsOf(form, "bijlage")?.maxSizeInBytes).isEqualTo(2 * 1024 * 1024)
    }

    @Test
    fun `an upload field nested in a layout component is found too`() {
        val form =
            formWith(
                """
                {
                  "key": "kolommen",
                  "type": "columns",
                  "columns": [
                    {
                      "components": [
                        { "key": "bijlage", "type": "file", "input": true, "filePattern": "application/pdf" }
                      ]
                    }
                  ]
                }
                """.trimIndent(),
            )

        assertThat(PublicTaskUploadField.limitsOf(form, "bijlage")?.filePattern).isEqualTo("application/pdf")
    }

    @Test
    fun `a field that asks for nothing of its own has no limits of its own`() {
        val form = formWith("""{"key": "bijlage", "type": "file", "input": true}""")

        assertThat(PublicTaskUploadField.limitsOf(form, "bijlage"))
            .isEqualTo(PublicTaskUploadFieldLimits(maxSizeInBytes = null, filePattern = null))
    }

    @Test
    fun `a key that is not an upload field of this form has no limits at all`() {
        val form =
            formWith(
                """{"key": "naam", "type": "textfield", "input": true}""",
                """{"key": "bijlage", "type": "file", "input": true}""",
            )

        assertThat(PublicTaskUploadField.limitsOf(form, "naam")).isNull()
        assertThat(PublicTaskUploadField.limitsOf(form, "onbekend")).isNull()
        assertThat(PublicTaskUploadField.limitsOf(form, "bijlage")).isNotNull()
    }

    @Test
    fun `the file pattern the form builder writes into every component narrows nothing`() {
        // Form.io's own default; read as a restriction it would refuse everything.
        val form = formWith("""{"key": "bijlage", "type": "file", "input": true, "filePattern": "*"}""")

        assertThat(PublicTaskUploadField.limitsOf(form, "bijlage")?.filePattern).isNull()
    }

    @Test
    fun `a blank maximum size or file pattern narrows nothing`() {
        val form =
            formWith("""{"key": "bijlage", "type": "file", "input": true, "fileMaxSize": "", "filePattern": " "}""")

        assertThat(PublicTaskUploadField.limitsOf(form, "bijlage"))
            .isEqualTo(PublicTaskUploadFieldLimits(maxSizeInBytes = null, filePattern = null))
    }

    @Test
    fun `a maximum size that Form io cannot read either is treated as no limit of its own`() {
        val form = formWith("""{"key": "bijlage", "type": "file", "input": true, "fileMaxSize": "twee megabyte"}""")

        assertThat(PublicTaskUploadField.limitsOf(form, "bijlage")?.maxSizeInBytes).isNull()
    }

    @ParameterizedTest
    @CsvSource(
        "10MB, 10485760",
        "10mb, 10485760",
        "512KB, 524288",
        "1GB, 1073741824",
        "1024B, 1024",
        "1024, 1024",
        "1.5MB, 1572864",
        "' 2 MB ', 2097152",
    )
    fun `the size format of the form builder is read the way Form io reads it`(
        configured: String,
        expected: Long,
    ) {
        assertThat(PublicTaskUploadField.parseFileSize(configured)).isEqualTo(expected)
    }

    @ParameterizedTest
    @ValueSource(strings = ["", " ", "MB", "-1MB", "twee", "10 megabytes", "1e", "??"])
    fun `a size that is not a size is not read as one`(configured: String) {
        assertThat(PublicTaskUploadField.parseFileSize(configured)).isNull()
    }
}
