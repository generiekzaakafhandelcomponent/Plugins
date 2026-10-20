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

package com.ritense.valtimoplugins.xential.web.rest

import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.xential.autoconfiguration.XentialCallbackProperties
import com.ritense.valtimoplugins.xential.domain.CallbackVerificationMode
import com.ritense.valtimoplugins.xential.domain.DocumentCreatedMessage
import com.ritense.valtimoplugins.xential.domain.FileFormat
import com.ritense.valtimoplugins.xential.domain.XentialToken
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin
import com.ritense.valtimoplugins.xential.repository.XentialTokenRepository
import com.ritense.valtimoplugins.xential.service.DocumentGenerationService
import com.ritense.valtimoplugins.xential.service.XentialCallbackRateLimiter
import com.ritense.valtimoplugins.xential.service.XentialCallbackVerificationService
import com.ritense.valtimoplugins.xential.service.XentialCallbackVerificationService.Companion.encodeHex
import com.ritense.valtimoplugins.xential.service.XentialCallbackVerificationService.Companion.sign
import com.ritense.valueresolver.ValueResolverService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.runtime.MessageCorrelationBuilder
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import java.time.Clock
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.Optional
import java.util.UUID

/**
 * Guards the single property that keeps the callback endpoint from revealing which document creation sessions
 * exist.
 *
 * The shared secret can only be resolved once the session is known, so the session is looked up before the
 * signature is checked. That ordering is safe only as long as "there is no such session" and "the signature for
 * this session is wrong" are answered identically. These tests assert that on the HTTP response rather than on an
 * internal enum, because the response is what an attacker sees.
 */
class DocumentResourceTest {
    private val xentialTokenRepository: XentialTokenRepository = mock()
    private val temporaryResourceStorageService: TemporaryResourceStorageService = mock()
    private val runtimeService: RuntimeService = mock()
    private val pluginService: PluginService = mock()

    private val now: Instant = Instant.parse("2026-01-01T12:00:00Z")
    private val clock: Clock = Clock.fixed(now, ZoneOffset.UTC)

    private val knownSessionId = UUID.randomUUID()
    private val unknownSessionId = UUID.randomUUID()
    private val expiredSessionId = UUID.randomUUID()
    private val pluginConfigurationId = UUID.randomUUID()

    @Test
    fun `should answer identically for an unknown session and a bad signature when enforcing`() {
        val resource = resource(CallbackVerificationMode.ENFORCE)
        givenKnownSession()

        val unknownSession =
            resource.handleSubmission(
                message(unknownSessionId),
                encodeHex(sign(SECRET, unknownSessionId.toString(), PAYLOAD)),
            )
        val badSignature = resource.handleSubmission(message(knownSessionId), FORGED_SIGNATURE)

        assertEquals(
            unknownSession.statusCode,
            badSignature.statusCode,
            "A different status code for an unknown session turns the endpoint into a session-existence oracle",
        )
        assertEquals(unknownSession.headers, badSignature.headers, "The headers must not differ either")
        assertNull(unknownSession.body)
        assertNull(badSignature.body)
        // ResponseEntity equality covers status, headers and body together: the responses are indistinguishable.
        assertEquals(unknownSession, badSignature)
    }

    @Test
    fun `should answer identically for every way of failing when enforcing`() {
        val resource = resource(CallbackVerificationMode.ENFORCE)
        givenKnownSession()
        givenExpiredSession()

        val responses =
            listOf(
                "unknown session id" to resource.handleSubmission(message(unknownSessionId), FORGED_SIGNATURE),
                "malformed session id" to resource.handleSubmission(message("not-a-uuid"), FORGED_SIGNATURE),
                "undecodable payload" to
                    resource.handleSubmission(message(knownSessionId, data = "not-base64!!"), FORGED_SIGNATURE),
                "expired session" to resource.handleSubmission(message(expiredSessionId), FORGED_SIGNATURE),
                "missing signature" to resource.handleSubmission(message(knownSessionId), null),
                "signature that is not hex" to resource.handleSubmission(message(knownSessionId), "not-hex"),
                "wrong signature" to resource.handleSubmission(message(knownSessionId), FORGED_SIGNATURE),
            )

        val expected: ResponseEntity<Unit> = ResponseEntity.status(HttpStatus.NOT_FOUND).build()
        responses.forEach { (cause, response) ->
            assertEquals(expected, response, "The response for '$cause' must be the shared rejection response")
        }
    }

