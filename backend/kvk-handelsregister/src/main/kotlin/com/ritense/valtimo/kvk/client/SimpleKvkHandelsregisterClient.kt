package com.ritense.valtimo.kvk.client

import com.ritense.valtimo.kvk.model.ZoekenResponse
import io.netty.channel.ChannelOption
import io.netty.handler.ssl.SslContextBuilder
import mu.KotlinLogging
import org.springframework.http.client.reactive.ReactorClientHttpConnector
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.WebClientResponseException
import reactor.netty.http.client.HttpClient

class SimpleKvkHandelsregisterClient {


    fun search(kvkNumber: String, clientConfig: KvkHandelsregisterClientConfig): ZoekenResponse? {
        return try {
            val httpClient = getHttpClient(clientConfig)
            buildWebClient(httpClient, clientConfig)
                .get()
                .uri { uriBuilder ->
                    uriBuilder.path("/api/v2/zoeken")
                        .queryParam("kvkNummer", kvkNumber)
                        .build()
                }
                .retrieve()
                .bodyToMono(ZoekenResponse::class.java)
                .block()
        } catch (e: WebClientResponseException) {
            logger.error("HTTP Error: ${e.statusCode.value()} - ${e.message}")
            null
        } catch (e: Exception) {
            logger.error("Error occurred while fetching data from KVK API: ${e.message}")
            null
        }
    }

    private fun getHttpClient(
        clientConfig: KvkHandelsregisterClientConfig
    ): HttpClient {
        val sslContextBuilder: SslContextBuilder = SslContextBuilder.forClient()
        val sslContext = sslContextBuilder.build()

        val localConnectionTimeout = clientConfig.connectionTimeout?: 10000
        val localResponseTimeout = (clientConfig.responseTimeout ?: 10000)*1L

        return HttpClient.create().secure { sslSpec ->
            sslSpec.sslContext(sslContext)
        }
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, localConnectionTimeout)
            .responseTimeout(java.time.Duration.ofMillis(localResponseTimeout))
    }

    private fun buildWebClient(httpClient: HttpClient, clientConfig: KvkHandelsregisterClientConfig) =
        WebClient.builder()
            .baseUrl(clientConfig.handelsregisterBaseUrl)
            .clientConnector(ReactorClientHttpConnector(httpClient))
            .defaultHeader("apikey", clientConfig.apikey)
            .build()

    companion object {
        val logger = KotlinLogging.logger {}
    }

}