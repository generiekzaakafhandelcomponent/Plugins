/*
 * Copyright 2015-2023 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.model

data class TemplateDeploymentMetadata(
    val templateKey: String,
    val caseDefinitionName: String? = null,
    val templateType: String,
    val metadata: Map<String, Any?>? = null,
    val content: String? = null,
    val contentRef: String? = null,
) {
    /**
     * The inline [content], or else the classpath resource [contentRef] points to. Only template files can be
     * referenced, so an imported definition can't read other resources, such as the application configuration.
     */
    fun readContent(): String {
        if (content != null) {
            return content
        }
        val ref = requireNotNull(contentRef) { "Missing template content" }
        require(CONTENT_REF_EXTENSIONS.any { ref.endsWith(it, ignoreCase = true) }) {
            "contentRef '$ref' must end with one of $CONTENT_REF_EXTENSIONS"
        }
        val resource = requireNotNull(javaClass.getResource(ref)) { "contentRef '$ref' not found" }
        return resource.readText()
    }

    companion object {
        private val CONTENT_REF_EXTENSIONS =
            listOf(".ftl", ".ftlh", ".ftlx", ".html", ".htm", ".xhtml", ".txt", ".csv", ".tsv")
    }
}