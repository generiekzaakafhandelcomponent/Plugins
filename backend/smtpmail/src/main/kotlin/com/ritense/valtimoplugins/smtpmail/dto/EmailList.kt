/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.smtpmail.dto

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue
import com.fasterxml.jackson.databind.JsonNode
import com.ritense.valtimoplugins.smtpmail.validation.requireNoControlChars
import com.ritense.valtimoplugins.smtpmail.validation.requireValidEmail

/** The addresses of one address field, accepting both shapes Valtimo can bind: a single value or a list. */
data class EmailList(
    @get:JsonValue val addresses: List<Email>,
) {
    /** Splits every value on its separators, drops the empty remainders and validates what is left. */
    fun normalized(fieldName: String): List<Email> =
        addresses
            .flatMap { email ->
                // Checked on the raw value so the header injection guard cannot end up behind the split.
                requireNoControlChars(email.address, fieldName)
                email.address.split(ADDRESS_SEPARATOR)
            }.map { it.trim() }
            .filter { it.isNotEmpty() }
            .map { Email(it) }
            .onEach { requireValidEmail(it.address, fieldName) }

    companion object {
        // A semicolon is not an RFC 5322 separator but is what Outlook users type; neither can occur in a valid address.
        private val ADDRESS_SEPARATOR = Regex("[,;]")

        @JvmStatic
        @JsonCreator(mode = JsonCreator.Mode.DELEGATING)
        fun of(node: JsonNode): EmailList =
            when {
                node.isNull -> EmailList(emptyList())
                node.isTextual -> EmailList(listOf(Email(node.textValue())))
                node.isArray -> EmailList(node.map { Email(it.textValueOrFail()) })
                else -> throw IllegalArgumentException(
                    "Expected an email address or a list of email addresses, but got: $node",
                )
            }

        private fun JsonNode.textValueOrFail(): String {
            require(isTextual) { "Expected an email address, but got: $this" }
            return textValue()
        }
    }
}
