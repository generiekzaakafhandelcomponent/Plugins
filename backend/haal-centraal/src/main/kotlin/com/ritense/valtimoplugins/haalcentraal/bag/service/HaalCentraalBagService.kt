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

package com.ritense.valtimoplugins.haalcentraal.bag.service

import com.ritense.valtimoplugins.haalcentraal.bag.client.HaalCentraalBagClient
import com.ritense.valtimoplugins.haalcentraal.bag.model.Address
import com.ritense.valtimoplugins.haalcentraal.bag.model.AddressDto
import com.ritense.valtimoplugins.haalcentraal.bag.model.AddressRequest
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import mu.KotlinLogging
import java.net.URI

class HaalCentraalBagService(
    private val haalCentraalBagClient: HaalCentraalBagClient
) {

    fun getAdresseerbaarObjectIdentificatie(
        baseUrl: URI,
        addressRequest: AddressRequest,
        haalCentraalAuthentication: HaalCentraalAuthentication
    ): List<AddressDto> {
        logger.info("Fetching address for postcode: ${addressRequest.postcode}, huisnummer: ${addressRequest.huisnummer}")

        val cleanAddressRequest = AddressRequest(
            postcode = addressRequest.postcode,
            huisnummer = addressRequest.huisnummer,
            huisnummertoevoeging = addressRequest.huisnummertoevoeging?.takeIf { it.isNotBlank() },
            huisletter = addressRequest.huisletter?.takeIf { it.isNotBlank() },
            exacteMatch = addressRequest.exacteMatch
        )

        val response = haalCentraalBagClient.getAdresseerbaarObjectIdentificatie(
            baseUrl = baseUrl,
            addressRequest = cleanAddressRequest,
            authentication = haalCentraalAuthentication
        )

        return response?.embedded?.adressen?.map { address -> address.toDto() } ?: emptyList()
    }

    private fun Address.toDto(): AddressDto = AddressDto(
        openbareRuimteNaam = this.openbareRuimteNaam,
        korteNaam = this.korteNaam,
        huisnummer = this.huisnummer,
        huisletter = this.huisletter,
        huisnummertoevoeging = this.huisnummertoevoeging,
        postcode = this.postcode,
        woonplaatsNaam = this.woonplaatsNaam,
        nummeraanduidingIdentificatie = this.nummeraanduidingIdentificatie,
        openbareRuimteIdentificatie = this.openbareRuimteIdentificatie,
        woonplaatsIdentificatie = this.woonplaatsIdentificatie,
        adresseerbaarObjectIdentificatie = this.adresseerbaarObjectIdentificatie,
        pandIdentificaties = this.pandIdentificaties,
        indicatieNevenadres = this.indicatieNevenadres,
        adresregel5 = this.adresregel5,
        adresregel6 = this.adresregel6,
        geconstateerd = this.geconstateerd,
        inonderzoek = this.inonderzoek,
        links = this.links,
        embeddedObject = this.embeddedObject
    )

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
