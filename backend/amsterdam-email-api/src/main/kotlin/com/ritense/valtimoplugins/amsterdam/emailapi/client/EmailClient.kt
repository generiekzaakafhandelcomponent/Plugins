package com.ritense.valtimoplugins.amsterdam.emailapi.client

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.ApplicationEventPublisher
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.client.RestTemplate
import java.net.URI


private val logger = KotlinLogging.logger {}
private const val  headerKey = "X-MAIL-SUBSCRIPTIONKEY"

class EmailClient(
    private val restTemplate: RestTemplate,
    private val eventPublisher: ApplicationEventPublisher,
) {
    fun send(message: EmailMessage, baseUri: URI, subscriptionKey: String) {
        try {
            logger.debug { "sending email naar "  + message.to.toString() + " met onderwerp " + message.subject}

            val headers = HttpHeaders()
            headers.set(headerKey, subscriptionKey)
            headers.set("Content-Type", MediaType.APPLICATION_JSON.toString())
            val httpEntity: HttpEntity<EmailMessage> = HttpEntity(message, headers)

            var response: ResponseEntity<String> = restTemplate.postForEntity(baseUri, httpEntity, String::class.java)

            if(response.statusCode.is2xxSuccessful) {
                var event = EmailApiEvent("successfully send email")
                eventPublisher.publishEvent(event)
            }
            else if (response.statusCode.equals(HttpStatus.BAD_REQUEST)) {
                var event = EmailApiEvent("failed to send email")
                eventPublisher.publishEvent(event)
                logger.warn { "email invalide of incompleet \n" + message.toString()}
            }
            else if (response.statusCode.equals(HttpStatus.UNAUTHORIZED)) {
                logger.warn { "email request unauthorized" }
            }
        } catch (e: Exception) {
            logger.error { "error sending email \n" + e.message }
            throw e
        }
    }
}
