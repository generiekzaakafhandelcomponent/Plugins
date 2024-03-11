/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.valtimo.brp.service

import com.ritense.valtimo.brp.client.BrpClient
import com.ritense.valtimo.brp.domain.Persoon
import com.ritense.valtimo.brp.dto.BrpPluginPropertiesDto
import com.ritense.valtimo.brp.dto.FetchBrpDataPluginActionProperties
import com.ritense.valtimo.brp.exception.PersonNotFoundException

class BrpService(
    private val brpClient: BrpClient
) {

    fun getBrpDataFromHaalCentraal(
        bsn: String,
        brpPropertiesDto: BrpPluginPropertiesDto,
        fetchBrpDataPluginActionProperties: FetchBrpDataPluginActionProperties
    ): Persoon {
        val brpResponse = brpClient.getPersonByBsn(
            burgerservicenummer = bsn,
            brpProperties = brpPropertiesDto,
            fetchBrpDataPluginActionProperties = fetchBrpDataPluginActionProperties
        )

        if (brpResponse == null || brpResponse.personen.isNullOrEmpty()) {
            throw PersonNotFoundException("No person found with given BSN")
        } else return Persoon.from(brpResponse, fetchBrpDataPluginActionProperties.filterChildrenOlderThenThirteen)
    }

}