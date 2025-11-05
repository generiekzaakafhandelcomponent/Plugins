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
import com.nimbusds.oauth2.sdk.token.BearerAccessToken
import com.ritense.resource.domain.MetadataType
import com.ritense.valtimo.contract.annotation.SkipComponentScan
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.delegate.DelegateExecution
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
    lateinit var damBaseUri: URI
    lateinit var docsysBaseUri: URI
    lateinit var tokenEndpoint: URI
    lateinit var clientId: String
    lateinit var clientSecret: String
    lateinit var scope: String

    // token for authentication Docsys API
    var token: AccesTokenDecorator? = null;

    fun generateDocument(modelId: String, params: Map<String, Any>): DownloadResponse {
        logger.debug { "Generearte draft doument in  Docsys using model '$modelId'" }

        val draft = generateDraft(params, modelId)
        val fileResponse = downloadDocument(draft)

        return fileResponse
    }

    private fun downloadDocument(draft: DamDraftResponse): DownloadResponse {
        val requestBody = DownloadRequest(
            Id = draft.draftId,
            format = ExportFormat.PDF.format,
        )

        val response = restClientBuilder
            .clone()
            .build()
            .post()
            .uri {
                it.scheme(docsysBaseUri!!.scheme)
                    .host(docsysBaseUri!!.host)
                    .path(docsysBaseUri!!.path)
                    .path(DOCSYS_API_POST_DOCUMENTS)
                    .port(docsysBaseUri!!.port)
                    .build()
            }
            .headers {
                it.contentType = MediaType.APPLICATION_JSON
                it.setBearerAuth(getAccessToken().accesToken.value)
            }
            .accept(MediaType.APPLICATION_JSON)
            .body(requestBody)
            .retrieve()
            .body<DownloadResponse>()

        if (response == null) {
            throw IllegalStateException("Document could not be downloaded.")
        }

        return response
    }

    private fun generateDraft(
        params: Map<String, Any>,
        modelId: String
    ): DamDraftResponse {
        val body = LinkedMultiValueMap<String, Any>()
        params.forEach { body.add(it.key, it.value) }

        val response = restClientBuilder
            .clone()
            .build()
            .post()
            .uri {
                it.scheme(damBaseUri!!.scheme)
                    .host(damBaseUri!!.host)
                    .path(damBaseUri!!.path)
                    .path("/")
                    .path(modelId)
                    .port(damBaseUri!!.port)
                    .build()
            }
            .headers {
                it.contentType = MediaType.APPLICATION_JSON
                it.setBearerAuth(getAccessToken().accesToken.value)
            }
            .accept(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body<DamDraftResponse>()

        if (response == null) {
            throw IllegalStateException("Draft could not be generated")
        }

        return response
    }


    private fun getAccessToken(): AccesTokenDecorator {

        if (token == null || token!!.isExpired()) {
            val clientGrant: AuthorizationGrant = ClientCredentialsGrant()

            val clientID: ClientID = ClientID(clientId)
            val clientSecret: Secret = Secret(clientSecret)
            val clientAuth: ClientAuthentication = ClientSecretBasic(clientID, clientSecret)

            // Make the token request
            val tokenScope = Scope()
            tokenScope.add(scope)
            val request = TokenRequest(tokenEndpoint, clientAuth, clientGrant, tokenScope)

            val response: TokenResponse = TokenResponse.parse(request.toHTTPRequest().send())

            if (!response.indicatesSuccess()) {
                val errorResponse: TokenErrorResponse? = response.toErrorResponse()
                logger.debug { "Token could not be parsed. Cause error: ${errorResponse}" }
            }

            val successResponse: AccessTokenResponse = response.toSuccessResponse()


            // Get the access token
            val accessToken: BearerAccessToken? = successResponse.getTokens().bearerAccessToken
            if (accessToken == null) {
                throw IllegalStateException("Access token not found")
            }

            token = AccesTokenDecorator(accessToken)
        }

        return token!!
    }

    enum class ExportFormat(val format: String) {
        PDF("pdf")
    }

    companion object {
        private val logger = KotlinLogging.logger {}
        const val DOCSYS_API_POST_DOCUMENTS = "/api/v1/documents"
    }
}
