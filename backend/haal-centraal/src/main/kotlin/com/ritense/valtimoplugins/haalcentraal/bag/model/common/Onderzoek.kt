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

package com.ritense.valtimoplugins.haalcentraal.bag.model.common

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class Onderzoek(
    val kenmerk: String,
    val identificatieVanOpenbareRuimte: String?,
    val identificatieVanNummeraanduiding: String?,
    val identificatieVanWoonplaats: String?,
    val identificatieVanPand: String?,
    val identificatieVanLigplaats: String?,
    val identificatieVanStandplaats: String?,
    val identificatieVanVerblijfsobject: String?,
    val inOnderzoek: String,
    val historie: Historie?,
    val documentdatum: String,
    val documentnummer: String
)
