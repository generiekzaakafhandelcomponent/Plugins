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

package com.ritense.valtimoplugins.slack.service

import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.processlink.domain.ActivityTypeWithEventName.INTERMEDIATE_CATCH_EVENT_END
import com.ritense.processlink.domain.ActivityTypeWithEventName.INTERMEDIATE_CATCH_EVENT_START
import com.ritense.processlink.domain.ActivityTypeWithEventName.MESSAGE_START_EVENT_START
import com.ritense.processlink.domain.ActivityTypeWithEventName.RECEIVE_TASK_END
import com.ritense.processlink.domain.ActivityTypeWithEventName.RECEIVE_TASK_START
import com.ritense.processlink.domain.ActivityTypeWithEventName.START_EVENT_START

/**
 * What a receive-message link does with a message, decided by the activity it is linked to.
 *
 * Valtimo 12's process-link page links every element on its `:start` event, and a message
 * start event arrives there as a plain `bpmn:StartEvent:start`. Each target therefore also
 * accepts that variant next to the event type the plugin was designed for. The engine runs
 * plugin actions only on service tasks, call activities and user tasks, so none of these
 * links is ever executed: the poller is what acts on them.
 */
enum class ReceiveMessageTarget {
    /** A message start event: each message starts a new instance (and case). */
    START_PROCESS,

    /** A receive task: a message in the awaited thread signals the waiting execution. */
    RECEIVE_TASK,

    /** A message intermediate catch event: a message in the awaited thread is delivered to it. */
    MESSAGE_CATCH_EVENT,
    ;

    companion object {
        /** `null` when a receive-message link on this activity type cannot do anything. */
        fun of(activityType: ActivityTypeWithEventName?): ReceiveMessageTarget? =
            when (activityType) {
                MESSAGE_START_EVENT_START, START_EVENT_START -> START_PROCESS
                RECEIVE_TASK_START, RECEIVE_TASK_END -> RECEIVE_TASK
                INTERMEDIATE_CATCH_EVENT_START, INTERMEDIATE_CATCH_EVENT_END -> MESSAGE_CATCH_EVENT
                else -> null
            }
    }
}
