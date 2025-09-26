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
import org.springframework.web.client.RestClient
import java.net.URI

class HaalCentraalWebClient(
    private val restClientBuilder: RestClient.Builder,
) {
    inline fun <reified T : Any, R : Any?> get(
        uri: URI,
        request: R?,
        authentication: HaalCentraalAuthentication
    ): T? {
        val restClient = buildRestClient(authentication)
        return try {
            restClient
                .post()
                .uri(uri)
                .body(request)
                .retrieve()
                .body(T::class.java)
        } catch (ex: Exception) {
            if (ex.message?.contains("404") == true) {
                throw HaalCentraalNotFoundException("Niets gevonden")
            }
            throw ex
        }
    }

    inline fun <reified T : Any> get(
        uri: URI,
        authentication: HaalCentraalAuthentication
    ): T? {
        val restClient = buildRestClient(authentication)
        return try {
            restClient
                .get()
                .uri(uri)
                .retrieve()
                .body(T::class.java)
        } catch (ex: Exception) {
            if (ex.message?.contains("404") == true) {
                throw HaalCentraalNotFoundException("Niets gevonden")
            }
            throw ex
        }
    }

    fun buildRestClient(
        authentication: HaalCentraalAuthentication
    ): RestClient {
        return restClientBuilder
            .clone()
            .apply {
                authentication.applyAuth(it)
            }
            .build()
    }
}
