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

package com.ritense.valtimo.backend.plugin.htmlrenderer.service

import com.ritense.valtimo.backend.plugin.htmlrenderer.config.FreemarkerConfig
import freemarker.template.Template
import java.io.StringWriter

class HtmlRenderService(
    private val freemarkerConfig: FreemarkerConfig
) {

    fun generatePublicTaskHtml(
        fileName: String,
        variables: Map<String, Any> = emptyMap()
    ): String =
        with(StringWriter()) {
            Template(
                fileName,
                getResourceFileAsString("$PUBLIC_TASK_TEMPLATE_PATH/$fileName.ftl"),
                freemarkerConfig
            ).process(variables, this)
            return this.toString()
        }

    private fun getResourceFileAsString(filePath: String): String? =
        javaClass.classLoader.getResourceAsStream(filePath)?.bufferedReader().use { it?.readText() }

    companion object {
        private const val PUBLIC_TASK_TEMPLATE_PATH = "config/template"
    }
}