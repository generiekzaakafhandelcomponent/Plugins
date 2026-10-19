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

// Form.io's "File Pattern" on the server.
object FormIoFilePattern {
    fun matches(
        pattern: String,
        fileName: String,
        mimeType: String?,
    ): Boolean {
        val glob = globToRegex(pattern)
        val candidates = listOfNotNull(mimeType, fileName)
        val included = glob.regexp.isEmpty() || candidates.anyMatches(glob.regexp)
        return included && glob.excludes.none { candidates.anyMatches(it) }
    }

    // Compiled once per pattern rather than once per candidate.
    private fun List<String>.anyMatches(regexp: String): Boolean =
        Regex(regexp, RegexOption.IGNORE_CASE).let { regex -> any(regex::containsMatchIn) }

    private fun globToRegex(pattern: String): Glob {
        val glob = pattern.replace(WHITESPACE, "")
        if (glob.length > 2 && glob.startsWith('/') && glob.endsWith('/')) {
            return Glob(regexp = glob.substring(1, glob.length - 1))
        }

        val parts = glob.split(',')
        if (parts.size > 1) {
            val (included, excluded) = parts.map { globToRegex(it) }.partition { it.regexp.isNotEmpty() }
            return Glob(
                regexp = included.joinToString("|") { "(${it.regexp})" },
                excludes = excluded.flatMap { it.excludes },
            )
        }

        if (glob.startsWith('!')) {
            return Glob(regexp = "", excludes = listOf(globToRegex(glob.substring(1)).regexp))
        }

        // ".pdf" is shorthand for "*.pdf": an extension, not a whole name.
        val expanded = if (glob.startsWith('.')) "*$glob" else glob
        val quoted = expanded.replace(SPECIAL_CHARACTERS) { "\\" + it.value }
        return Glob(regexp = ("^" + quoted + "$").replace("""\*""", ".*").replace("""\?""", "."))
    }

    private data class Glob(
        val regexp: String,
        val excludes: List<String> = emptyList(),
    )

    private val WHITESPACE = Regex("""\s""")

    // What Form.io escapes before turning `*` and `?` into their regular expression equivalents.
    private val SPECIAL_CHARACTERS = Regex("""[.\\+*?\[^\]$(){}=!<>|:\-]""")
}
