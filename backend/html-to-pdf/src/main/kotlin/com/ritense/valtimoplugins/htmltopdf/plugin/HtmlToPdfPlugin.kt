/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.htmltopdf.plugin

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.ritense.plugin.annotation.Plugin
import com.ritense.valtimoplugins.htmltopdf.plugin.HtmlToPdfPlugin.Companion.PLUGIN_KEY
import com.ritense.valueresolver.ValueResolverService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = PLUGIN_KEY,
    title = "HTML to PDF Plugin",
    description = "handle html to pdf requests",
)
@Suppress("UNUSED")
class HtmlToPdfPlugin(
    private val valueResolverService: ValueResolverService
) {
    private fun isResolvableValue(value: String): Boolean =
        value.isNotBlank() && (
            value.startsWith("case:") ||
                value.startsWith("doc:") ||
                value.startsWith("template:") ||
                value.startsWith("pv:")
        )

    private fun resolveValuesFor(
        execution: DelegateExecution,
        params: Map<String, Any?>,
    ): Map<String, Any?> {
        val resolvedValues =
            params.filter {
                if (it.value is String) {
                    isResolvableValue(it.value as String)
                } else {
                    false
                }
            }
                .let { filteredParams ->
                    logger.debug { "Trying to resolve values for: $filteredParams" }
                    valueResolverService.resolveValues(
                        execution.processInstanceId,
                        execution,
                        filteredParams.map { it.value as String },
                    ).let { resolvedValues ->
                        logger.debug { "Resolved values: $resolvedValues" }
                        filteredParams.toMutableMap().apply {
                            this.entries.forEach { (key, value) ->
                                this.put(key, resolvedValues[value])
                            }
                        }
                    }
                }
        return params.toMutableMap().apply {
            this.putAll(resolvedValues)
        }.toMap()
    }

    companion object {
        private val logger = KotlinLogging.logger { }
        private val objectMapper = jacksonObjectMapper().findAndRegisterModules()
        const val PLUGIN_KEY = "html-to-pdf"
    }
}
