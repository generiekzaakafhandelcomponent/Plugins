package com.ritense.valtimoplugins.suwinet.service

import com.ritense.valtimoplugins.dkd.Bijstandsregelingen.BijstandsregelingenInfoResponse
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.DUOInfo
import com.ritense.valtimoplugins.dkd.duodossierpersoongsd.ObjectFactory
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClient
import com.ritense.valtimoplugins.suwinet.client.SuwinetSOAPClientConfig
import io.github.oshai.kotlinlogging.KotlinLogging
import java.time.format.DateTimeFormatter

class SuwinetBijstandsregelingenService (
    private val suwinetSOAPClient: SuwinetSOAPClient,
) {
    lateinit var soapClientConfig: SuwinetSOAPClientConfig

    fun setConfig(soapClientConfig: SuwinetSOAPClientConfig) {
        this.soapClientConfig = soapClientConfig
    }

//    fun createBijstandsregelingenService(): BijstandsregelingenInfoResponse {
//        val completeUrl = this.soapClientConfig.baseUrl + SERVICE_PATH
//        return suwinetSOAPClient.configureKeystore(
//            soapClientConfig.keystoreCertificatePath,
//            soapClientConfig.keystoreKey
//        )
//            .configureTruststore(soapClientConfig.truststoreCertificatePath, soapClientConfig.truststoreKey)
//            .configureBasicAuth(soapClientConfig.basicAuthName, soapClientConfig.basicAuthSecret)
//            .getService<DUOInfo>(
//                completeUrl,
//                soapClientConfig.connectionTimeout, soapClientConfig.receiveTimeout
//            )
//    }

    companion object {
        private const val SERVICE_PATH = "Bijstandsregelingen-v0500"
        private val logger = KotlinLogging.logger {}
    }
}
