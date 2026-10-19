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

package com.ritense.valtimoplugins.smtpmail.validation

// Ported from the graph-mail plugin so that both mail plugins reject the same input, widened so
// that a host without a dot is accepted as well.

// A single hostname label: starts and ends alphanumeric, may contain hyphens in between and is
// at most 63 characters long.
private const val HOST_LABEL = "[a-zA-Z0-9](?:[a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9])?"

// The host is either a dotted domain closed off by an alphabetic top level label
// (example.com, localhost.localdomain) or a single label without any dot. That second form
// covers local mail catchers and internal hosts such as localhost and mailhog, which SMTP
// accepts and which this plugin delivered to before address validation was introduced.
private const val HOST = "(?:(?:$HOST_LABEL\\.)+[a-zA-Z]{2,63}|$HOST_LABEL)"

internal val EMAIL_REGEX = Regex("^[a-zA-Z0-9._%+\\-]+@$HOST$")

private const val MAX_EMAIL_LENGTH = 254

internal fun isValidEmail(value: String) =
    value.length <= MAX_EMAIL_LENGTH && !value.contains("..") && EMAIL_REGEX.matches(value)

// Header injection guard: any CR or LF inside a header-bearing field is rejected.
// Defence in depth — MimeMessageHelper parses addresses strictly, but setSubject passes an
// all-ASCII subject through unchanged and InternetHeaders does not strip CR/LF.
internal fun containsControlChars(value: String?): Boolean = value != null && value.any { it == '\r' || it == '\n' }

internal fun requireNoControlChars(
    value: String?,
    fieldName: String,
) {
    require(!containsControlChars(value)) {
        "Field '$fieldName' must not contain CR or LF characters"
    }
}

internal fun requireValidEmail(
    address: String,
    fieldName: String,
) {
    requireNoControlChars(address, fieldName)
    require(isValidEmail(address)) { "Invalid email address in '$fieldName': '$address'" }
}
