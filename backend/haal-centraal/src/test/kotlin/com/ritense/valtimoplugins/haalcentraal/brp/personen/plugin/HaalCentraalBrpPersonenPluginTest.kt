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

package com.ritense.valtimoplugins.haalcentraal.brp.personen.plugin

import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.RaadpleegMetBurgerservicenummer
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.ZoekMetAdresseerbaarObjectIdentificatie
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.ZoekMetGeslachtsnaamEnGeboortedatum
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.ZoekMetNaamEnGemeenteVanInschrijving
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.ZoekMetNummeraanduidingIdentificatie
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.ZoekMetPostcodeEnHuisnummer
import com.ritense.valtimoplugins.haalcentraal.brp.personen.model.ZoekMetStraatHuisnummerEnGemeenteVanInschrijving
import com.ritense.valtimoplugins.haalcentraal.brp.personen.service.HaalCentraalBrpPersonenService
import com.ritense.valtimoplugins.httpclientauthentication.HttpClientAuthenticator
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.net.URI

class HaalCentraalBrpPersonenPluginTest {
    private val service: HaalCentraalBrpPersonenService = mock()
    private val authentication: HttpClientAuthenticator = mock()
    private val execution: DelegateExecution = mock()
    private val processInstance: DelegateExecution = mock()
    private val baseUrl = URI("http://localhost/haalcentraal/api/brp")
    private val result = listOf(mapOf<String, Any?>("burgerservicenummer" to "999993653"))

    private lateinit var plugin: HaalCentraalBrpPersonenPlugin

    @BeforeEach
    fun setUp() {
        plugin = HaalCentraalBrpPersonenPlugin(service)
        plugin.brpPersonenBaseUrl = baseUrl
        plugin.authenticationPluginConfiguration = authentication
        whenever(execution.processInstance).thenReturn(processInstance)
        whenever(service.getPersonen(eq(baseUrl), any(), eq(authentication))).thenReturn(result)
    }

    @Test
    fun `raadpleeg met bsn splits comma separated values and stores result`() {
        plugin.raadpleegMetBurgerservicenummer(
            burgerservicenummer = "999993653, 999990019",
            fields = listOf("naam", " geboorte.datum ", ""),
            gemeenteVanInschrijving = "",
            resultProcessVariableName = "personen",
            execution = execution,
        )

        verify(service).getPersonen(
            baseUrl,
            RaadpleegMetBurgerservicenummer(
                fields = listOf("naam", "geboorte.datum"),
                burgerservicenummer = listOf("999993653", "999990019"),
                gemeenteVanInschrijving = null,
            ),
            authentication,
        )
        verify(processInstance).setVariable("personen", result)
    }

    @Test
    fun `zoek met geslachtsnaam en geboortedatum`() {
        plugin.zoekMetGeslachtsnaamEnGeboortedatum(
            geslachtsnaam = "Jansen",
            geboortedatum = "1980-01-01",
            geslacht = "V",
            voorvoegsel = null,
            voornamen = "",
            inclusiefOverledenPersonen = "TRUE",
            gemeenteVanInschrijving = null,
            fields = listOf("naam"),
            resultProcessVariableName = "personen",
            execution = execution,
        )

        verify(service).getPersonen(
            baseUrl,
            ZoekMetGeslachtsnaamEnGeboortedatum(
                fields = listOf("naam"),
                geslachtsnaam = "Jansen",
                geboortedatum = "1980-01-01",
                geslacht = "V",
                inclusiefOverledenPersonen = true,
            ),
            authentication,
        )
    }

    @Test
    fun `zoek met naam en gemeente van inschrijving`() {
        plugin.zoekMetNaamEnGemeenteVanInschrijving(
            geslachtsnaam = "Jansen",
            voornamen = "Piet",
            gemeenteVanInschrijving = "0193",
            geslacht = null,
            voorvoegsel = null,
            inclusiefOverledenPersonen = null,
            fields = listOf("naam"),
            resultProcessVariableName = "personen",
            execution = execution,
        )

        verify(service).getPersonen(
            baseUrl,
            ZoekMetNaamEnGemeenteVanInschrijving(
                fields = listOf("naam"),
                geslachtsnaam = "Jansen",
                voornamen = "Piet",
                gemeenteVanInschrijving = "0193",
            ),
            authentication,
        )
    }

