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

import com.ritense.valtimo.contract.audit.AuditEvent
import com.ritense.valtimo.contract.audit.AuditMetaData
import com.ritense.valtimo.contract.audit.ProcessIdentity
import com.ritense.valtimo.contract.audit.TaskIdentity
import com.ritense.valtimo.contract.audit.TaskMetaData
import com.ritense.valtimo.contract.audit.VariableScope
import java.time.LocalDateTime
import java.util.UUID

data class PublicTaskCompletedEvent(
    private val id: UUID,
    private val origin: String,
    private val occurredOn: LocalDateTime,
    private val user: String,
    private val assignee: String?,
    private val createdOn: LocalDateTime,
    private val taskId: String,
    private val taskName: String,
    private val processDefinitionId: String,
    private val processInstanceId: String,
    private val variables: Map<String, Any>,
    private val businessKey: String?
) : AuditMetaData(id, origin, occurredOn, user), AuditEvent, TaskIdentity, TaskMetaData, ProcessIdentity,
    VariableScope {

    init {
        businessKey?.let {
            require(it.isNotEmpty()) { "businessKey cannot be empty" }
        }
    }

    override fun getProcessDefinitionId() = processDefinitionId
    override fun getProcessInstanceId() = processInstanceId
    override fun createdOn(): LocalDateTime = createdOn
    override fun getAssignee() = assignee
    override fun getTaskId(): String = taskId
    override fun getTaskName() = taskName
    override fun getVariables() = variables
    override fun getBusinessKey() = businessKey
    override fun getDocumentId(): UUID? = try {
        UUID.fromString(businessKey)
    } catch (e: IllegalArgumentException) {
        null
    }
}
