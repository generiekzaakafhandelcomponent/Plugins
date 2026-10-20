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
 *
 */

package com.ritense.valtimoplugins.haalcentraal.brp.personen.service

import com.ritense.valtimoplugins.haalcentraal.brp.personen.client.HcBrpPersonenClient
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.PersonenQuery
import com.ritense.valtimoplugins.httpclientauthentication.HttpClientAuthenticator
import mu.KotlinLogging
import java.net.URI

class HaalCentraalBrpPersonenService(
    private val hcBrpPersonenClient: HcBrpPersonenClient,
) {
    fun getPersonen(
        baseUrl: URI,
        query: PersonenQuery,
        authentication: HttpClientAuthenticator,
    ): List<Map<String, Any?>> {
        // Do not log query parameters: they contain personal data (BSN, names, addresses)
        logger.info { "Retrieving personen with query type ${query.type}" }

        return hcBrpPersonenClient
            .getPersonen(
                baseUrl = baseUrl,
                query = query,
                authentication = authentication,
            )?.personen
            ?: emptyList()
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
