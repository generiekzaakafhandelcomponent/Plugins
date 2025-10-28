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

package com.ritense.valtimoplugins.notifynl.domain.letter

import com.fasterxml.jackson.annotation.JsonProperty

data class LetterRequest(
    @JsonProperty("template_id")
    val templateId: String,
    val personalisation: Personalisation
)

data class Personalisation(
    @JsonProperty("address_line_1")
    val addressLine1: String?,
    @JsonProperty("address_line_2")
    val addressLine2: String?,
    @JsonProperty("address_line_3")
    val addressLine3: String?,
    @JsonProperty("address_line_4")
    val addressLine4: String?,
    @JsonProperty("address_line_5")
    val addressLine5: String?,
    @JsonProperty("address_line_6")
    val addressLine6: String?,
    @JsonProperty("address_line_7")
    val addressLine7: String?
)
