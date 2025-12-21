package com.ritense.valtimoplugins.suwinet.client

import org.apache.cxf.binding.soap.SoapMessage
import org.apache.cxf.phase.Phase
import org.apache.cxf.message.Message
import org.apache.cxf.phase.AbstractPhaseInterceptor

class StripSoapActionQuotesInterceptor : AbstractPhaseInterceptor<SoapMessage>(Phase.PRE_PROTOCOL) {
    override fun handleMessage(message: SoapMessage) {
        @Suppress("UNCHECKED_CAST")
        val headers = message[Message.PROTOCOL_HEADERS] as? MutableMap<String, MutableList<String>> ?: return
        val headerValue = headers["SOAPAction"]?.firstOrNull() ?: return
        headers["SOAPAction"] = mutableListOf(headerValue.trim().trim('"'))
    }
}
