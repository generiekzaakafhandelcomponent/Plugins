/*
 * Copyright 2015-2025 Ritense BV, the Netherlands.
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

import com.ritense.valtimoplugins.notifynl.domain.email.EmailRequest
import com.ritense.valtimoplugins.notifynl.domain.email.SendEmailResponse
import com.ritense.valtimoplugins.notifynl.domain.letter.LetterRequest
import com.ritense.valtimoplugins.notifynl.domain.letter.LetterResponse
import com.ritense.valtimoplugins.notifynl.domain.notification.GetMessageResponse
import com.ritense.valtimoplugins.notifynl.domain.notification.NotificationRequest
import com.ritense.valtimoplugins.notifynl.domain.notification.SendSmsResponse
import com.ritense.valtimoplugins.notifynl.domain.notification.SmsRequest
import com.ritense.valtimoplugins.notifynl.domain.template.AllTemplatesRequest
import com.ritense.valtimoplugins.notifynl.domain.template.GetAllTemplatesResponse
import com.ritense.valtimoplugins.notifynl.domain.template.GetTemplateResponse
import com.ritense.valtimoplugins.notifynl.domain.template.TemplateRequest
import org.springframework.http.MediaType
import org.springframework.web.client.RestClient
import org.springframework.web.client.body
import java.net.URI

class NotifyNlClient(
    private val restClientBuilder: RestClient.Builder
) {
    fun sendSms(baseUri: URI, body: SmsRequest, token: String): SendSmsResponse {
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

    fun sendEmail(baseUri: URI, body: EmailRequest, token: String): SendEmailResponse {
        return restClientBuilder
            .clone()
            .build()
            .post()
            .uri {
                it.scheme(baseUri.scheme)
                    .host(baseUri.host)
                    .path(baseUri.path)
                    .path("/v2/notifications/email")
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
            .body<SendEmailResponse>()!!
    }

    fun sendLetter(baseUri: URI, body: LetterRequest, token: String): LetterResponse {
        return restClientBuilder
            .clone()
            .build()
            .post()
            .uri {
                it.scheme(baseUri.scheme)
                    .host(baseUri.host)
                    .path(baseUri.path)
                    .path("/v2/notifications/letter")
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
            .body<LetterResponse>()!!
    }

    fun getTemplate(baseUri: URI, body: TemplateRequest, token: String): GetTemplateResponse {
        return restClientBuilder
            .clone()
            .build()
            .get()
            .uri {
                it.scheme(baseUri.scheme)
                    .host(baseUri.host)
                    .path(baseUri.path)
                    .path("/v2/template/${body.templateId}")
                    .port(baseUri.port)
                    .build()
            }
            .headers {
                it.contentType = MediaType.APPLICATION_JSON
                it.setBearerAuth(token)
            }
            .accept(MediaType.APPLICATION_JSON)
            .retrieve()
            .body<GetTemplateResponse>()!!
    }

    fun getAllTemplates(baseUri: URI, token: String, templateType: String? = null): GetAllTemplatesResponse {
        return restClientBuilder
            .clone()
            .build()
            .get()
            .uri {
                it.scheme(baseUri.scheme)
                    .host(baseUri.host)
                    .path(baseUri.path)
                    .path("/v2/templates")
                    .port(baseUri.port)
                    .apply {
                        if (!templateType.isNullOrBlank()) {
                            queryParam("type", templateType)
                        }
                    }
                    .build()
            }
            .headers {
                it.accept = listOf(MediaType.APPLICATION_JSON)
                it.setBearerAuth(token)
            }
            .retrieve()
            .body<GetAllTemplatesResponse>()!!
    }

    fun getMessage(baseUri: URI, body: NotificationRequest, token: String): GetMessageResponse {
        return restClientBuilder
            .clone()
            .build()
            .get()
            .uri {
                it.scheme(baseUri.scheme)
                    .host(baseUri.host)
                    .path(baseUri.path)
                    .path("/v2/notifications/${body.notificationId}")
                    .port(baseUri.port)
                    .build()
            }
            .headers {
                it.contentType = MediaType.APPLICATION_JSON
                it.setBearerAuth(token)
            }
            .accept(MediaType.APPLICATION_JSON)
            .retrieve()
            .body<GetMessageResponse>()!!
    }
}