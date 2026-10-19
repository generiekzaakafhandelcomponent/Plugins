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

import com.ritense.plugin.annotation.PluginAction
import com.ritense.processlink.domain.ActivityTypeWithEventName
import com.ritense.valtimoplugins.slack.plugin.SlackPlugin
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class ReceiveMessageTargetTest {
    @Test
    fun `every activity type the receive-message action accepts has a target`() {
        val accepted =
            SlackPlugin::class.java.methods
                .single { it.name == "receiveMessage" }
                .getAnnotation(PluginAction::class.java)
                .activityTypes

        assertThat(accepted).allSatisfy { assertThat(ReceiveMessageTarget.of(it)).isNotNull() }
    }

    @Test
    fun `the start variants the Valtimo 12 admin page links on map like the events they stand for`() {
        assertThat(ReceiveMessageTarget.of(ActivityTypeWithEventName.START_EVENT_START))
            .isEqualTo(ReceiveMessageTarget.START_PROCESS)
        assertThat(ReceiveMessageTarget.of(ActivityTypeWithEventName.RECEIVE_TASK_START))
            .isEqualTo(ReceiveMessageTarget.RECEIVE_TASK)
        assertThat(ReceiveMessageTarget.of(ActivityTypeWithEventName.INTERMEDIATE_CATCH_EVENT_START))
            .isEqualTo(ReceiveMessageTarget.MESSAGE_CATCH_EVENT)
    }

    @Test
    fun `an activity that cannot receive a message has no target`() {
        assertThat(ReceiveMessageTarget.of(ActivityTypeWithEventName.SERVICE_TASK_START)).isNull()
        assertThat(ReceiveMessageTarget.of(null)).isNull()
    }
}
