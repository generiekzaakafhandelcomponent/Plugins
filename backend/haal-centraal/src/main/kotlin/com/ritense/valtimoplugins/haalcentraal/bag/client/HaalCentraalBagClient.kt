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
import com.ritense.valtimoplugins.haalcentraal.shared.HaalCentraalWebClient
import com.ritense.valtimoplugins.haalcentraal.shared.exception.HaalCentraalBadRequestException
import com.ritense.valtimoplugins.haalcentraal.shared.exception.HaalCentraalNotFoundException
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import mu.KotlinLogging
import org.springframework.web.util.UriComponentsBuilder
import java.net.URI

class HaalCentraalBagClient(
    private val webClient: HaalCentraalWebClient
) {

    fun getAdresseerbaarObjectIdentificatie(
        baseUrl: URI,
        addressRequest: AddressRequest,
        authentication: HaalCentraalAuthentication
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
            webClient.get<AddressResponse>(uri, authentication)
        } catch (e: HaalCentraalNotFoundException) {
            logger.warn("Not found exception: ${e.message} for postcode: ${addressRequest.postcode} en huisnummer: ${addressRequest.huisnummer}")
            throw AddressNotFoundException(e.message!!)
        } catch (e: HaalCentraalBadRequestException) {
            logger.warn("Bad request exception: ${e.message} for postcode: ${addressRequest.postcode} en huisnummer: ${addressRequest.huisnummer}")
            throw AddressNotFoundException(e.message!!)
        }
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
