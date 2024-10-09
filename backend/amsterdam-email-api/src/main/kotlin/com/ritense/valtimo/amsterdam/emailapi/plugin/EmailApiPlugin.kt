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


package com.ritense.valtimo.amsterdam.emailapi.plugin

import com.ritense.plugin.annotation.Plugin
import com.ritense.plugin.annotation.PluginAction
import com.ritense.plugin.annotation.PluginActionProperty
import com.ritense.plugin.annotation.PluginProperty
import com.ritense.processlink.domain.ActivityTypeWithEventName.SERVICE_TASK_START
import com.ritense.valtimo.amsterdam.emailapi.client.BodyPart
import com.ritense.valtimo.amsterdam.emailapi.client.EmailClient
import com.ritense.valtimo.amsterdam.emailapi.client.EmailMessage
import com.ritense.valtimo.amsterdam.emailapi.client.Recipient
import com.ritense.valueresolver.ValueResolverService
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.springframework.http.*
import org.springframework.util.MimeTypeUtils
import org.springframework.util.StringUtils
import org.springframework.web.client.RestTemplate
import java.net.URI
import java.util.*


private const val UTF8 = "utf-8"

@Plugin(
    key = "amsterdamemailapi",
    title = "Email API Amsterdam",
    description = "Zend emails via Email API"
)
class EmailApiPlugin(
    private val emailClient: EmailClient,
    private val restTemplate: RestTemplate,
    private val valueResolverService: ValueResolverService
) {

    @PluginProperty(key = "emailApiBaseUrl", secret = false, required = true)
    lateinit var emailApiBaseUrl: String

    @PluginProperty(key = "clientId", secret = true, required = true)
    lateinit var clientId: String

    @PluginProperty(key = "clientSecret", secret = true, required = true)
    lateinit var clientSecret: String

    @PluginProperty(key = "tokenEndpoint", secret = false, required = true)
    lateinit var tokenEndpoint: String

    @PluginAction(
        key = "zend-email",
        title = "Zend email via API",
        description = "Zend een email via de Email API",
        activityTypes = [SERVICE_TASK_START]
    )
    fun sendEmail(
        execution: DelegateExecution,
        @PluginActionProperty toEmail: String,
        @PluginActionProperty toName: String?,
        @PluginActionProperty fromAddress: String,
        @PluginActionProperty emailSubject: String,
        @PluginActionProperty contentHtml: String,
        @PluginActionProperty ccEmail: String?,
        @PluginActionProperty ccName: String?,
        @PluginActionProperty bccEmail: String?,
        @PluginActionProperty bccName: String?,
    ) {
        var token: String = getToken();
        val message = EmailMessage(
            to = setOf(
                Recipient(
                    address = resolveValue(execution, toEmail) as String,
                    name = resolveValue(execution, toName) as String
                )
            ),
            from = Recipient(address = resolveValue(execution, fromAddress) as String),
            content = setOf(
                BodyPart(
                    content = resolveValue(execution, contentHtml) as String,
                    mimeType = MimeTypeUtils.TEXT_HTML.toString(),
                    encoding = UTF8
                )
            ),
            subject = (resolveValue(execution, emailSubject) as String),
        )


        // set optional values
        resolveValue(execution, ccEmail)?.let {
            message.cc = setOf(
                Recipient(
                    address = it as String,
                    name = resolveValue(execution, ccName) as String?
                )
            )
        }
        resolveValue(execution, bccEmail)?.let {
            message.bcc = setOf(
                Recipient(
                    address = it as String,
                    name = resolveValue(execution, bccName) as String?
                )
            )
        }

        // send
        emailClient.send(message, URI.create(emailApiBaseUrl), token)
    }

    private fun getToken(): String {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_FORM_URLENCODED

        val body = "grant_type=client_credentials"

        val auth = "$clientId:$clientSecret"
        val base64Auth = Base64.getEncoder().encodeToString(auth.toByteArray())
        headers.set(HttpHeaders.AUTHORIZATION, "Basic $base64Auth")

        val requestEntity = HttpEntity(body, headers)

        val responseEntity: ResponseEntity<Map<*, *>> =
            restTemplate.exchange(tokenEndpoint, HttpMethod.POST, requestEntity, Map::class.java)

        val accessToken = responseEntity.body?.get("access_token")?.toString()

        if (accessToken == null || !StringUtils.hasText(accessToken)) {
            throw RuntimeException("Token retrieval failed.")
        }

        return accessToken
    }


    private fun resolveValue(execution: DelegateExecution, value: String?): Any? {
        return if (value == null) {
            null
        } else {
            val resolvedValues = valueResolverService.resolveValues(
                execution.processInstanceId,
                execution,
                listOf(value)
            )
            resolvedValues[value]
        }
    }
}
