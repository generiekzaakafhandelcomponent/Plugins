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

import com.ritense.valtimoplugins.publictask.BaseTest
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

internal class PublicTaskAttachmentLimitsTest : BaseTest() {
    @Test
    fun `a process link that asks for nothing gets the defaults, not the absence of a limit`() {
        val limits =
            PublicTaskAttachmentLimits.of(
                maxAttachments = null,
                maxSizeInBytes = null,
                acceptedMimeTypes = null,
            )

        assertThat(limits.maxAttachments).isEqualTo(10)
        assertThat(limits.maxSizeInBytes).isEqualTo(10 * 1024 * 1024)
        assertThat(limits.acceptedMimeTypes).isEmpty()
    }

    @Test
    fun `a value that is not a limit at all falls back to the default too`() {
        val limits = PublicTaskAttachmentLimits.of(maxAttachments = -1, maxSizeInBytes = -1, acceptedMimeTypes = null)

        assertThat(limits.maxAttachments).isEqualTo(10)
        assertThat(limits.maxSizeInBytes).isEqualTo(10 * 1024 * 1024)
    }

    @Test
    fun `zero is a limit and is kept`() {
        val limits = PublicTaskAttachmentLimits.of(maxAttachments = 0, maxSizeInBytes = 1, acceptedMimeTypes = null)

        assertThat(limits.maxAttachments).isZero()
    }

    @Test
    fun `the accepted mime types are read as the list an administrator typed`() {
        val limits =
            PublicTaskAttachmentLimits.of(
                maxAttachments = null,
                maxSizeInBytes = null,
                acceptedMimeTypes = " application/pdf , IMAGE/JPEG ,, ",
            )

        assertThat(limits.acceptedMimeTypes).containsExactly("application/pdf", "image/jpeg")
    }

    @Test
    fun `a task that narrows the types accepts those and nothing else`() {
        val limits =
            PublicTaskAttachmentLimits.of(
                maxAttachments = null,
                maxSizeInBytes = null,
                acceptedMimeTypes = "application/pdf",
            )

        assertThat(limits.accepts("application/pdf")).isTrue()
        assertThat(limits.accepts("APPLICATION/PDF")).isTrue()
        assertThat(limits.accepts("application/zip")).isFalse()
    }

    @Test
    fun `a task that does not narrow the types leaves the decision to the application`() {
        val limits = PublicTaskAttachmentLimits.of(maxAttachments = null, maxSizeInBytes = null, acceptedMimeTypes = "")

        assertThat(limits.accepts("application/x-dosexec")).isTrue()
    }
}
