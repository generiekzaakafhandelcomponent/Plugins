/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 *  Licensed under EUPL, Version 1.2 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" basis,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */
package com.ritense.valtimoplugins.alfresco

import com.ritense.documentenapi.DocumentenApiAuthentication
import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginProperty
import org.springframework.web.client.RestClient
import org.springframework.web.reactive.function.client.ClientRequest
import org.springframework.web.reactive.function.client.ClientResponse
import org.springframework.web.reactive.function.client.ExchangeFunction
import reactor.core.publisher.Mono

@Plugin(
    key = "alfrescoauthentication",
    title = "Alfresco Authentication",
    description = "Provides authentication for Alfresco"
)
class AlfrescoAuthenticationPlugin(
    val tokenGeneratorService: AlfrescoTokenGeneratorService
) : DocumentenApiAuthentication {

    @PluginProperty(key = "clientId", secret = false, required = true)
    lateinit var clientId: String

    @PluginProperty(key = "clientSecret", secret = true, required = true)
    lateinit var clientSecret: String

    override fun filter(request: ClientRequest, next: ExchangeFunction): Mono<ClientResponse> {
        val generatedToken = tokenGeneratorService.generateToken(
            clientSecret,
            clientId
        )
        val filteredRequest = ClientRequest.from(request).headers { headers ->
            headers.setBearerAuth(generatedToken)
        }.build()
        return next.exchange(filteredRequest)
    }

    override fun applyAuth(builder: RestClient.Builder): RestClient.Builder {
        val generatedToken = tokenGeneratorService.generateToken(
            clientSecret,
            clientId
        )
        return builder.defaultHeaders { headers ->
            headers.setBearerAuth(generatedToken)
        }
    }
}
