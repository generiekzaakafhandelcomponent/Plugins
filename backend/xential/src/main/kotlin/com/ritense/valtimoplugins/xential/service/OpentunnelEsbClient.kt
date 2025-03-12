package com.ritense.valtimoplugins.xential.service

import com.rotterdam.esb.xential.api.DefaultApi
import io.github.oshai.kotlinlogging.KotlinLogging
import okhttp3.Credentials
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.web.client.RestClient
import javax.net.ssl.SSLContext

class OpentunnelEsbClient {

    fun createRestClient(
        baseUrl: String,
        applicationName: String,
        applicationPassword: String,
        sslContext: SSLContext?
    ): RestClient {
        logger.debug { "Creating ESB client" }
        val credentials = Credentials.basic(applicationName, applicationPassword)

        return when {
            sslContext != null -> {
                HttpClientHelper.createSecureHttpClient(
                    sslContext
                ).also {
                    logger.debug { "Using secure HttpClient with Client Certificate authentication" }
                }
            }
            else ->
                HttpClientHelper.createDefaultHttpClient().also {
                    logger.debug { "Using default HttpClient" }
                }

        }.let { httpClient ->
            RestClient.builder()
                .defaultHeader("Authorization", credentials)
                .baseUrl(baseUrl)
                .requestFactory(HttpComponentsClientHttpRequestFactory(httpClient))
                .build().also {
                    logger.debug { "Created ESB client using RestClient" }
                }
        }
    }

    fun documentApi(restClient: RestClient) = DefaultApi(restClient)

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
