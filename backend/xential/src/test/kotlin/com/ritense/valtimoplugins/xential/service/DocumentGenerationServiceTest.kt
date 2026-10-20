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

import ch.qos.logback.classic.Level
import ch.qos.logback.classic.Logger
import ch.qos.logback.classic.spi.ILoggingEvent
import ch.qos.logback.core.read.ListAppender
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.xential.autoconfiguration.XentialCallbackProperties
import com.ritense.valtimoplugins.xential.domain.CallbackVerificationMode
import com.ritense.valtimoplugins.xential.domain.CallbackVerificationResult
import com.ritense.valtimoplugins.xential.domain.DocumentCallbackOutcome
import com.ritense.valtimoplugins.xential.domain.DocumentCreatedMessage
import com.ritense.valtimoplugins.xential.domain.FileFormat
import com.ritense.valtimoplugins.xential.domain.XentialDocumentProperties
import com.ritense.valtimoplugins.xential.domain.XentialToken
import com.ritense.valtimoplugins.xential.repository.XentialTokenRepository
import com.rotterdam.esb.xential.api.DefaultApi
import com.rotterdam.esb.xential.model.DocumentCreatieResultaat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.doThrow
import org.mockito.kotlin.eq
import org.mockito.kotlin.isNull
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.camunda.bpm.engine.MismatchingMessageCorrelationException
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.delegate.DelegateExecution
import org.camunda.bpm.engine.runtime.MessageCorrelationBuilder
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.Optional
import java.util.UUID

class DocumentGenerationServiceTest {
    private val xentialTokenRepository: XentialTokenRepository = mock()
    private val temporaryResourceStorageService: TemporaryResourceStorageService = mock()
    private val runtimeService: RuntimeService = mock()
    private val callbackVerificationService: XentialCallbackVerificationService = mock()
    private val callbackRateLimiter: XentialCallbackRateLimiter = mock()

    private val now: Instant = Instant.parse("2026-01-01T12:00:00Z")
    private val clock: Clock = Clock.fixed(now, ZoneOffset.UTC)
    private val localNow: LocalDateTime = LocalDateTime.ofInstant(now, ZoneOffset.UTC)

    private val sessionId = UUID.randomUUID()
    private val processId = UUID.randomUUID()
    private val pluginConfigurationId = UUID.randomUUID()

    @Test
    fun shouldGenerateDocument() {
        val defaultApi: DefaultApi = mock()
        val creatieResultaat =
            DocumentCreatieResultaat(
                documentCreatieSessieId = sessionId.toString(),
                status = DocumentCreatieResultaat.Status.VOLTOOID,
                resumeUrl = null,
            )
        whenever(defaultApi.creeerDocument(any(), any(), any())).thenReturn(creatieResultaat)

        service().generateDocument(
            api = defaultApi,
            processId = processId,
            pluginConfigurationId = pluginConfigurationId,
            xentialGebruikersId = "xentialGebruikersId",
            sjabloonId = UUID.randomUUID().toString(),
            xentialDocumentProperties =
                XentialDocumentProperties(
                    xentialGroupId = UUID.randomUUID(),
                    fileFormat = FileFormat.PDF,
                    documentFilename = "documentNaam",
                    informationObjectType = "object-type",
                    documentId = "mijn-kenmerk",
                    messageName = MESSAGE_NAME,
                    content = "voorbeeld data",
                ),
            execution = mock<DelegateExecution>(),
        )

        argumentCaptor<XentialToken>().apply {
            verify(xentialTokenRepository).save(capture())
            assertEquals(sessionId, firstValue.token)
            assertNotNull(firstValue.expiresOn)
            assertEquals(localNow.plusDays(TOKEN_TTL_DAYS), firstValue.expiresOn)
            // Without this the callback cannot know which callbackSecret to verify against.
            assertEquals(pluginConfigurationId, firstValue.pluginConfigurationId)
        }
    }

