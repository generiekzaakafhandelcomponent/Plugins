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

import java.time.LocalDate
import java.util.UUID

data class PublicTaskData(
    val publicTaskId: UUID,
    val userTaskId: UUID,
    val processBusinessKey: String,
    val assigneeCandidateContactData: String,
    val taskExpirationDate: String,
    var isCompletedByPublicTask: Boolean
) {

    companion object {
        fun from(
            userTaskId: UUID,
            processBusinessKey: String,
            assigneeCandidateContactData: String,
            timeToLive: String?,
        ): PublicTaskData = PublicTaskData(
            publicTaskId = UUID.randomUUID(),
            userTaskId = userTaskId,
            processBusinessKey = processBusinessKey,
            assigneeCandidateContactData = assigneeCandidateContactData,
            taskExpirationDate = LocalDate.now().plusDays(timeToLive?.toLong() ?: 28L).toString(),
            isCompletedByPublicTask = false
        )
    }
}