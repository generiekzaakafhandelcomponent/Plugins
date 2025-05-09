/*
 * Copyright 2015-2024 Ritense BV, the Netherlands.
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

package com.ritense.valtimoplugins.spotler.service

import com.fasterxml.jackson.databind.ObjectMapper
import com.ritense.mail.MailDispatcher
import com.ritense.valtimoplugins.spotler.domain.SpotlerProperties
import com.ritense.valtimoplugins.spotler.domain.SubmitMessage
import com.ritense.valtimo.contract.basictype.EmailAddress
import com.ritense.valtimo.contract.mail.model.MailMessageStatus
import com.ritense.valtimo.contract.mail.model.RawMailMessage
import com.ritense.valtimo.contract.mail.model.TemplatedMailMessage
import org.apache.commons.lang3.NotImplementedException
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.MediaType
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.client.HttpServerErrorException
import org.springframework.web.client.HttpStatusCodeException
import org.springframework.web.client.RestTemplate

class SpotlerMailDispatcher(
    private val spotlerProperties: SpotlerProperties,
    private val spotlerTokenService: SpotlerTokenService,
    private val restTemplate: RestTemplate,
    private val objectMapper: ObjectMapper
) : MailDispatcher {

    override fun send(rawMailMessage: RawMailMessage): MutableList<MailMessageStatus> {
        throw NotImplementedException("Send has not been implemented with RawMailMessage")
    }

    override fun send(templatedMailMessage: TemplatedMailMessage): MutableList<MailMessageStatus> {
        val mailMessageStatusList = mutableListOf<MailMessageStatus>()
        val messages = SubmitMessage.from(templatedMailMessage)
        val submitMessageURI = "/${spotlerProperties.accountId}/messages/submit"
        messages.forEach { message ->
            val mailMessageStatus = submitMessage(BASE_URL + submitMessageURI, message)
            mailMessageStatusList.add(mailMessageStatus)
        }
        return mailMessageStatusList
    }

    override fun getMaximumSizeAttachments(): Int {
        return MAX_SIZE_EMAIL_BODY_IN_BYTES // Spotler checks the entire body size
    }

    private fun submitMessage(url: String, submitMessage: SubmitMessage): MailMessageStatus {
        try {
            val token = spotlerTokenService.getToken()
            val httpEntity = HttpEntity(objectMapper.writeValueAsString(submitMessage), getHttpHeaders(token))
            val response = restTemplate.exchange(url, HttpMethod.POST, httpEntity, String::class.java)

            if (httpEntity.body.encodeToByteArray().size > MAX_SIZE_EMAIL_BODY_IN_BYTES) {
                throw IllegalStateException("Email exceeds max size of 25 mb")
            }
            return MailMessageStatus.with(
                EmailAddress.from(submitMessage.recipientAddress),
                "SENT",
                // Get id from header "location":
                // "https://api.flowmailer.net/520/messages/202106110944460bfd0ca81fd281ef9e"
                response.headers.location.path.split("/").last()
            ).build()
        } catch (e: HttpStatusCodeException) {
            if (e.statusCode.is4xxClientError) {
                throw HttpClientErrorException(
                    e.statusCode,
                    "Message has not been sent due to client side error: ${e.message}"
                )
            } else {
                throw HttpServerErrorException(
                    e.statusCode,
                    "Message has not been sent due to server side error: ${e.message}"
                )
            }
        }
    }

    private fun getHttpHeaders(bearerToken: String): HttpHeaders {
        val httpHeaders = HttpHeaders()
        httpHeaders.setBearerAuth(bearerToken)
        httpHeaders.contentType = MediaType.valueOf("application/vnd.flowmailer.v1.12+json;charset=UTF-8")
        httpHeaders.accept = listOf(MediaType.valueOf("application/vnd.flowmailer.v1.12+json;charset=UTF-8"))
        return httpHeaders
    }

    companion object {
        private const val BASE_URL = "https://api.flowmailer.net"
        const val MAX_SIZE_EMAIL_BODY_IN_BYTES: Int = 25000000  // 25mb

    }

}
