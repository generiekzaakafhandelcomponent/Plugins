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

package com.ritense.valtimoplugins.docsys.client

import com.nimbusds.oauth2.sdk.AccessTokenResponse
import com.nimbusds.oauth2.sdk.AuthorizationGrant
import com.nimbusds.oauth2.sdk.ClientCredentialsGrant
import com.nimbusds.oauth2.sdk.Scope
import com.nimbusds.oauth2.sdk.TokenErrorResponse
import com.nimbusds.oauth2.sdk.TokenRequest
import com.nimbusds.oauth2.sdk.TokenResponse
import com.nimbusds.oauth2.sdk.auth.ClientAuthentication
import com.nimbusds.oauth2.sdk.auth.ClientSecretBasic
import com.nimbusds.oauth2.sdk.auth.Secret
import com.nimbusds.oauth2.sdk.id.ClientID
import com.nimbusds.oauth2.sdk.token.AccessToken
import com.nimbusds.oauth2.sdk.token.BearerAccessToken
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.http.MediaType
import org.springframework.stereotype.Component
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

@Component
@SkipComponentScan
class DocsysClient(
    val restClientBuilder: RestClient.Builder,
) {
    lateinit var baseUri: URI
    lateinit var tokenEndpoint: URI
    lateinit var clientId: String
    lateinit var clientSecret: String

          // token for authentication Docsys API
     var token: AccesTokenDecorator? = null;

    /**
     * https://api.Docsys.com/methods/chat.postMessage
     */
    fun generateDraftDocument(modelId: String, params: Map<String, Any>) {
        logger.debug { "Generearte draft doument in  Docsys using model '$modelId'" }

        val body = LinkedMultiValueMap<String, Any>()
        params.forEach { body.add(it.key, it.value) }

        val response = restClientBuilder
            .clone()
            .build()
            .post()
            .uri {
                it.scheme(baseUri!!.scheme)
                    .host(baseUri!!.host)
                    .path(baseUri!!.path)
                    .path(modelId)
                    .port(baseUri!!.port)
                    .build()
            }
            .headers {
                it.contentType = MediaType.APPLICATION_JSON
                it.setBearerAuth(getToken().accesToken.value)
            }
            .accept(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body<DocsysResponse>()

        if (response?.ok != true) {
            throw DocsysException(response?.error)
        }
    }


    private fun getToken(): AccesTokenDecorator {

        if (token == null || token!!.isExpired()) {
            val clientGrant: AuthorizationGrant = ClientCredentialsGrant()

            val clientID: ClientID = ClientID(clientId)
            val clientSecret: Secret = Secret(clientSecret)
            val clientAuth: ClientAuthentication = ClientSecretBasic(clientID, clientSecret)

            // Make the token request
            val request: TokenRequest = TokenRequest(tokenEndpoint, clientAuth, clientGrant, Scope())

            val response: TokenResponse = TokenResponse.parse(request.toHTTPRequest().send())

            if (!response.indicatesSuccess()) {
                // We got an error response...
                val errorResponse: TokenErrorResponse? = response.toErrorResponse()
            }

            val successResponse: AccessTokenResponse = response.toSuccessResponse()


            // Get the access token
            val accessToken: BearerAccessToken? = successResponse.getTokens().bearerAccessToken
            if(accessToken == null) {
                throw IllegalStateException("Access token not found")
            }

            token = AccesTokenDecorator(accessToken)
        }

        return token!!
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
