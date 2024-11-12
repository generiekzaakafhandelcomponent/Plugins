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

package com.ritense.valtimoplugins.notifynl.client

import com.ritense.valtimoplugins.notifynl.domain.SendSmsRequest
import com.ritense.valtimoplugins.notifynl.domain.SendSmsResponse
import org.springframework.http.MediaType
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

class NotifyNlClient(
    private val restClientBuilder: RestClient.Builder
) {
    fun sendSms(baseUri: URI, body: SendSmsRequest, token: String): SendSmsResponse {
        return restClientBuilder
            .clone()
            .build()
            .post()
            .uri {
                it.scheme(baseUri.scheme)
                    .host(baseUri.host)
                    .path(baseUri.path)
                    .path("/v2/notifications/sms")
                    .port(baseUri.port)
                    .build()
            }
            .headers {
                it.contentType = MediaType.APPLICATION_JSON
                it.setBearerAuth(token)
            }
            .accept(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body<SendSmsResponse>()!!
    }
}