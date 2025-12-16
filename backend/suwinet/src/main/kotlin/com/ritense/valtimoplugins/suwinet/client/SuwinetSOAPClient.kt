package com.ritense.valtimoplugins.suwinet.client

import com.ritense.valtimoplugins.suwinetauth.plugin.SuwinetAuth
import io.github.oshai.kotlinlogging.KotlinLogging
import org.apache.cxf.ext.logging.LoggingFeature

import org.apache.cxf.frontend.ClientProxy
import org.apache.cxf.jaxws.JaxWsProxyFactoryBean
import org.apache.cxf.message.Message
import org.apache.cxf.transport.http.HTTPConduit
import org.apache.cxf.transports.http.configuration.ConnectionType
import org.apache.cxf.transports.http.configuration.HTTPClientPolicy

class SuwinetSOAPClient {

    inline fun <reified T : Any> getService(url: String, connectionTimeout: Int?, receiveTimeout: Int?, authConfig: SuwinetAuth): T {
        val clazz = T::class.java

        val soapService = with(JaxWsProxyFactoryBean()) {
            this.serviceClass = clazz
            address = url

            val loggingFeature: LoggingFeature = LoggingFeature()
            loggingFeature.setPrettyLogging(true)
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
                    "Authorization"
                )
            )
            this.features.add(loggingFeature)
            create() as T
        }

        setDefaultPolicies(soapService, authConfig, connectionTimeout, receiveTimeout)

        return soapService
    }

    fun setDefaultPolicies(service: Any, authConfig: SuwinetAuth, connectionTimeout: Int?, receiveTimeout: Int?) {

        val client = ClientProxy.getClient(service)
        val conduit: HTTPConduit = client.conduit as HTTPConduit
        client.requestContext[Message.PROTOCOL_HEADERS] =
            mapOf("Expect" to listOf("100-continue"))

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
