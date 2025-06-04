/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.ritense.valtimoplugins.amsterdam.emailapi.plugin

import com.ritense.plugin.repository.PluginProcessLinkRepository
import com.ritense.plugin.service.PluginService
import com.ritense.processlink.domain.ActivityTypeWithEventName
import org.camunda.bpm.engine.delegate.DelegateTask
import org.springframework.context.event.EventListener

open class ProcessLinkSendTaskStartListener(
    private val pluginProcessLinkRepository: PluginProcessLinkRepository,
    private val pluginService: PluginService,
)  {

    @EventListener(
        condition = ("#delegateTask.bpmnModelElementInstance != null " +
                "&& #delegateTask.bpmnModelElementInstance.elementType.typeName == T(org.camunda.bpm.engine.ActivityTypes).TASK_SEND_TASK " +
                "&& #delegateTask.eventName == T(org.camunda.bpm.engine.delegate.TaskListener).EVENTNAME_START")
    )
    fun notify(delegateTask: DelegateTask) {
        val pluginProcessLinks = pluginProcessLinkRepository.findByProcessDefinitionIdAndActivityIdAndActivityType(
            delegateTask.processDefinitionId,
            delegateTask.taskDefinitionKey,
            ActivityTypeWithEventName.SEND_TASK_START
        )

        pluginProcessLinks.forEach { pluginProcessLink ->
            pluginService.invoke(delegateTask, pluginProcessLink)
        }
    }
}
