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

package com.ritense.valtimoplugins.notifynl.domain.email

import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable

data class SendEmailResponse (
    val content: EmailContent,
    val id: String,
    val reference: String?,
    @JsonProperty("scheduled_for")
    val scheduledFor: String?,
    val template: EmailTemplate,
    val uri: String
) : Serializable

data class EmailContent(
    val body: String,
    @JsonProperty("from_email")
    val fromEmailAddress: String,
    val subject: String
) : Serializable

data class EmailTemplate(
    val id: String,
    val uri: String,
    val version: Int
) : Serializable
