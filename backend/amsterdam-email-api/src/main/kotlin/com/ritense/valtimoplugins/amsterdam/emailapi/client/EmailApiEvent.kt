package com.ritense.valtimoplugins.amsterdam.emailapi.client

import com.ritense.valtimo.contract.audit.AuditEvent
import java.time.LocalDateTime
import java.util.*

class EmailApiEvent(val eventMessage: String): AuditEvent {

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
