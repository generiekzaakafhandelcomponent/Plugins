package com.ritense.valtimoplugins.haalcentraalauth.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.valtimoplugins.haalcentraalauth.HaalCentraalAuthentication
import mu.KotlinLogging
import org.springframework.web.client.RestClient
import org.springframework.web.reactive.function.client.ClientRequest
import org.springframework.web.reactive.function.client.ClientResponse
import org.springframework.web.reactive.function.client.ExchangeFunction
import reactor.core.publisher.Mono
import reactor.netty.http.client.HttpClient
import java.time.Duration


@Plugin(
    key = "haal-centraal-auth",
    title = "Haal Centraal Auth",
    description = "Dummy plugin for haal centraal authentication"
)
@Suppress("UNUSED")
class HaalCentraalAuthPlugin : HaalCentraalAuthentication {

    @PluginProperty(key = "authenticationSecret", secret = true, required = false)
    lateinit var authenticationSecret: String

    override fun applyAuth(builder: RestClient.Builder): RestClient.Builder {
        return builder.defaultHeaders { headers ->
            headers.setBearerAuth(authenticationSecret)
        }
    }

    override fun getAuthenticatedHttpClient(): HttpClient {
        return HttpClient.create().responseTimeout(Duration.ofSeconds(10))
    }

    override fun filter(request: ClientRequest, next: ExchangeFunction): Mono<ClientResponse> {
        val filteredRequest = ClientRequest.from(request).headers { headers ->
            headers.set("X-Api-Key", authenticationSecret)
        }.build()

        logger.info("Making API call to: ${request.url()}")
        return next.exchange(filteredRequest)
    }

    companion object {
        val logger = KotlinLogging.logger {}
    }
}
