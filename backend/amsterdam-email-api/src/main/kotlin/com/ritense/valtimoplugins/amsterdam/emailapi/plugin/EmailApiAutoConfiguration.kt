/*
 * Copyright 2015-2024. Ritense BV, the Netherlands.
 *
 * Licensed under EUPL, Version 1.2 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package com.ritense.valtimoplugins.amsterdam.emailapi.plugin

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.ritense.documentenapi.client.DocumentInformatieObject
import com.ritense.plugin.repository.PluginProcessLinkRepository
import com.ritense.plugin.service.PluginService
import com.ritense.valtimo.jackson.ZonedLocalDateTimeDeserializer
import com.ritense.valtimoplugins.amsterdam.emailapi.client.EmailClient
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient
import org.apache.hc.client5.http.impl.classic.HttpClients
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactoryBuilder
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchProperties.Restclient
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestTemplate
import java.time.LocalDateTime

@Configuration
class EmailApiAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(ProcessLinkSendTaskStartListener::class)
    fun pluginLinkSendTaskStartListener(
        pluginProcessLinkRepository: PluginProcessLinkRepository?,
        pluginService: PluginService?
    ): ProcessLinkSendTaskStartListener {
        return ProcessLinkSendTaskStartListener(
            pluginProcessLinkRepository!!,
            pluginService!!
        )
    }

    @Bean
    @ConditionalOnMissingBean(EmailApiPluginFactory::class)
    fun createEmailApiPluginFactory(
        pluginService: PluginService,
        emailClient: EmailClient,
        restclientBuilder: RestClient.Builder
    ): EmailApiPluginFactory {
        return EmailApiPluginFactory(pluginService, emailClient, restclientBuilder)
    }

    @Bean
    @ConditionalOnMissingBean(EmailClient::class)
    fun createEmailClient(restTemplate: RestTemplate, publisher: ApplicationEventPublisher): EmailClient {
        return EmailClient(restTemplate, publisher)
    }

    @Bean
    @ConditionalOnMissingBean(RestTemplate::class)
    fun createRestTemplate(): RestTemplate {
        val httpClient: CloseableHttpClient = HttpClients.custom()
            .setConnectionManager(
                PoolingHttpClientConnectionManagerBuilder.create()
                    .setSSLSocketFactory(
                        SSLConnectionSocketFactoryBuilder.create()
                            .setHostnameVerifier(NoopHostnameVerifier.INSTANCE)
                            .build()
                    )
                    .build()
            )
            .build()

        val requestFactory = HttpComponentsClientHttpRequestFactory(httpClient)

        return RestTemplate(requestFactory)
    }

    /**
     * Only for plugin development
     */
//    fun adjustRestclientBuilder( buidlder: RestClient.Builder): RestClient.Builder {
//        var builder = RestClient.builder().clone()
//        builder.messageConverters {
//          it.forEach {
//              if(it is MappingJackson2HttpMessageConverter) {
//                  it.objectMapper.addMixIn(DocumentInformatieObject::class.java, DocumentInformatieObjectMixin::class.java)
//              }
//          }
//        }
//        return builder
//    }
//
//    abstract class DocumentInformatieObjectMixin(
//        @get:JsonDeserialize(using = ZonedLocalDateTimeDeserializer::class)
//        val beginRegistratie: LocalDateTime
//    )
}
