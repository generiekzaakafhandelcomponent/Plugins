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
 *
 */

package com.ritense.valtimoplugins.haalcentraal.bag.model

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.annotation.JsonProperty

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AddressDto(
    val openbareRuimteNaam: String?,
    val korteNaam: String?,
    val huisnummer: Int,
    val huisletter: String?,
    val huisnummertoevoeging: String?,
    val postcode: String,
    val woonplaatsNaam: String?,
    val nummeraanduidingIdentificatie: String?,
    val openbareRuimteIdentificatie: String?,
    val woonplaatsIdentificatie: String?,
    val adresseerbaarObjectIdentificatie: String?,
    val pandIdentificaties: List<String>?,
    val indicatieNevenadres: Boolean?,
    val adresregel5: String?,
    val adresregel6: String?,
    val geconstateerd: Geconstateerd?,
    val inonderzoek: InOnderzoek?,
    @JsonProperty("_links") val links: Links?,
    @JsonProperty("_embedded") val embeddedObject: EmbeddedObject?
)
