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

package com.ritense.valtimo.backend.plugin.audit

import com.ritense.valtimo.backend.plugin.repository.PublicTaskRepository
import com.ritense.valtimo.camunda.TaskCompletedListener
import com.ritense.valtimo.contract.audit.utils.AuditHelper
import com.ritense.valtimo.contract.event.TaskCompletedEvent
import com.ritense.valtimo.contract.utils.RequestHelper
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.UUID
import org.camunda.bpm.engine.delegate.DelegateTask
import org.springframework.context.ApplicationEventPublisher

class PublicTaskCompletedListener(
    private val applicationEventPublisher: ApplicationEventPublisher,
    private val publicTaskRepository: PublicTaskRepository
) : TaskCompletedListener(applicationEventPublisher) {

    override fun notify(delegateTask: DelegateTask) {
        with(publicTaskRepository.findAll()) {
            if (this.any { it.isCompletedByPublicTask && it.userTaskId.toString() == delegateTask.id }) {
                val assignee = this.first { it.userTaskId.toString() == delegateTask.id }.assigneeCandidateContactData
                applicationEventPublisher.publishEvent(
                    PublicTaskCompletedEvent(
                        id = UUID.randomUUID(),
                        origin = RequestHelper.getOrigin(),
                        occurredOn = LocalDateTime.now(),
                        user = assignee,
                        assignee = delegateTask.assignee,
                        createdOn = LocalDateTime.ofInstant(
                            delegateTask.createTime.toInstant(),
                            ZoneId.systemDefault()
                        ),
                        taskId = delegateTask.id,
                        taskName = delegateTask.name,
                        processDefinitionId = delegateTask.processDefinitionId,
                        processInstanceId = delegateTask.processInstanceId,
                        variables = delegateTask.variablesTyped,
                        businessKey = delegateTask.execution.processBusinessKey
                    )
                )
            } else {
                applicationEventPublisher.publishEvent(
                    TaskCompletedEvent(
                        UUID.randomUUID(),
                        RequestHelper.getOrigin(),
                        LocalDateTime.now(),
                        AuditHelper.getActor(),
                        delegateTask.assignee,
                        LocalDateTime.ofInstant(delegateTask.createTime.toInstant(), ZoneId.systemDefault()),
                        delegateTask.id,
                        delegateTask.name,
                        delegateTask.processDefinitionId,
                        delegateTask.processInstanceId,
                        delegateTask.variablesTyped,
                        delegateTask.execution.processBusinessKey
                    )
                )
            }
        }
    }
}
