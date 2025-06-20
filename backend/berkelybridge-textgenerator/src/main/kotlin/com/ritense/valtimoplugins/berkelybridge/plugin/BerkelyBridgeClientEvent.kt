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

package com.ritense.valtimoplugins.berkelybridge.plugin

import com.ritense.valtimo.contract.audit.AuditEvent
import java.time.LocalDateTime
import java.util.*

class BerkelyBridgeClientEvent(val eventMessage: String): AuditEvent {

    var processUser: String = "system"

    override fun getId(): UUID {
        return UUID.randomUUID();
    }

    override fun getOrigin(): String {
        return "unidentified"
    }

    override fun getOccurredOn(): LocalDateTime {
        return LocalDateTime.now()
    }

    override fun getUser(): String {
        return processUser
    }

    fun getMessage(): String {
        return eventMessage
    }
}
