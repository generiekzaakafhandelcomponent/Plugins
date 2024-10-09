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

package com.ritense.valtimo.backend.plugin.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimo.backend.plugin.domain.PublicTaskData
import com.ritense.valtimo.backend.plugin.service.PublicTaskService
import java.util.UUID
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "public-task",
    title = "Public Task Plugin",
    description = "Expose a public task outside the Valtimo UI with the Public Task plugin"
)
class PublicTaskPlugin(
    private val publicTaskService: PublicTaskService
) {

    @PluginAction(
        key = "create-public-task",
        title = "Create Public Task",
        description = "create a public task and expose it",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )

    fun createPublicTask(
        execution: DelegateExecution,
        @PluginActionProperty pvAssigneeCandidateContactData: String,
        @PluginActionProperty timeToLive: String?,
    ) {

        val publicTaskData = PublicTaskData.from(
            userTaskId = UUID.fromString(execution.getVariableLocal("userTaskId") as String),
            processBusinessKey = execution.processBusinessKey,
            assigneeCandidateContactData = pvAssigneeCandidateContactData,
            timeToLive = timeToLive
        )

        publicTaskService.createAndSendPublicTaskUrl(
            execution = execution,
            publicTaskData = publicTaskData
        )
    }
}