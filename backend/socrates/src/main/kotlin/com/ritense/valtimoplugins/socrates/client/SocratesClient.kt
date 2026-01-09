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
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpRequest
import org.springframework.http.MediaType
import org.springframework.http.client.ClientHttpResponse
import org.springframework.stereotype.Component
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.HttpServerErrorException
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.io.IOException
import java.net.URI
import java.nio.charset.StandardCharsets


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
                .requestInterceptor{ request, body, execution ->
                    logRequest(request, body)
                    val response = execution.execute(request, body)
                    logResponse(request, response)
                    response
                }
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
                val msg = "error connecting to Socrates"
                logger.error(e) { msg }
                throw SocratesError(e,  msg,"SOCRATES_ERROR")
            }
            else if (e.cause is HttpClientErrorException) {
                var excep = e.cause as HttpClientErrorException
                val errorResponse = excep.getResponseBodyAs(ErrorResponse::class.java)
                logger.error(e) { "error request to Socrates" }
                throw SocratesError(e, errorResponse,"SOCRATES_ERROR")
            }
            else if (e.cause is HttpServerErrorException) {
                val msg = "error connecting to Socrates"
                logger.error(e) {msg }
                throw SocratesError(e, msg,"SOCRATES_ERROR")
            }
            else {
                val msg =  "unknown error met aanmaken dienst in Socrates"
                logger.error(e) { msg }
                throw SocratesError(e, msg,"SOCRATES_ERROR")
            }
        }

        if (response == null) {
            throw IllegalStateException("no respons")
        }

        return response
    }

    private fun logRequest(request: HttpRequest, body: ByteArray?) {
        logger.debug { "${"Request: {} {}"} ${request.getMethod()} ${request.getURI()}" }
        logHeaders(request.headers)
        if (body != null && body.size > 0) {
            logger.info("Request body: {}", String(body, StandardCharsets.UTF_8))
        }
    }

    private fun logResponse(request: HttpRequest?, response: ClientHttpResponse) {
        logger.debug { "${"Response status: {}"} ${response.getStatusCode()}" }
        logHeaders(response.headers)
        val responseBody: ByteArray = response.getBody().readAllBytes()
        if (responseBody.size > 0) {
            logger.debug { "${"Response body: {}"} ${String(responseBody, StandardCharsets.UTF_8)}" }
        }
    }

    private fun logHeaders(headers: HttpHeaders) {
        headers.forEach { (key, value) ->
            logger.debug { "$key: $value" }
        }
    }


    companion object {
        private val logger = KotlinLogging.logger {}
        const val SOCRATES_API_LOBehandeld = "/LOBehandeld"
    }
}
