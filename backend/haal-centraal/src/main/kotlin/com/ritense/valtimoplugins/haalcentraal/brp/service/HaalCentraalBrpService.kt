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

package com.ritense.valtimoplugins.haalcentraal.brp.service

import com.ritense.valtimoplugins.haalcentraal.brp.client.HcBrpClient
import com.ritense.valtimoplugins.haalcentraal.brp.model.BewoningDto
import com.ritense.valtimoplugins.haalcentraal.brp.model.BewoningenRequest
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import mu.KotlinLogging
import java.net.URI

class HaalCentraalBrpService(
    private val haalCentraalBrpClient: HcBrpClient
) {

    fun getBewoningen(
        baseUrl: URI,
        bewoningenRequest: BewoningenRequest,
        authentication: HaalCentraalAuthentication
    ): List<BewoningDto>? {
        logger.info("Retrieving bewoningen for adresseerbaarObjectIdentificatie: ${bewoningenRequest.adresseerbaarObjectIdentificatie}")

        return haalCentraalBrpClient.getBewoningen(
            baseUrl = baseUrl,
            bewoningenRequest = bewoningenRequest,
            authentication = authentication
        )?.bewoningen?.map { bewoning ->
            BewoningDto(
                adresseerbaarObjectIdentificatie = bewoning.adresseerbaarObjectIdentificatie,
                bewoners = bewoning.bewoners,
                mogelijkeBewoners = bewoning.mogelijkeBewoners,
                indicatieVeelBewoners = bewoning.indicatieVeelBewoners
            )
        }
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
