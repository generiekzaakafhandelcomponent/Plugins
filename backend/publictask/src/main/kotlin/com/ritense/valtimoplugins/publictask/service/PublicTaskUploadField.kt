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

package com.ritense.valtimoplugins.publictask.service

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.node.ObjectNode
import com.ritense.form.domain.FormIoFormDefinition.PROPERTY_KEY
import com.ritense.form.domain.submission.formfield.UploadField
import io.github.oshai.kotlinlogging.KotlinLogging

/** The upload components of a form definition, and what each accepts. [UploadField] decides what counts as one. */
object PublicTaskUploadField {
    private const val FILE_MAX_SIZE = "fileMaxSize"

    private const val FILE_PATTERN = "filePattern"

    /** What the field with [componentKey] accepts, or `null` when the definition has no such upload component. */
    fun limitsOf(
        formDefinition: JsonNode,
        componentKey: String,
    ): PublicTaskUploadFieldLimits? {
        val component = find(formDefinition, componentKey) ?: return null
        return PublicTaskUploadFieldLimits(
            maxSizeInBytes = component.fileMaxSizeInBytes(componentKey),
            filePattern = component.narrowingFilePattern(),
        )
    }

    /** Runs [action] on every upload component in [node]. The whole tree is walked, layout types included. */
    fun forEachUploadComponent(
        node: JsonNode,
        action: (ObjectNode) -> Unit,
    ) {
        node.forEach { child ->
            if (child.isUploadComponent()) {
                action(child as ObjectNode)
            }
            forEachUploadComponent(child, action)
        }
    }

    /** The first upload component under [componentKey]; stops there rather than walking the rest. */
    private fun find(
        node: JsonNode,
        componentKey: String,
    ): ObjectNode? {
        for (child in node) {
            if (child.isUploadComponent() && child.path(PROPERTY_KEY).textValue() == componentKey) {
                return child as ObjectNode
            }
            find(child, componentKey)?.let { return it }
        }
        return null
    }

    private fun JsonNode.isUploadComponent(): Boolean = this is ObjectNode && UploadField.isUploadComponent(this)

    /** Form.io's "Maximum File Size", as bytes. Unreadable means no limit of its own, not a limit of zero. */
    private fun JsonNode.fileMaxSizeInBytes(componentKey: String): Long? {
        val configured = path(FILE_MAX_SIZE).textValue()?.trim()?.takeIf { it.isNotEmpty() } ?: return null
        val parsed = parseFileSize(configured)
        if (parsed == null) {
            logger.warn {
                "Ignoring the maximum file size '$configured' of upload field '$componentKey': it is not a " +
                    "size Form.io can read either. Use a value like '10MB'."
            }
        }
        return parsed
    }

    /** Form.io's "File Pattern", or `null` when it narrows nothing. The builder writes `*` into every field. */
    private fun JsonNode.narrowingFilePattern(): String? =
        path(FILE_PATTERN)
            .textValue()
            ?.trim()
            ?.takeIf { it.isNotEmpty() && it != "*" }

    /** A number with an optional `KB`, `MB` or `GB` suffix. Mirrors Form.io's own `translateScalars`. */
    internal fun parseFileSize(value: String): Long? {
        val size = value.trim().lowercase()
        val (number, multiplier) =
            when {
                size.endsWith("kb") -> size.dropLast(2) to 1024L
                size.endsWith("mb") -> size.dropLast(2) to 1024L * 1024
                size.endsWith("gb") -> size.dropLast(2) to 1024L * 1024 * 1024
                size.endsWith("b") -> size.dropLast(1) to 1L
                else -> size to 1L
            }
        val amount = number.trim().toDoubleOrNull()?.takeIf { it >= 0 } ?: return null
        return (amount * multiplier).toLong()
    }

    private val logger = KotlinLogging.logger {}
}

/** What one upload field accepts on top of the task's own limits. Both are optional. */
data class PublicTaskUploadFieldLimits(
    val maxSizeInBytes: Long?,
    val filePattern: String?,
)
