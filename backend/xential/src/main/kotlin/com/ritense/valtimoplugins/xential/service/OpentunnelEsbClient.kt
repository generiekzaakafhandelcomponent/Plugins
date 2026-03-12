/*
 * Copyright 2015-2026 Ritense BV, the Netherlands.
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
        sslContext: SSLContext?,
    ): RestClient {
        logger.debug { "Creating ESB client" }
        val credentials = Credentials.basic(applicationName, applicationPassword)

        return when {
            sslContext != null -> {
                HttpClientHelper.createSecureHttpClient(
                    sslContext,
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