    @Test
    fun `should process a verified callback`() {
        givenLiveToken()
        givenVerification(CallbackVerificationResult.VERIFIED)
        givenCorrelationSucceeds()

        val outcome = service().onDocumentGenerated(message(), SIGNATURE)

        assertEquals(DocumentCallbackOutcome.PROCESSED, outcome)
        verify(temporaryResourceStorageService).store(any(), any())
    }

    @Test
    fun `should verify a callback against the configuration recorded on its session`() {
        givenLiveToken()
        givenVerification(CallbackVerificationResult.VERIFIED)
        givenCorrelationSucceeds()

        service().onDocumentGenerated(message(), SIGNATURE)

        verify(callbackVerificationService).verify(any(), eq(SIGNATURE), eq(pluginConfigurationId))
    }

    @Test
    fun `should reject an unverified callback when enforcing`() {
        givenLiveToken()
        givenVerification(CallbackVerificationResult.INVALID_SIGNATURE)
        givenBudgetAvailable()

        val outcome = service(CallbackVerificationMode.ENFORCE).onDocumentGenerated(message(), "wrong")

        assertEquals(DocumentCallbackOutcome.REJECTED, outcome)
        verify(temporaryResourceStorageService, never()).store(any(), any())
    }

    /**
     * The property that keeps the endpoint from becoming a session-existence oracle.
     *
     * Since the secret is resolved from the session, the session must be looked up before the signature can be
     * checked. The two failures therefore have to be reported identically, or probing random session ids would
     * reveal which ones exist.
     */
    @Test
    fun `should not distinguish an unknown session from a bad signature when enforcing`() {
        givenBudgetAvailable()

        whenever(xentialTokenRepository.findById(sessionId)).thenReturn(Optional.empty())
        givenVerification(CallbackVerificationResult.INVALID_SIGNATURE)
        val unknownSession = service(CallbackVerificationMode.ENFORCE).onDocumentGenerated(message(), SIGNATURE)

        givenLiveToken()
        val badSignature = service(CallbackVerificationMode.ENFORCE).onDocumentGenerated(message(), "wrong")

        assertEquals(unknownSession, badSignature)
        assertEquals(DocumentCallbackOutcome.REJECTED, unknownSession)
    }

    @Test
    fun `should return the same outcome for malformed unknown and expired session ids`() {
        givenBudgetAvailable()
        givenVerification(CallbackVerificationResult.VERIFIED)

        val malformed = service().onDocumentGenerated(message(documentCreatieSessieId = "not-a-uuid"), SIGNATURE)

        whenever(xentialTokenRepository.findById(sessionId)).thenReturn(Optional.empty())
        val unknown = service().onDocumentGenerated(message(), SIGNATURE)

        whenever(xentialTokenRepository.findById(sessionId))
            .thenReturn(Optional.of(token(expiresOn = localNow.minusDays(1))))
        val expired = service().onDocumentGenerated(message(), SIGNATURE)

        // An unauthenticated caller must not be able to tell these three apart - that is what would turn the
        // endpoint into a session-id validity oracle.
        assertEquals(DocumentCallbackOutcome.REJECTED, malformed)
        assertEquals(DocumentCallbackOutcome.REJECTED, unknown)
        assertEquals(DocumentCallbackOutcome.REJECTED, expired)
    }

    @Test
    fun `should reject an undecodable payload with the same outcome`() {
        givenBudgetAvailable()

        val outcome = service().onDocumentGenerated(message(data = "not-base64!!"), SIGNATURE)

        assertEquals(DocumentCallbackOutcome.REJECTED, outcome)
        verify(temporaryResourceStorageService, never()).store(any(), any())
        // The session is never looked up for a payload that cannot be decoded, so nothing is revealed about it.
        verify(xentialTokenRepository, never()).findById(any())
    }

    @Test
    fun `should not parse a malformed session id by throwing out of the handler`() {
        givenBudgetAvailable()

        // Previously UUID.fromString threw straight out of the handler, surfacing as a server error.
        val outcome = service().onDocumentGenerated(message(documentCreatieSessieId = "not-a-uuid"), SIGNATURE)

        assertEquals(DocumentCallbackOutcome.REJECTED, outcome)
    }

