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

package com.ritense.valtimoplugins.haalcentraal.bag.client

import com.ritense.valtimoplugins.haalcentraal.bag.exception.AddressNotFoundException
import com.ritense.valtimoplugins.haalcentraal.bag.model.AddressRequest
import com.ritense.valtimoplugins.haalcentraal.bag.model.AddressResponse
import mu.KotlinLogging
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI

class HaalCentraalBagClient(
    private val restClient: RestClient
) {

    fun getAdresseerbaarObjectIdentificatie(
        baseUrl: URI,
        addressRequest: AddressRequest
    ): AddressResponse? {

        val uri = UriComponentsBuilder.fromUri(baseUrl)
            .path("/adressen")
            .queryParam("postcode", addressRequest.postcode)
            .queryParam("huisnummer", addressRequest.huisnummer)
            .apply {
                addressRequest.huisnummertoevoeging?.let { queryParam("huisnummertoevoeging", it) }
                addressRequest.huisletter?.let { queryParam("huisletter", it) }
                queryParam("exacteMatch", addressRequest.exacteMatch)
            }
            .build()
            .toUri()

        return try {
            restClient
                .get()
                .uri(uri)
                .retrieve()
                .body<AddressResponse>()
        } catch (ex: Exception) {
            if (ex.message?.contains("404") == true) {
                logger.warn("Not found exception: ${ex.message} for postcode: ${addressRequest.postcode} en huisnummer: ${addressRequest.huisnummer}")
                throw AddressNotFoundException("Niets gevonden")
            }
            throw ex
        }
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
