/*
 * Copyright 2015-2023 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.freemarker.web.rest.dto

import com.ritense.valtimo.contract.buildingblock.BuildingBlockDefinitionId
import com.ritense.valtimo.contract.case_.CaseDefinitionId

data class UpdateTemplateRequest(
    val key: String,
    val caseDefinitionKey: String? = null,
    val caseDefinitionVersionTag: String? = null,
    val buildingBlockDefinitionKey: String? = null,
    val buildingBlockDefinitionVersionTag: String? = null,
    val type: String,
    val metadata: Map<String, Any?> = emptyMap(),
    val content: String,
) {
    fun caseDefinitionId() = caseDefinitionKey?.let { CaseDefinitionId(caseDefinitionKey, caseDefinitionVersionTag!!) }

    fun buildingBlockDefinitionId() = buildingBlockDefinitionKey?.let {
        BuildingBlockDefinitionId(buildingBlockDefinitionKey, buildingBlockDefinitionVersionTag!!)
    }
}