    @Test
    fun `should delete an expired token`() {
        givenBudgetAvailable()
        val expiredToken = token(expiresOn = localNow.minusSeconds(1))
        whenever(xentialTokenRepository.findById(sessionId)).thenReturn(Optional.of(expiredToken))

        service().onDocumentGenerated(message(), SIGNATURE)

        verify(xentialTokenRepository).delete(expiredToken)
        verify(temporaryResourceStorageService, never()).store(any(), any())
        // An expired session is terminal, so it is never verified either.
        verify(callbackVerificationService, never()).verify(any(), any(), any())
    }

    @Test
    fun `should treat a token without an expiry as still valid`() {
        whenever(xentialTokenRepository.findById(sessionId)).thenReturn(Optional.of(token(expiresOn = null)))
        givenVerification(CallbackVerificationResult.VERIFIED)
        givenCorrelationSucceeds()

        assertEquals(DocumentCallbackOutcome.PROCESSED, service().onDocumentGenerated(message(), SIGNATURE))
    }

    @Test
    fun `should delete the token after a successful correlation`() {
        val liveToken = givenLiveToken()
        givenVerification(CallbackVerificationResult.VERIFIED)
        givenCorrelationSucceeds()

        service().onDocumentGenerated(message(), SIGNATURE)

        verify(xentialTokenRepository).delete(liveToken)
    }

    @Test
    fun `should keep the token when the correlation fails so that a retry can still succeed`() {
        val liveToken = givenLiveToken()
        givenVerification(CallbackVerificationResult.VERIFIED)
        givenCorrelationFails()

        assertThrows<MismatchingMessageCorrelationException> {
            service().onDocumentGenerated(message(), SIGNATURE)
        }

        // The session is still bounded by its expiry, so keeping it does not leave a permanent replay window.
        verify(xentialTokenRepository, never()).delete(liveToken)
    }

    @Test
    fun `should not log the session token at info level or above`() {
        givenLiveToken()
        givenVerification(CallbackVerificationResult.VERIFIED)
        givenCorrelationSucceeds()

        val logged = captureLogging { service().onDocumentGenerated(message(), SIGNATURE) }
        val loggedAtInfoOrAbove =
            logged
                .filter { it.level.isGreaterOrEqual(Level.INFO) }
                .joinToString("\n") { it.formattedMessage }

        assertFalse(
            loggedAtInfoOrAbove.contains(sessionId.toString()),
            "The document creation session token is bearer-equivalent and must not be logged. Found in:\n" +
                loggedAtInfoOrAbove,
        )
    }

    // ---------------------------------------------------------------------------------------------------------
    // Sessions created before the plugin recorded which configuration started them - the one upgrade edge case.
    // ---------------------------------------------------------------------------------------------------------

    @Test
    fun `should process a pre-upgrade session in log only mode with a warning naming that cause`() {
        whenever(xentialTokenRepository.findById(sessionId))
            .thenReturn(Optional.of(token(expiresOn = localNow.plusDays(1), pluginConfigurationId = null)))
        givenVerification(CallbackVerificationResult.UNKNOWN_PLUGIN_CONFIGURATION)
        givenBudgetAvailable()
        givenCorrelationSucceeds()

        val logged =
            captureLogging {
                assertEquals(
                    DocumentCallbackOutcome.PROCESSED,
                    service(CallbackVerificationMode.LOG_ONLY).onDocumentGenerated(message(), SIGNATURE),
                )
            }

        val warnings = logged.filter { it.level == Level.WARN }.joinToString("\n") { it.formattedMessage }
        assertTrue(
            warnings.contains("predates this version"),
            "A pre-upgrade session must be reported with a warning naming that specific cause, not the generic " +
                "'signature missing or invalid'. Warnings were:\n" + warnings,
        )
        // The session records no configuration, so that is what verification is asked about.
        verify(callbackVerificationService).verify(any(), eq(SIGNATURE), isNull())
    }

