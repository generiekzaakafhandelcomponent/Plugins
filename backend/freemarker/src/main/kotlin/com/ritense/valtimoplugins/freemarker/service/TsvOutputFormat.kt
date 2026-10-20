/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.service

import freemarker.core.CommonMarkupOutputFormat
import freemarker.core.CommonTemplateMarkupOutputModel
import java.io.Writer

/**
 * Escapes the values a CSV template inserts, so a tab, line break or quote in a value stays part of its field when the
 * output is read back as tab-delimited with a backslash escape character. Whitespace at the start and end of a field
 * is still trimmed, as before.
 */
class TsvOutputFormat private constructor() : CommonMarkupOutputFormat<TemplateTsvOutputModel>() {
    override fun getName() = "TSV"

    override fun getMimeType() = "text/tab-separated-values"

    override fun output(
        textToEsc: String,
        out: Writer,
    ) = out.write(escapePlainText(textToEsc))

    override fun escapePlainText(plainTextContent: String): String =
        buildString {
            plainTextContent.forEach { char ->
                when (char) {
                    '\\' -> append("\\\\")
                    '\t' -> append("\\t")
                    '\n' -> append("\\n")
                    '\r' -> append("\\r")
                    '"' -> append("\\\"")
                    else -> append(char)
                }
            }
        }

    override fun isLegacyBuiltInBypassed(builtInName: String) = false

    override fun newTemplateMarkupOutputModel(
        plainTextContent: String?,
        markupContent: String?,
    ) = TemplateTsvOutputModel(plainTextContent, markupContent)

    companion object {
        @JvmField
        val INSTANCE = TsvOutputFormat()
    }
}

class TemplateTsvOutputModel internal constructor(
    plainTextContent: String?,
    markupContent: String?,
) : CommonTemplateMarkupOutputModel<TemplateTsvOutputModel>(plainTextContent, markupContent) {
    override fun getOutputFormat() = TsvOutputFormat.INSTANCE
}