    @Test
    fun `zoek met postcode en huisnummer`() {
        plugin.zoekMetPostcodeEnHuisnummer(
            postcode = "8011AB",
            huisnummer = " 12 ",
            huisletter = "a",
            huisnummertoevoeging = null,
            geboortedatum = null,
            geslachtsnaam = null,
            inclusiefOverledenPersonen = null,
            gemeenteVanInschrijving = null,
            fields = listOf("naam"),
            resultProcessVariableName = "personen",
            execution = execution,
        )

        verify(service).getPersonen(
            baseUrl,
            ZoekMetPostcodeEnHuisnummer(
                fields = listOf("naam"),
                postcode = "8011AB",
                huisnummer = 12,
                huisletter = "a",
            ),
            authentication,
        )
    }

    @Test
    fun `zoek met straat huisnummer en gemeente van inschrijving`() {
        plugin.zoekMetStraatHuisnummerEnGemeenteVanInschrijving(
            straat = "Grote Markt",
            huisnummer = "1",
            gemeenteVanInschrijving = "0193",
            huisletter = null,
            huisnummertoevoeging = null,
            inclusiefOverledenPersonen = null,
            fields = listOf("naam"),
            resultProcessVariableName = "personen",
            execution = execution,
        )

        verify(service).getPersonen(
            baseUrl,
            ZoekMetStraatHuisnummerEnGemeenteVanInschrijving(
                fields = listOf("naam"),
                straat = "Grote Markt",
                huisnummer = 1,
                gemeenteVanInschrijving = "0193",
            ),
            authentication,
        )
    }

    @Test
    fun `zoek met nummeraanduiding identificatie`() {
        plugin.zoekMetNummeraanduidingIdentificatie(
            nummeraanduidingIdentificatie = "0518200000583534",
            inclusiefOverledenPersonen = null,
            gemeenteVanInschrijving = null,
            fields = listOf("naam"),
            resultProcessVariableName = "personen",
            execution = execution,
        )

        verify(service).getPersonen(
            baseUrl,
            ZoekMetNummeraanduidingIdentificatie(
                fields = listOf("naam"),
                nummeraanduidingIdentificatie = "0518200000583534",
            ),
            authentication,
        )
    }

    @Test
    fun `zoek met adresseerbaar object identificatie`() {
        plugin.zoekMetAdresseerbaarObjectIdentificatie(
            adresseerbaarObjectIdentificatie = "0518010000583534",
            inclusiefOverledenPersonen = null,
            gemeenteVanInschrijving = null,
            fields = listOf("naam"),
            resultProcessVariableName = "personen",
            execution = execution,
        )

        verify(service).getPersonen(
            baseUrl,
            ZoekMetAdresseerbaarObjectIdentificatie(
                fields = listOf("naam"),
                adresseerbaarObjectIdentificatie = "0518010000583534",
            ),
            authentication,
        )
    }

    @Test
    fun `should reject non numeric huisnummer`() {
        assertThrows(IllegalArgumentException::class.java) {
            plugin.zoekMetPostcodeEnHuisnummer(
                postcode = "8011AB",
                huisnummer = "12a",
                huisletter = null,
                huisnummertoevoeging = null,
                geboortedatum = null,
                geslachtsnaam = null,
                inclusiefOverledenPersonen = null,
                gemeenteVanInschrijving = null,
                fields = listOf("naam"),
                resultProcessVariableName = "personen",
                execution = execution,
            )
        }
    }

    @Test
    fun `should reject invalid inclusiefOverledenPersonen`() {
        assertThrows(IllegalArgumentException::class.java) {
            plugin.zoekMetAdresseerbaarObjectIdentificatie(
                adresseerbaarObjectIdentificatie = "0518010000583534",
                inclusiefOverledenPersonen = "ja",
                gemeenteVanInschrijving = null,
                fields = listOf("naam"),
                resultProcessVariableName = "personen",
                execution = execution,
            )
        }
    }

    @Test
    fun `should reject empty fields`() {
        assertThrows(IllegalArgumentException::class.java) {
            plugin.raadpleegMetBurgerservicenummer(
                burgerservicenummer = "999993653",
                fields = listOf(" ", ""),
                gemeenteVanInschrijving = null,
                resultProcessVariableName = "personen",
                execution = execution,
            )
        }
    }

    @Test
    fun `should reject more than 130 fields`() {
        assertThrows(IllegalArgumentException::class.java) {
            plugin.raadpleegMetBurgerservicenummer(
                burgerservicenummer = "999993653",
                fields = (1..131).map { "veld$it" },
                gemeenteVanInschrijving = null,
                resultProcessVariableName = "personen",
                execution = execution,
            )
        }
    }
}