    @Test
    fun `should reject a pre-upgrade session when enforcing`() {
        whenever(xentialTokenRepository.findById(sessionId))
            .thenReturn(Optional.of(token(expiresOn = localNow.plusDays(1), pluginConfigurationId = null)))
        givenVerification(CallbackVerificationResult.UNKNOWN_PLUGIN_CONFIGURATION)
        givenBudgetAvailable()

        val outcome = service(CallbackVerificationMode.ENFORCE).onDocumentGenerated(message(), SIGNATURE)

        assertEquals(DocumentCallbackOutcome.REJECTED, outcome)
        verify(temporaryResourceStorageService, never()).store(any(), any())
    }

    // ---------------------------------------------------------------------------------------------------------
    // Rate limiting: only unverified callbacks are counted, so a flood cannot starve a genuine callback.
    // ---------------------------------------------------------------------------------------------------------

    @Test
    fun `should not spend rate limit budget on a verified callback`() {
        givenLiveToken()
        givenVerification(CallbackVerificationResult.VERIFIED)
        givenCorrelationSucceeds()

        service().onDocumentGenerated(message(), SIGNATURE)

        verify(callbackRateLimiter, never()).recordUnverifiedCallback()
    }

    @Test
    fun `should still process a verified callback after a flood of unverified ones`() {
        val realRateLimiter =
            XentialCallbackRateLimiter(
                XentialCallbackProperties(rateLimit = SMALL_BUDGET, rateLimitWindow = Duration.ofMinutes(1)),
                clock,
            )
        val service = service(CallbackVerificationMode.ENFORCE, realRateLimiter)
        givenLiveToken()
        givenCorrelationSucceeds()

        givenVerification(CallbackVerificationResult.INVALID_SIGNATURE)
        repeat(FLOOD_SIZE) { service.onDocumentGenerated(message(), "forged") }

        givenVerification(CallbackVerificationResult.VERIFIED)
        val genuine = service.onDocumentGenerated(message(), SIGNATURE)

        // The whole point: an unauthenticated flood used to exhaust a global limiter within a second and stall
        // the BPMN processes waiting on genuine documents.
        assertEquals(DocumentCallbackOutcome.PROCESSED, genuine)
    }

    @Test
    fun `should report a flood of unverified callbacks as rate limited once the budget is spent`() {
        val realRateLimiter =
            XentialCallbackRateLimiter(
                XentialCallbackProperties(rateLimit = SMALL_BUDGET, rateLimitWindow = Duration.ofMinutes(1)),
                clock,
            )
        val service = service(CallbackVerificationMode.ENFORCE, realRateLimiter)
        givenLiveToken()
        givenVerification(CallbackVerificationResult.INVALID_SIGNATURE)

        val outcomes = List(SMALL_BUDGET + 1) { service.onDocumentGenerated(message(), "forged") }

        assertTrue(outcomes.take(SMALL_BUDGET).all { it == DocumentCallbackOutcome.REJECTED })
        assertEquals(DocumentCallbackOutcome.RATE_LIMITED, outcomes.last())
    }

    @Test
    fun `should count but not block an unverifiable callback in log only mode`() {
        val realRateLimiter =
            XentialCallbackRateLimiter(
                XentialCallbackProperties(rateLimit = SMALL_BUDGET, rateLimitWindow = Duration.ofMinutes(1)),
                clock,
            )
        val service = service(CallbackVerificationMode.LOG_ONLY, realRateLimiter)
        givenLiveToken()
        givenVerification(CallbackVerificationResult.INVALID_SIGNATURE)
        givenCorrelationSucceeds()

        val outcomes = List(SMALL_BUDGET + 2) { service.onDocumentGenerated(message(), "unsigned") }

        // Log-only mode promises not to change any outcome, so an exhausted budget must not start rejecting.
        assertTrue(
            outcomes.all { it == DocumentCallbackOutcome.PROCESSED },
            "Log-only mode must keep processing unverifiable callbacks. Outcomes were: $outcomes",
        )
        // Counted anyway, so the warnings show an operator the volume before they switch to enforcing.
        assertFalse(realRateLimiter.recordUnverifiedCallback(), "The failures should still have been counted")
    }

