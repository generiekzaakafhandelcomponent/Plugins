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

/**
 * The address a public task link starts with. Written by hand in the plugin configuration, so it is read
 * forgivingly, and refused where it would produce a link that is not an ordinary web address.
 */
object PublicTaskBaseUrl {
    /** The usable form of [value], or `null` when nothing was entered. [defaultScheme] fills in a missing one. */
    fun of(
        value: String?,
        defaultScheme: String = "https",
    ): String? {
        val entered = value?.trim().orEmpty()
        if (entered.isBlank()) {
            return null
        }
        // Written as 'my-app.example.com' as often as with its scheme; both are meant the same way.
        val withScheme = if (namesScheme(entered)) entered else "$defaultScheme://$entered"
        // A public task URL ends up in a browser and in whatever sends it out, so nothing else is a URL here.
        require(HTTP_SCHEME.containsMatchIn(withScheme)) {
            "A public task URL has to start with http:// or https://"
        }
        return withScheme.trimEnd('/')
    }

    private fun namesScheme(entered: String): Boolean =
        SCHEME.containsMatchIn(entered) && !HOST_AND_PORT.containsMatchIn(entered)

    private val HTTP_SCHEME = Regex("^https?://[^/]", RegexOption.IGNORE_CASE)

    private val SCHEME = Regex("^[a-zA-Z][a-zA-Z0-9+.-]*:")

    private val HOST_AND_PORT = Regex("^[^/:]+:\\d+(?:[/?#]|$)")
}
