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

internal class FormIoFilePatternTest : BaseTest() {
    @ParameterizedTest
    @CsvSource(
        // pattern, file name, detected type, accepted
        "application/pdf, factuur.pdf, application/pdf, true",
        "application/pdf, factuur.pdf, application/zip, false",
        "image/*, foto.jpg, image/jpeg, true",
        "image/*, foto.jpg, application/zip, false",
        ".pdf, factuur.pdf, application/pdf, true",
        ".pdf, factuur.txt, text/plain, false",
        "'application/pdf,image/jpeg', foto.jpg, image/jpeg, true",
        "'application/pdf,image/jpeg', tekening.png, image/png, false",
        "APPLICATION/PDF, factuur.pdf, application/pdf, true",
        "*, factuur.pdf, application/pdf, true",
    )
    fun `a pattern accepts what Form io accepts`(
        pattern: String,
        fileName: String,
        mimeType: String,
        accepted: Boolean,
    ) {
        assertThat(FormIoFilePattern.matches(pattern, fileName, mimeType)).isEqualTo(accepted)
    }

    @ParameterizedTest
    @CsvSource(
        "'!.exe', factuur.pdf, application/pdf, true",
        "'!.exe', virus.exe, application/x-dosexec, false",
        "'!application/x-dosexec', virus.pdf, application/x-dosexec, false",
    )
    fun `a pattern can exclude instead of include`(
        pattern: String,
        fileName: String,
        mimeType: String,
        accepted: Boolean,
    ) {
        assertThat(FormIoFilePattern.matches(pattern, fileName, mimeType)).isEqualTo(accepted)
    }

    @Test
    fun `a pattern that both includes and excludes asks for both, whichever order it is written in`() {
        // Form.io's own answer here depends on the order the parts are in; this is the stricter reading.
        listOf("application/pdf,!.exe", "!.exe,application/pdf").forEach { pattern ->
            assertThat(FormIoFilePattern.matches(pattern, "factuur.pdf", "application/pdf")).isTrue()
            assertThat(FormIoFilePattern.matches(pattern, "factuur.zip", "application/zip")).isFalse()
            assertThat(FormIoFilePattern.matches(pattern, "factuur.exe", "application/x-dosexec")).isFalse()
        }
    }

    @Test
    fun `a pattern is matched against the type the content was detected as, not the one that was claimed`() {
        // A pattern naming the type refuses a renamed file; one naming an extension speaks about the name.
        assertThat(FormIoFilePattern.matches("application/pdf", "factuur.pdf", "application/x-dosexec")).isFalse()
        assertThat(FormIoFilePattern.matches(".pdf", "factuur.pdf", "application/x-dosexec")).isTrue()
    }

    @Test
    fun `a pattern still decides when the content could not be typed`() {
        assertThat(FormIoFilePattern.matches(".pdf", "factuur.pdf", null)).isTrue()
        assertThat(FormIoFilePattern.matches("application/pdf", "factuur.pdf", null)).isFalse()
    }

    @Test
    fun `a pattern written as a regular expression is used as one`() {
        assertThat(FormIoFilePattern.matches("/^image\\/(jpeg|png)$/", "foto.jpg", "image/jpeg")).isTrue()
        assertThat(FormIoFilePattern.matches("/^image\\/(jpeg|png)$/", "foto.gif", "image/gif")).isFalse()
    }

    @Test
    fun `a pattern matches the whole value rather than a part of it`() {
        assertThat(FormIoFilePattern.matches("application/pdf", "factuur.pdfx", "application/pdfx")).isFalse()
        assertThat(FormIoFilePattern.matches(".pdf", "factuur.pdf.exe", "application/x-dosexec")).isFalse()
    }
}
