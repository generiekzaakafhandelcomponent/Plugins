package com.ritense.valtimoplugins.suwinetauth.plugin

import org.apache.cxf.message.Message
import org.apache.cxf.phase.AbstractPhaseInterceptor
import org.apache.cxf.phase.Phase

class HttpHeaderInterceptor(
    val headerName: String,
    val headerValue: String,
    val messagePhase: String = Phase.POST_LOGICAL) : AbstractPhaseInterceptor<Message>(messagePhase) {

    override fun handleMessage(message: Message?) {
        val messageHeaders = message?.get(Message.PROTOCOL_HEADERS) as Map<String, Any>
        messageHeaders
        var headers = messageHeaders.toMutableMap()
        headers.put(headerName, listOf(headerValue))
        message.put(Message.PROTOCOL_HEADERS, headers)
    }
}
