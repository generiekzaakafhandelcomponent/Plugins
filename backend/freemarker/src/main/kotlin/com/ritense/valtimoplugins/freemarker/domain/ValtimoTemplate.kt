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

package com.ritense.valtimoplugins.freemarker.domain

import com.ritense.valtimo.contract.buildingblock.BuildingBlockDefinitionId
import com.ritense.valtimo.contract.case_.CaseDefinitionId
import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import jakarta.persistence.Embedded
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID
import org.hibernate.annotations.Type

@Entity
@Table(name = "valtimo_template")
class ValtimoTemplate(

    @Id
    @Column(name = "id")
    val id: UUID = UUID.randomUUID(),

    @Column(name = "template_key")
    val key: String,

    @Embedded
    val caseDefinitionId: CaseDefinitionId? = null,

    @Embedded
    val buildingBlockDefinitionId: BuildingBlockDefinitionId? = null,

    @Column(name = "template_type")
    val type: String,

    @Type(value = JsonType::class)
    @Column(name = "metadata")
    val metadata: Map<String, Any?> = emptyMap(),

    @Column(name = "content")
    val content: String = ""
) {

    override fun toString(): String {
        return if (caseDefinitionId != null) {
            "$caseDefinitionId/$type/$key"
        } else {
            "$buildingBlockDefinitionId/$type/$key"
        }
    }
}
