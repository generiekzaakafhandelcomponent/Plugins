package com.ritense.valtimoplugins.suwinet.client

import com.ritense.valtimoplugins.suwinetauth.plugin.SuwinetAuth
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.xml.ws.soap.AddressingFeature
import org.apache.cxf.ext.logging.LoggingFeature
import org.apache.cxf.frontend.ClientProxy
import org.apache.cxf.interceptor.LoggingInInterceptor
import org.apache.cxf.interceptor.LoggingOutInterceptor
import org.apache.cxf.jaxws.JaxWsProxyFactoryBean
import org.apache.cxf.message.Message
import org.apache.cxf.transport.http.HTTPConduit
import org.apache.cxf.transports.http.configuration.ConnectionType
import org.apache.cxf.transports.http.configuration.HTTPClientPolicy
import org.apache.cxf.ws.addressing.WSAddressingFeature


class SuwinetSOAPClient {

    inline fun <reified T : Any> getService(url: String, connectionTimeout: Int?, receiveTimeout: Int?, authConfig: SuwinetAuth): T {
        val clazz = T::class.java

        val soapService = with(JaxWsProxyFactoryBean()) {
            this.serviceClass = clazz
            address = url

            // address feature for including SOAPAction in tag
            val addressingFeature = WSAddressingFeature().apply {
                isAddressingRequired = false
            }

            val loggingFeature: LoggingFeature = LoggingFeature()
            loggingFeature.setPrettyLogging(true)
            loggingFeature.setVerbose(true);
            loggingFeature.setLogMultipart(true);
            loggingFeature.addSensitiveElementNames(
                setOf<String>(
                    "Burgerservicenr",
                    "Voornamen",
                    "SignificantDeelVanDeAchternaam",
                    "ANr",
                    "Geboortedat",
                    "Postcd",
                    "Straatnaam",
                    "Huisnr",
                    "Woonplaatsnaam"
                )
            )
            loggingFeature.addSensitiveProtocolHeaderNames(
                setOf<String>(
                    "Authorization",
                    "x-opentunnel-api-key"
                )
            )
            this.features.add(addressingFeature)
            this.features.add(loggingFeature)

            create() as T
        }

        setDefaultPolicies(soapService, authConfig, connectionTimeout, receiveTimeout)

        return soapService
    }

    fun setDefaultPolicies(service: Any, authConfig: SuwinetAuth, connectionTimeout: Int?, receiveTimeout: Int?) {
        val client = ClientProxy.getClient(service)
        with(client.requestContext) {
            // Disable strict action checking
            this["ws-addressing.strict.action.checking"] = false

            // Disable validation
            this["ws-addressing.validation.enabled"] = false

            // Use default action
            this["ws-addressing.using.default.action"] = true

            // Disable message ID requirement
            this["ws-addressing.messageId.required"] = false

            // Disable checks
            this["ws-addressing.disable.addressing.checks"] = true

            // Allow anonymous RelatesTo
            this["allow.anonymous"] = true

            // Suwinet service does not properly implement WS-Addressing and requires relaxed validation.
            // All checks disabled to prevent request failures.
            this["org.apache.cxf.ws.addressing.MAPAggregator.addressingDisabled"] = true
        }

        if(logger.isDebugEnabled()) {
            // deprecated loggers do log RAW messages
            client.inInterceptors.add(LoggingInInterceptor())
            client.outInterceptors.add(LoggingOutInterceptor())

            client.inFaultInterceptors.add(LoggingInInterceptor())
            client.outFaultInterceptors.add(LoggingOutInterceptor())
        }

        val conduit: HTTPConduit = client.conduit as HTTPConduit
        client.requestContext[Message.PROTOCOL_HEADERS] =
            mapOf("Expect" to listOf("100-continue"))

        client.outInterceptors.add(StripSoapActionQuotesInterceptor())

        val httpPolicy = HTTPClientPolicy()
        httpPolicy.connectionTimeout = (connectionTimeout ?: 10) * 1000L
        httpPolicy.isAllowChunking = true
        httpPolicy.receiveTimeout = (receiveTimeout ?: 10) * 1000L
        httpPolicy.connection = ConnectionType.KEEP_ALIVE
        conduit.client = httpPolicy

        authConfig.applyAuth(client)
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
