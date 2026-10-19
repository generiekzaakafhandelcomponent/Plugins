/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

// What one public task's upload endpoint accepts, fixed when it was created. A field can only narrow it.
data class PublicTaskAttachmentLimits(
    val maxAttachments: Int = DEFAULT_MAX_ATTACHMENTS,
    val maxSizeInBytes: Long = DEFAULT_MAX_SIZE_IN_BYTES,
    // Empty leaves the types to 'valtimo.upload.accepted-mime-types' and to the field's file pattern.
    val acceptedMimeTypes: List<String> = emptyList(),
) {
    fun accepts(mimeType: String): Boolean =
        acceptedMimeTypes.isEmpty() || acceptedMimeTypes.contains(mimeType.lowercase())

    companion object {
        const val DEFAULT_MAX_ATTACHMENTS = 10

        const val DEFAULT_MAX_SIZE_IN_BYTES = 10L * 1024 * 1024

        /** Absent or negative falls back to the default, not to "unbounded". Zero is a limit and is kept. */
        fun of(
            maxAttachments: Int?,
            maxSizeInBytes: Long?,
            acceptedMimeTypes: String?,
        ): PublicTaskAttachmentLimits =
            PublicTaskAttachmentLimits(
                maxAttachments = maxAttachments?.takeIf { it >= 0 } ?: DEFAULT_MAX_ATTACHMENTS,
                maxSizeInBytes = maxSizeInBytes?.takeIf { it >= 0 } ?: DEFAULT_MAX_SIZE_IN_BYTES,
                acceptedMimeTypes = parseMimeTypes(acceptedMimeTypes),
            )

        /** Reads the comma separated list the process link screen collects. Lower case: case is not meaningful. */
        fun parseMimeTypes(acceptedMimeTypes: String?): List<String> =
            acceptedMimeTypes
                ?.split(',')
                ?.map { it.trim().lowercase() }
                ?.filter { it.isNotEmpty() }
                ?: emptyList()
    }
}
