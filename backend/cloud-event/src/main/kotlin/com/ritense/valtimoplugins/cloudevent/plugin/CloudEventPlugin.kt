/*
 * Copyright 2026 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.cloudevent.plugin

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ContainerNode
import com.fasterxml.jackson.module.kotlin.convertValue
import com.ritense.outbox.OutboxService
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName.INTERMEDIATE_CATCH_EVENT_END
import com.ritense.processlink.domain.ActivityTypeWithEventName.INTERMEDIATE_THROW_EVENT_START
import com.ritense.processlink.domain.ActivityTypeWithEventName.MESSAGE_START_EVENT_START
import com.ritense.processlink.domain.ActivityTypeWithEventName.RECEIVE_TASK_END
import com.ritense.processlink.domain.ActivityTypeWithEventName.SEND_TASK_START
import com.ritense.valtimoplugins.cloudevent.domain.CloudEventPluginEvent
import io.github.oshai.kotlinlogging.KotlinLogging

@Plugin(
    key = "cloud-event",
    title = "Cloud Event Plugin",
    description = "Send and receive CloudEvents via RabbitMQ using the Valtimo outbox and inbox"
)
class CloudEventPlugin(
    private val outboxService: OutboxService,
    private val objectMapper: ObjectMapper,
) {

    @PluginAction(
        key = "publish-cloud-event",
        title = "Publish Cloud Event",
        description = "Publishes a CloudEvent via the outbox (RabbitMQ)",
        activityTypes = [SEND_TASK_START, INTERMEDIATE_THROW_EVENT_START]
    )
    fun publishCloudEvent(
        @PluginActionProperty eventType: String,
        @PluginActionProperty resultType: String?,
        @PluginActionProperty resultId: String?,
        @PluginActionProperty data: Any?,
    ) {
        logger.debug { "Publishing cloud event with type '$eventType'" }
        val jsonNode = data?.let { objectMapper.convertValue<JsonNode>(it) }
        val resultNode = jsonNode as? ContainerNode<*> ?: objectMapper.createObjectNode().set("data", jsonNode)
        outboxService.send {
            CloudEventPluginEvent(
                type = eventType,
                resultType = resultType,
                resultId = resultId,
                result = resultNode,
            )
        }
        logger.info { "Successfully published cloud event with type '$eventType'" }
    }

    @PluginAction(
        key = "receive-cloud-event",
        title = "Receive Cloud Event",
        description = "Receives a CloudEvent from the inbox (RabbitMQ)",
        activityTypes = [RECEIVE_TASK_END, INTERMEDIATE_CATCH_EVENT_END, MESSAGE_START_EVENT_START]
    )
    fun receiveCloudEvent(
        @PluginActionProperty eventType: String?,
    ) {
        logger.debug { "Receive cloud event action registered for type filter: $eventType" }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
