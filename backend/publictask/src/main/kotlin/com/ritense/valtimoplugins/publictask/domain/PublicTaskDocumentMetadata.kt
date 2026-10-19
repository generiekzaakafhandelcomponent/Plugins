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

import com.fasterxml.jackson.core.type.TypeReference
import com.ritense.resource.domain.MetadataType
import com.ritense.valtimo.contract.json.MapperSingleton
import io.github.oshai.kotlinlogging.KotlinLogging

// Written on every file of one public task; the Documenten API cannot default informatieobjecttype or titel.
data class PublicTaskDocumentMetadata(
    val fields: Map<String, String> = emptyMap(),
) {
    fun toJson(): String = if (fields.isEmpty()) "" else MapperSingleton.get().writeValueAsString(fields)

    companion object {
        // Owned by storage and this plugin: setting `user` or `documentId` would turn the submission check off.
        private val RESERVED_KEYS: Set<String> = MetadataType.entries.map { it.key }.toSet()

        private val logger = KotlinLogging.logger {}

        private val MAP_TYPE = object : TypeReference<Map<String, String>>() {}

        /** Reads what the process link configured. Empty means "not set"; a reserved key is dropped with a warning. */
        fun of(fields: Map<String, String?>?): PublicTaskDocumentMetadata {
            if (fields.isNullOrEmpty()) {
                return PublicTaskDocumentMetadata()
            }
            val configured =
                buildMap {
                    fields.forEach { (key, value) ->
                        val name = key.trim()
                        if (name.isNotEmpty() && !value.isNullOrBlank()) {
                            put(name, value)
                        }
                    }
                }
            val reserved = configured.keys.filter { it in RESERVED_KEYS }
            if (reserved.isNotEmpty()) {
                logger.warn {
                    "Ignoring document metadata ${reserved.sorted()} of a public task process link: those keys " +
                        "are set by the plugin itself and cannot be configured"
                }
            }
            return PublicTaskDocumentMetadata(configured.filterKeys { it !in RESERVED_KEYS })
        }

        fun fromJson(json: String?): PublicTaskDocumentMetadata {
            if (json.isNullOrBlank()) {
                return PublicTaskDocumentMetadata()
            }
            return try {
                PublicTaskDocumentMetadata(MapperSingleton.get().readValue(json, MAP_TYPE))
            } catch (e: Exception) {
                // The upload goes ahead: the applicant could not act on this error anyway.
                logger.warn(e) { "Could not read the document metadata of a public task, so none is applied" }
                PublicTaskDocumentMetadata()
            }
        }
    }
}
