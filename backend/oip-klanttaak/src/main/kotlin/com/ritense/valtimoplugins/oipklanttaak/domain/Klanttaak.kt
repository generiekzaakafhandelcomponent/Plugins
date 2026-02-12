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

package com.ritense.valtimoplugins.oipklanttaak.domain

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty
import java.time.OffsetDateTime
import java.time.Period
import java.util.UUID

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Klanttaak(
    val soort: Soort = Soort.EXTERNFORMULIER,
    val titel: String,
    val status: Status,
    val eigenaar: String,
    val koppeling: Koppeling? = null,
    val betrokkene: Betrokkene,
    val toelichting: String? = null,
    val doorlooptijd: Period? = null,
    val verloopdatum: OffsetDateTime? = null,
    val portaalformulier: Portaalformulier,
    @JsonProperty("verwerker_taak_id") val verwerkerTaakId: UUID,
    @JsonProperty("deadline_verlengbaar") val deadlineVerlengbaar: Boolean? = null,
)
