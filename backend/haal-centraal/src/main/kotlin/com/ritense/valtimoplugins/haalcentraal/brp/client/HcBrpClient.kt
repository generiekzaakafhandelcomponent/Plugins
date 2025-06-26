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

package com.ritense.valtimoplugins.haalcentraal.brp.client

import com.ritense.valtimoplugins.haalcentraal.brp.exception.HcBewoningenNotFoundException
import com.ritense.valtimoplugins.haalcentraal.brp.model.BewoningenRequest
import com.ritense.valtimoplugins.haalcentraal.brp.model.BewoningenResponse
import com.ritense.valtimoplugins.haalcentraal.brp.service.HaalCentraalBrpService.Companion.logger
import com.ritense.valtimoplugins.haalcentraal.shared.HaalCentraalWebClient
import com.ritense.valtimoplugins.haalcentraal.shared.exception.HaalCentraalBadRequestException
import com.ritense.valtimoplugins.haalcentraal.shared.exception.HaalCentraalNotFoundException
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import java.net.URI

class HcBrpClient(
    private val webClient: HaalCentraalWebClient
) {

    fun getBewoningen(
        baseUrl: URI,
        bewoningenRequest: BewoningenRequest,
        authentication: HaalCentraalAuthentication
    ): BewoningenResponse? {
        val uri = URI("${baseUrl}/bewoningen")

        return try {
            webClient.get<BewoningenResponse, BewoningenRequest>(uri, bewoningenRequest, authentication)
        } catch (e: HaalCentraalNotFoundException) {
            logger.warn("Not found exception: ${e.message} for Adresseerbaar Object Identificatie: ${bewoningenRequest.adresseerbaarObjectIdentificatie}")
            throw HcBewoningenNotFoundException(e.message!!)
        } catch (e: HaalCentraalBadRequestException) {
            logger.warn("Bad request exception: ${e.message} for Adresseerbaar Object Identificatie: ${bewoningenRequest.adresseerbaarObjectIdentificatie}")
            throw HcBewoningenNotFoundException(e.message!!)
        }
    }
}
