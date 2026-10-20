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

package com.ritense.valtimoplugins.publictask.domain

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class PublicTaskBaseUrlTest {
    @Test
    fun `a full URL is taken as it is`() {
        assertThat(PublicTaskBaseUrl.of("https://gemeente.example.org")).isEqualTo("https://gemeente.example.org")
    }

    @Test
    fun `a URL that names a path keeps it`() {
        assertThat(PublicTaskBaseUrl.of("https://example.org/valtimo")).isEqualTo("https://example.org/valtimo")
    }

    @Test
    fun `a hostname on its own is read as an https URL`() {
        assertThat(PublicTaskBaseUrl.of("gemeente.example.org")).isEqualTo("https://gemeente.example.org")
    }

    @Test
    fun `the scheme of the environment fills in a missing one`() {
        assertThat(PublicTaskBaseUrl.of("localhost:8080", "http")).isEqualTo("http://localhost:8080")
    }

    @Test
    fun `a trailing slash is dropped, so it cannot end up in a link twice`() {
        assertThat(PublicTaskBaseUrl.of("https://example.org/")).isEqualTo("https://example.org")
    }

    @Test
    fun `surrounding whitespace is not part of the URL`() {
        assertThat(PublicTaskBaseUrl.of("  https://example.org  ")).isEqualTo("https://example.org")
    }

    @Test
    fun `nothing entered is nothing to fall back on, not an error`() {
        assertThat(PublicTaskBaseUrl.of(null)).isNull()
        assertThat(PublicTaskBaseUrl.of("")).isNull()
        assertThat(PublicTaskBaseUrl.of("   ")).isNull()
    }

    @Test
    fun `a port is not a scheme, so a host that names one keeps it`() {
        assertThat(PublicTaskBaseUrl.of("example.org:8080")).isEqualTo("https://example.org:8080")
        assertThat(PublicTaskBaseUrl.of("example.org:8080/valtimo")).isEqualTo("https://example.org:8080/valtimo")
        assertThat(PublicTaskBaseUrl.of("https://example.org:8443")).isEqualTo("https://example.org:8443")
    }

    @Test
    fun `something that is not a web address is refused`() {
        assertThrows<IllegalArgumentException> { PublicTaskBaseUrl.of("javascript://alert(1)") }
        assertThrows<IllegalArgumentException> { PublicTaskBaseUrl.of("ftp://files.example.org") }
        assertThrows<IllegalArgumentException> { PublicTaskBaseUrl.of("https:///etc/passwd") }
    }

    @Test
    fun `a scheme that is not written in full is refused rather than read as a host`() {
        assertThrows<IllegalArgumentException> { PublicTaskBaseUrl.of("http:/example.org") }
        assertThrows<IllegalArgumentException> { PublicTaskBaseUrl.of("https:/example.org") }
        assertThrows<IllegalArgumentException> { PublicTaskBaseUrl.of("javascript:alert(1)") }
        assertThrows<IllegalArgumentException> { PublicTaskBaseUrl.of("ftp:files.example.org") }
        assertThrows<IllegalArgumentException> { PublicTaskBaseUrl.of("mailto:someone@example.org") }
    }
}
