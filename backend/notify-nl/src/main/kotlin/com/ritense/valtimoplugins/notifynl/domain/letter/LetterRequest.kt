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
    val address_line_1: String?,
    val address_line_2: String?,
    val address_line_3: String?,
    val address_line_4: String?,
    val address_line_5: String?,
    val address_line_6: String?,
    val address_line_7: String?
)
