/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.valtimo.backend.plugin.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.UUID

@Entity
@Table(name = "public_task_plugin_entity")
data class PublicTaskEntity(

    @Id
    @field:Column(name = "public_task_id")
    val publicTaskId: UUID = UUID.randomUUID(),

    @field:Column(name = "user_task_id")
    val userTaskId: UUID = UUID.randomUUID(),

    @field:Column(name = "process_business_key")
    val processBusinessKey: String = "",

    @field:Column(name = "assignee_candidate_contact_data")
    val assigneeCandidateContactData: String = "",

    @field:Column(name = "task_expiration_date")
    val taskExpirationDate: String = "",

    @field:Column(name = "is_completed_by_public_task")
    val isCompletedByPublicTask: Boolean = false,
)
