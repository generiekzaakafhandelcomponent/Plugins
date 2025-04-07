package com.ritense.valtimoplugins.rotterdam.oracleebs.service

import com.ritense.valtimoplugins.mtlssslcontext.MTlsSslContext
import com.rotterdam.esb.opvoeren.apis.JournaalpostenApi
import com.rotterdam.esb.opvoeren.apis.VerkoopfacturenApi
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.web.client.RestClient

class EsbClient {

    fun createRestClient(
        baseUrl: String,
        authenticationEnabled: Boolean = false,
        mTlsSslContext: MTlsSslContext?
    ): RestClient {
        logger.debug { "Creating ESB client" }
        return when {
            authenticationEnabled -> {
                require(mTlsSslContext != null)
                HttpClientHelper.createSecureHttpClient(mTlsSslContext).also {
                    logger.debug { "Using secure HttpClient with Client Certificate authentication" }
                }
            }
            else ->
                HttpClientHelper.createDefaultHttpClient().also {
                    logger.debug { "Using default HttpClient" }
                }
        }.let { httpClient ->
            RestClient.builder()
                .baseUrl(baseUrl)
                .requestFactory(HttpComponentsClientHttpRequestFactory(httpClient))
                .build().also {
                    logger.debug { "Created ESB client using RestClient" }
                }
        }
    }

    fun journaalPostenApi(restClient: RestClient) = JournaalpostenApi(restClient)

    fun verkoopFacturenApi(restClient: RestClient) = VerkoopfacturenApi(restClient)

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