    @Test
    fun `should accept a correctly signed callback for a known session`() {
        val resource = resource(CallbackVerificationMode.ENFORCE)
        givenKnownSession()
        givenCorrelationSucceeds()

        val response =
            resource.handleSubmission(
                message(knownSessionId),
                encodeHex(sign(SECRET, knownSessionId.toString(), PAYLOAD)),
            )

        assertEquals(HttpStatus.OK, response.statusCode)
    }

    private fun resource(verificationMode: CallbackVerificationMode): DocumentResource {
        val callbackProperties =
            XentialCallbackProperties(verificationMode = verificationMode, rateLimit = GENEROUS_BUDGET)
        givenPluginConfiguration()
        return DocumentResource(
            DocumentGenerationService(
                xentialTokenRepository,
                temporaryResourceStorageService,
                runtimeService,
                XentialCallbackVerificationService(pluginService),
                XentialCallbackRateLimiter(callbackProperties, clock),
                callbackProperties,
                clock,
            ),
        )
    }

    private fun givenPluginConfiguration() {
        val plugin =
            XentialPlugin(
                pluginConfigurationId = PluginConfigurationId.existingId(pluginConfigurationId),
                esbClient = mock(),
                documentGenerationService = mock(),
                valueResolverService = mock<ValueResolverService>(),
                xentialSjablonenService = mock(),
            ).apply { callbackSecret = SECRET }
        whenever(pluginService.createInstance(eq(PluginConfigurationId.existingId(pluginConfigurationId))))
            .thenReturn(plugin)
    }

    private fun givenKnownSession() {
        whenever(xentialTokenRepository.findById(knownSessionId))
            .thenReturn(Optional.of(token(knownSessionId, LocalDateTime.now(clock).plusDays(1))))
        whenever(xentialTokenRepository.findById(unknownSessionId)).thenReturn(Optional.empty())
    }

    private fun givenExpiredSession() {
        whenever(xentialTokenRepository.findById(expiredSessionId))
            .thenReturn(Optional.of(token(expiredSessionId, LocalDateTime.now(clock).minusDays(1))))
    }

    private fun givenCorrelationSucceeds() {
        val correlationBuilder: MessageCorrelationBuilder = mock()
        whenever(runtimeService.createMessageCorrelation(eq(MESSAGE_NAME))).thenReturn(correlationBuilder)
        whenever(correlationBuilder.processInstanceId(any())).thenReturn(correlationBuilder)
        whenever(correlationBuilder.setVariable(any(), any())).thenReturn(correlationBuilder)
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn("resource-id")
    }

    private fun token(
        sessionId: UUID,
        expiresOn: LocalDateTime,
    ) = XentialToken(
        token = sessionId,
        processId = UUID.randomUUID(),
        messageName = MESSAGE_NAME,
        resumeUrl = null,
        expiresOn = expiresOn,
        pluginConfigurationId = pluginConfigurationId,
    )

    private fun message(
        sessionId: UUID,
        data: String = PAYLOAD,
    ) = message(sessionId.toString(), data)

    private fun message(
        sessionId: String,
        data: String = PAYLOAD,
    ) = DocumentCreatedMessage(
        taakapplicatie = "valtimo",
        gebruiker = "gebruiker",
        documentCreatieSessieId = sessionId,
        formaat = FileFormat.PDF,
        documentkenmerk = "kenmerk",
        data = data,
    )

    private companion object {
        const val SECRET = "a-shared-secret"
        const val PAYLOAD = "cGF5bG9hZA=="
        const val MESSAGE_NAME = "messageName"
        const val FORGED_SIGNATURE = "deadbeef"
        const val GENEROUS_BUDGET = 1000
    }
}
