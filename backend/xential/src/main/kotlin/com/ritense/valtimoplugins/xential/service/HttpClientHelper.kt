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
 */

package com.ritense.valtimoplugins.xential.service

import org.apache.hc.client5.http.impl.classic.CloseableHttpClient
import org.apache.hc.client5.http.impl.classic.HttpClients
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder
import javax.net.ssl.SSLContext

object HttpClientHelper {
    fun createDefaultHttpClient(): CloseableHttpClient {
        return HttpClients.createDefault()
    }

    fun createSecureHttpClient(sslContext: SSLContext): CloseableHttpClient =
        PoolingHttpClientConnectionManagerBuilder.create()
            .setSSLSocketFactory(
                SSLConnectionSocketFactoryBuilder.create()
                    .setSslContext(sslContext)
                    .build(),
            )
            .build().let { connectionManager ->
                HttpClients.custom()
                    .setConnectionManager(connectionManager)
                    .build()
            }
}
