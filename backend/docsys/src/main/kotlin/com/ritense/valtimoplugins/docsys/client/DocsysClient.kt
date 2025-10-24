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

import com.ritense.valtimo.contract.annotation.SkipComponentScan
import java.io.InputStream
import java.net.URI
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.core.io.InputStreamResource
import org.springframework.http.MediaType
import org.springframework.http.MediaType.MULTIPART_FORM_DATA
import org.springframework.stereotype.Component
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.client.RestClient
import org.springframework.web.client.body

@Component
@SkipComponentScan
class DocsysClient(
    private val restClientBuilder: RestClient.Builder,
    var baseUri: URI?,
    var token: String?,
) {

    /**
     * https://api.Docsys.com/methods/chat.postMessage
     */
    fun generateDraftDocument(modelId: String, params: Map<String, Any>) {
        logger.debug { "Generearte draft doument in  Docsys using model '$modelId'" }

        post(modelId, params )
    }



    private fun post(path: String, params: Map<String, Any>) {
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
                    .path(path)
                    .port(baseUri!!.port)
                    .build()
            }
            .headers {
                it.contentType = MediaType.APPLICATION_JSON
                it.setBearerAuth(token!!)
            }
            .accept(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body<DocsysResponse>()

        if (response?.ok != true) {
            throw DocsysException(response?.error)
        }
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
