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

package com.ritense.valtimo.brp.client

import com.ritense.valtimo.brp.dto.BrpPluginPropertiesDto
import com.ritense.valtimo.brp.dto.FetchBrpDataPluginActionProperties
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.bodyToMono

class BrpClient(
    private val webClient: WebClient
) {
    fun getPersonByBsn(
        burgerservicenummer: String,
        brpProperties: BrpPluginPropertiesDto,
        fetchBrpDataPluginActionProperties: FetchBrpDataPluginActionProperties
    ): BrpClientResponse? {
        val bodyProperties = mapOf(
            "type" to BRP_REQUEST_TYPE,
            "burgerservicenummer" to listOf(burgerservicenummer),
            "fields" to BRP_REQUESTED_FIELDS.joinToString(",")
        )

        return buildWebClient(brpProperties)
            .post().uri("/personen")
            // see also the default headers in buildWebClient()
            .header(NLX_HEADER_REQUEST_USER_ID, fetchBrpDataPluginActionProperties.requestUserId)
            .header(NLX_HEADER_REQUEST_SUBJECT_IDENTIFIER, fetchBrpDataPluginActionProperties.requestSubjectIdentifier)
            .header(NLX_HEADER_REQUEST_DATA_SUBJECT, "$BSN=$burgerservicenummer")
            .header(NLX_HEADER_REQUEST_PROCESS_ID, fetchBrpDataPluginActionProperties.requestProcessId)
            .bodyValue(bodyProperties)
            .retrieve()
            .bodyToMono<BrpClientResponse>()
            .block()
    }

    private fun buildWebClient(haalCentraalBrpProperties: BrpPluginPropertiesDto): WebClient =
         webClient
            .mutate()
            .baseUrl(haalCentraalBrpProperties.url)
            .defaultHeader(haalCentraalBrpProperties.apiKeyHeaderName, haalCentraalBrpProperties.apiKey)
            .defaultHeader(NLX_HEADER_REQUEST_APPLICATION_ID, haalCentraalBrpProperties.applicationId)
            .defaultHeader(NLX_HEADER_REQUEST_DATA_ELEMENTS, DATA_ELEMENTS)
            .build()

    companion object {
        private val BRP_REQUESTED_FIELDS = arrayListOf(
            "burgerservicenummer",
            "naam.voornamen",
            "naam.voorletters",
            "naam.voorvoegsel",
            "naam.geslachtsnaam",
            "geslachtsaanduiding",
            "geboorte.datum",
            "nationaliteiten",
            "geheimhoudingPersoonsgegevens",
            "verblijfplaats",
            "kinderen"
        )

        private const val BRP_REQUEST_TYPE = "RaadpleegMetBurgerservicenummer"
        private const val NLX_HEADER_REQUEST_USER_ID = "X-NLX-Request-User-Id"
        private const val NLX_HEADER_REQUEST_APPLICATION_ID = "X-NLX-Request-Application-Id"
        private const val NLX_HEADER_REQUEST_SUBJECT_IDENTIFIER = "X-NLX-Request-Subject-Identifier"
        private const val NLX_HEADER_REQUEST_DATA_ELEMENTS = "X-NLX-Request-Data-Elements"
        private const val NLX_HEADER_REQUEST_DATA_SUBJECT = "X-NLX-Request-Data-Subject"
        private const val NLX_HEADER_REQUEST_PROCESS_ID = "X-NLX-Request-Process-Id"
        private const val BSN = "bsn"
        private val DATA_ELEMENTS = """Persoon: Voornamen, Voorvoegsel, Geslachtsnaam, Voorletters, Geslachtsaanduiding, Aanhef, Geboortedatum, Burgelijke staat, Code nationaliteit, Indicatie geheimhouding  persoonsgegevens, Straatnaam, Huisnummer, Huisletter, Huisnummertoevoeging, Postcode, Woonplaatsnaam, Kinderen: Burgerservicenummer, Voornamen, Voorvoegsel, Geslachtsnaam, Geboortedatum""".trimIndent()
    }
}