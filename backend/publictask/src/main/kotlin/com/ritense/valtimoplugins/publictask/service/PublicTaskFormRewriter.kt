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
import com.ritense.form.domain.FormIoFormDefinition.TYPE_KEY
import com.ritense.valtimoplugins.publictask.domain.PublicTaskAttachment.Companion.STORAGE_PROVIDER_NAME

// Valtimo's upload fields render as nothing outside its UI, so they become Form.io `file` components.
object PublicTaskFormRewriter {
    // Handed to the storage provider untouched: how the page names the field a file was chosen in.
    const val COMPONENT_KEY_OPTION = "componentKey"

    /** A copy of [formDefinition] in which every upload component uploads to the public task endpoint. */
    fun rewriteUploadComponents(formDefinition: JsonNode): JsonNode =
        formDefinition.deepCopy<JsonNode>().also { copy ->
            PublicTaskUploadField.forEachUploadComponent(copy) { it.rewriteToPublicTaskUpload() }
        }

    private fun ObjectNode.rewriteToPublicTaskUpload() {
        val componentKey = path(PROPERTY_KEY).textValue()
        put(TYPE_KEY, "file")
        put("storage", STORAGE_PROVIDER_NAME)
        // Nothing is served back, so a link or preview would fetch a file that does not exist.
        put("uploadOnly", true)
        put("image", false)
        // Would otherwise let the definition point the browser at an upload target of its own choosing.
        remove("url")
        // Replaced, not extended: the definition must not be able to put anything of its own in the request.
        putObject("options").put(COMPONENT_KEY_OPTION, componentKey)
    }
}
