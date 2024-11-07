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