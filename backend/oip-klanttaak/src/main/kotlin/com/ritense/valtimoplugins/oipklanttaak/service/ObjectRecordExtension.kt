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

package com.ritense.valtimoplugins.oipklanttaak.service

import com.fasterxml.jackson.databind.JsonNode
import com.ritense.objectenapi.client.ObjectGeometry
import com.ritense.objectenapi.client.ObjectRecord
import java.time.LocalDate

internal fun ObjectRecord.copy(
    index: Int? = this.index,
    typeVersion: Int = this.typeVersion,
    data: JsonNode? = this.data,
    geometry: ObjectGeometry? = this.geometry,
    startAt: LocalDate = this.startAt,
    endAt: LocalDate? = this.endAt,
    registrationAt: LocalDate? = this.registrationAt,
    correctionFor: String? = this.correctionFor,
    correctedBy: String? = this.correctedBy
) = ObjectRecord(
    index = index,
    typeVersion = typeVersion,
    data = data,
    geometry = geometry,
    startAt = startAt,
    endAt = endAt,
    registrationAt = registrationAt,
    correctionFor = correctionFor,
    correctedBy = correctedBy
)