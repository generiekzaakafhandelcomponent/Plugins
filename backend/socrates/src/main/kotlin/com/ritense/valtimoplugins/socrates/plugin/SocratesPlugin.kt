/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.socrates.plugin

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginEvent
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.plugin.domain.EventType
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.socrates.client.SocratesClient
import com.ritense.valtimoplugins.socrates.error.SocratesError
import com.ritense.valtimoplugins.socrates.model.LoBehandeld

import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.BpmnError
import java.net.URI
import org.camunda.bpm.engine.delegate.DelegateExecution

@Plugin(
    key = "socrates",
    title = "Socrates Plugin",
    description = "Add service to Socrates"
)
open class SocratesPlugin(
    private val socratesClient: SocratesClient,
    private val mapper: ObjectMapper,
) {

    @PluginProperty(key = "socratesApiUrl", secret = false)
    lateinit var socratesApiUrl: URI

    @PluginEvent(invokedOn = [EventType.CREATE, EventType.UPDATE])
    fun setsocratesClientParams() {
        logger.debug { "set socrates client params" }
        socratesClient.socratesBaseUri = socratesApiUrl
    }

    @PluginAction(
        key = "dienst-aanmaken",
        title = "Dienst aanmaken in Socrates",
        description = "Dienst aanmaken service in Socrates",
        activityTypes = [ActivityTypeWithEventName.SERVICE_TASK_START]
    )
    open fun dienstAanmaken(
        execution: DelegateExecution,
        @PluginActionProperty zaakId: String,
        @PluginActionProperty inputProcessVariable: String,
        @PluginActionProperty processVariableName: String
    ) {
        setsocratesClientParams()
        logger.debug { "dienst-aanmaken start" }

        try {
            var requestString = execution.getVariable(inputProcessVariable) as String
            var request = mapper.readValue<LoBehandeld>(requestString)

            var respons  = socratesClient.dienstAanmaken(zaakId, request)

            execution.setVariable(processVariableName, respons)
        } catch (e: Exception) {
            if(e is SocratesError) {
                throw BpmnError(e.errorCode)
            }
            else {
                throw e
            }
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
