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

package com.ritense.valtimo.backend.plugin.dto

data class SmtpMailContextDto(
    val sender: Email,
    val recipients: List<Email>,
    val ccList: List<Email>,
    val bccList: List<Email>,
    val subject: String,
    val contentResourceId: String,
    val attachmentResourceIds: List<String>
)

@JvmInline
value class Email(val address: String) {
    init {
        require(address.matches(Regex("^[A-Za-z0-9+_.-]+@(.+)$"))) { "$address is not a valid email address" }
    }
}