    private fun service(
        verificationMode: CallbackVerificationMode = CallbackVerificationMode.LOG_ONLY,
        rateLimiter: XentialCallbackRateLimiter = callbackRateLimiter,
    ) = DocumentGenerationService(
        xentialTokenRepository,
        temporaryResourceStorageService,
        runtimeService,
        callbackVerificationService,
        rateLimiter,
        XentialCallbackProperties(
            verificationMode = verificationMode,
            tokenTimeToLive = Duration.ofDays(TOKEN_TTL_DAYS),
        ),
        clock,
    )

    private fun givenBudgetAvailable() {
        whenever(callbackRateLimiter.recordUnverifiedCallback()).thenReturn(true)
    }

    private fun givenVerification(result: CallbackVerificationResult) {
        whenever(callbackVerificationService.verify(any(), any(), any())).thenReturn(result)
        whenever(callbackVerificationService.verify(any(), any(), isNull())).thenReturn(result)
    }

    private fun givenLiveToken(): XentialToken =
        token(expiresOn = localNow.plusDays(1)).also {
            whenever(xentialTokenRepository.findById(sessionId)).thenReturn(Optional.of(it))
        }

    private fun givenCorrelationSucceeds(): MessageCorrelationBuilder {
        val correlationBuilder: MessageCorrelationBuilder = mock()
        whenever(runtimeService.createMessageCorrelation(eq(MESSAGE_NAME))).thenReturn(correlationBuilder)
        whenever(correlationBuilder.processInstanceId(any())).thenReturn(correlationBuilder)
        whenever(correlationBuilder.setVariable(any(), any())).thenReturn(correlationBuilder)
        whenever(temporaryResourceStorageService.store(any(), any())).thenReturn("resource-id")
        return correlationBuilder
    }

    private fun givenCorrelationFails() {
        val correlationBuilder = givenCorrelationSucceeds()
        doThrow(MismatchingMessageCorrelationException(MESSAGE_NAME, "no matching execution"))
            .whenever(correlationBuilder)
            .correlate()
    }

    private fun token(
        expiresOn: LocalDateTime?,
        pluginConfigurationId: UUID? = this.pluginConfigurationId,
    ) = XentialToken(
        token = sessionId,
        processId = processId,
        messageName = MESSAGE_NAME,
        resumeUrl = null,
        expiresOn = expiresOn,
        pluginConfigurationId = pluginConfigurationId,
    )

    private fun message(
        documentCreatieSessieId: String = sessionId.toString(),
        data: String = "cGF5bG9hZA==",
    ) = DocumentCreatedMessage(
        taakapplicatie = "valtimo",
        gebruiker = "gebruiker",
        documentCreatieSessieId = documentCreatieSessieId,
        formaat = FileFormat.PDF,
        documentkenmerk = "kenmerk",
        data = data,
    )

    private fun captureLogging(block: () -> Unit): List<ILoggingEvent> {
        val appender = ListAppender<ILoggingEvent>().apply { start() }
        val rootLogger = LoggerFactory.getLogger(org.slf4j.Logger.ROOT_LOGGER_NAME) as Logger
        rootLogger.addAppender(appender)
        return try {
            block()
            appender.list.toList()
        } finally {
            rootLogger.detachAppender(appender)
            appender.stop()
        }
    }

    private companion object {
        const val MESSAGE_NAME = "messageName"
        const val SIGNATURE = "a-signature"
        const val TOKEN_TTL_DAYS = 7L
        const val SMALL_BUDGET = 3
        const val FLOOD_SIZE = 50
    }
}
