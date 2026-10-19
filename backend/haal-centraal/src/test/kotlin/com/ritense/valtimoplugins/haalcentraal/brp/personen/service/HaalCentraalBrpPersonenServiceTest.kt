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
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.PersonenQueryResponse
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.RaadpleegMetBurgerservicenummer
import com.ritense.valtimoplugins.httpclientauthentication.HttpClientAuthenticator
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import java.net.URI

class HaalCentraalBrpPersonenServiceTest {
    private val client: HcBrpPersonenClient = mock()
    private val authentication: HttpClientAuthenticator = mock()
    private val service = HaalCentraalBrpPersonenService(client)

    private val baseUrl = URI("http://localhost/haalcentraal/api/brp")
    private val query =
        RaadpleegMetBurgerservicenummer(fields = listOf("naam"), burgerservicenummer = listOf("999993653"))

    @Test
    fun `should return personen from response`() {
        val persoon = mapOf("burgerservicenummer" to "999993653")
        whenever(client.getPersonen(eq(baseUrl), eq(query), any()))
            .thenReturn(PersonenQueryResponse(type = query.type, personen = listOf(persoon)))

        assertEquals(listOf(persoon), service.getPersonen(baseUrl, query, authentication))
    }

    @Test
    fun `should return empty list when response is empty`() {
        whenever(client.getPersonen(eq(baseUrl), eq(query), any())).thenReturn(null)

        assertEquals(emptyList<Map<String, Any?>>(), service.getPersonen(baseUrl, query, authentication))
    }
}
