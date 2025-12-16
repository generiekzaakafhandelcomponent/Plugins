/*
 * Copyright 2015-2022 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.socrates.client

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import com.ritense.valtimoplugins.socrates.error.SocratesError
import com.ritense.valtimoplugins.socrates.model.LoBehandeld
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.io.IOException
import java.net.URI


@Component
@SkipComponentScan
class SocratesClient(
    val restClientBuilder: RestClient.Builder,
) {
    lateinit var socratesBaseUri: URI

    fun dienstAanmaken(zaakId: String, loBehandeld: LoBehandeld): LOBehandeldRespons {
        val requestBody = LOBehandeldRequest(
            identificatie = zaakId,
            loBehandeld = loBehandeld,
        )

        val response = try {
            restClientBuilder
                .clone()
                .build()
                .post()
                .uri {
                    it.scheme(socratesBaseUri!!.scheme)
                        .host(socratesBaseUri!!.host)
                        .path(socratesBaseUri!!.path)
                        .path(SOCRATES_API_LOBehandeld)
                        .port(socratesBaseUri!!.port)
                        .build()
                }
                .headers {
                    it.contentType = MediaType.APPLICATION_JSON
                }
                .accept(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body<LOBehandeldRespons>()
        } catch (e: Exception) {
            if (e.cause is IOException) {
                logger.error(e) { "error connecting to Socrates" }
                throw SocratesError(e, "SOCRATES_CONNECT_ERROR")
            }
            else {
                logger.error(e) { "error met aanmaken dienst in Socrates" }
                throw e
            }
        }

        if (response == null) {
            throw IllegalStateException("no respons")
        }

        return response
    }


    companion object {
        private val logger = KotlinLogging.logger {}
        const val SOCRATES_API_LOBehandeld = "/LOBehandeld"
    }
}
