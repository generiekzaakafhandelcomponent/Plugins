/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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
 *
 */

package com.ritense.valtimoplugins.haalcentraal.shared

import com.ritense.valtimoplugins.haalcentraal.shared.exception.HaalCentraalNotFoundException
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.BodyInserters
import org.springframework.web.reactive.function.client.WebClient
import reactor.netty.http.client.HttpClient
import java.net.URI

class HaalCentraalWebClient(
) {
    inline fun <reified T : Any, R : Any?> get(
        uri: URI,
        request: R?,
        authentication: HaalCentraalAuthentication
    ): T? {
        val httpClient = authentication.getAuthenticatedHttpClient()
        return buildWebClient(httpClient, authentication)
            .post()
            .uri(uri)
            .apply {
                request?.let { body(BodyInserters.fromValue(it)) }
            }
            .retrieve()
            .bodyToMono(T::class.java)
            .block()
    }

    inline fun <reified T : Any> get(
        uri: URI,
        authentication: HaalCentraalAuthentication
    ): T? {
        val httpClient = authentication.getAuthenticatedHttpClient()
        return buildWebClient(httpClient, authentication)
            .get()
            .uri(uri)
            .retrieve()
            .onStatus({ status -> status.value() == 404 }) {
                throw HaalCentraalNotFoundException("Niets gevonden")
            }
            .bodyToMono(T::class.java)
            .block()
    }

    fun buildWebClient(
        httpClient: HttpClient,
        authentication: HaalCentraalAuthentication
    ): WebClient {
        return WebClient.builder()
            .clientConnector(ReactorClientHttpConnector(httpClient))
            .codecs { configurer -> configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024) }
            .filter(authentication)
            .build()
    }
}
