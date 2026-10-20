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

package com.ritense.valtimoplugins.xential.service

import com.ritense.resource.domain.MetadataType
import com.ritense.resource.service.TemporaryResourceStorageService
import com.ritense.valtimoplugins.xential.autoconfiguration.XentialCallbackProperties
import com.ritense.valtimoplugins.xential.domain.CallbackVerificationMode
import com.ritense.valtimoplugins.xential.domain.CallbackVerificationResult
import com.ritense.valtimoplugins.xential.domain.DocumentCallbackOutcome
import com.ritense.valtimoplugins.xential.domain.DocumentCreatedMessage
import com.ritense.valtimoplugins.xential.domain.XentialDocumentProperties
import com.ritense.valtimoplugins.xential.domain.XentialToken
import com.ritense.valtimoplugins.xential.repository.XentialTokenRepository
import com.rotterdam.esb.xential.api.DefaultApi
import com.rotterdam.esb.xential.model.Sjabloondata
import io.github.oshai.kotlinlogging.KotlinLogging
import org.camunda.bpm.engine.RuntimeService
import org.camunda.bpm.engine.delegate.DelegateExecution
import java.io.ByteArrayInputStream
import java.time.Clock
import java.time.LocalDateTime
import java.util.Base64
import java.util.UUID

class DocumentGenerationService(
    private val xentialTokenRepository: XentialTokenRepository,
    private val temporaryResourceStorageService: TemporaryResourceStorageService,
    private val runtimeService: RuntimeService,
    private val callbackVerificationService: XentialCallbackVerificationService,
    private val callbackRateLimiter: XentialCallbackRateLimiter,
    private val callbackProperties: XentialCallbackProperties,
    private val clock: Clock = Clock.systemDefaultZone(),
) {
    /**
     * Asks Xential to generate a document and records the resulting document creation session.
     *
     * @param pluginConfigurationId the Xential plugin configuration this request was made with. It is stored on
     * the session so that the eventual callback is verified against that configuration's `callbackSecret` rather
     * than against whichever Xential configuration happens to be found first.
     */
    fun generateDocument(
        api: DefaultApi,
        processId: UUID,
        pluginConfigurationId: UUID,
        xentialGebruikersId: String,
        sjabloonId: String,
        xentialDocumentProperties: XentialDocumentProperties,
        execution: DelegateExecution,
    ) {
        logger.info { "generating xential document" }

        val result =
            api.creeerDocument(
                gebruikersId = xentialGebruikersId,
                accepteerOnbekend = false,
                sjabloondata =
                    Sjabloondata(
                        sjabloonId = sjabloonId,
                        bestandsFormaat = Sjabloondata.BestandsFormaat.valueOf(xentialDocumentProperties.fileFormat.name),
                        documentkenmerk = xentialDocumentProperties.documentId,
                        sjabloonVulData = xentialDocumentProperties.content.toString(),
                    ),
            )
        logger.debug { "xential creeer document response status: ${result.status}" }

        val now = LocalDateTime.now(clock)
        val xentialToken =
            XentialToken(
                token = UUID.fromString(result.documentCreatieSessieId),
                processId = processId,
                messageName = xentialDocumentProperties.messageName,
                resumeUrl = result.resumeUrl?.toString(),
                expiresOn = now.plus(callbackProperties.tokenTimeToLive),
                pluginConfigurationId = pluginConfigurationId,
            )
        xentialTokenRepository.save(xentialToken)
        logger.debug { "persisted document creation session for process ${xentialToken.processId}" }

        execution.setVariable("xentialStatus", result.status)

        result.resumeUrl?.let {
            execution.setVariable("resumeUrl", it)
        }
        logger.info { "ready" }
    }

    /**
     * Handles a callback from Xential carrying the content of a generated document.
     *
     * This endpoint cannot be authenticated at the HTTP level, so the checks below are what stand between a
     * genuine callback and a forged one.
     *
     * ### Why the session is looked up before the signature is checked
     *
     * The `callbackSecret` to check the signature against is the one belonging to the plugin configuration that
     * created this document creation session, so the session has to be loaded first. That ordering would be a
     * gift to an attacker if the two failures were reported differently: probing random session ids would return
     * "unknown" for ones that do not exist and "bad signature" for ones that do, turning the endpoint into a
     * session-existence oracle. Every failure here therefore returns the same
     * [DocumentCallbackOutcome.REJECTED], with the real cause logged at DEBUG and never returned.
     *
     * ### Pre-upgrade sessions
     *
     * A session created before the plugin recorded its originating configuration has no secret to check against
     * and can never be verified. In [CallbackVerificationMode.LOG_ONLY] it is processed with a warning that names
     * this specific cause; in [CallbackVerificationMode.ENFORCE] it is rejected. Either drain those sessions
     * before enforcing, or restart the affected processes.
     */
    fun onDocumentGenerated(
        message: DocumentCreatedMessage,
        signature: String? = null,
    ): DocumentCallbackOutcome {
        val sessionId =
            parseSessionId(message.documentCreatieSessieId)
                ?: return reject("the document creation session id is not a valid UUID")
        val bytes =
            decodePayload(message.data)
                ?: return reject("the payload is not valid base64")
        val xentialToken =
            xentialTokenRepository
                .findById(sessionId)
                .orElse(null)
                ?: return reject("no document creation session exists for the supplied id")

        if (xentialToken.isExpired(LocalDateTime.now(clock))) {
            // Terminal outcome: consume the session so that an expired id cannot be retried.
            xentialTokenRepository.delete(xentialToken)
            return reject("the document creation session has expired")
        }

        val verification =
            callbackVerificationService.verify(message, signature, xentialToken.pluginConfigurationId)
        if (!verification.isVerified) {
            // Counted in both modes - so that a flood is visible and the log can be capped - but only acted on
            // when verification is enforced, because log-only mode promises not to change any outcome.
            val withinBudget = callbackRateLimiter.recordUnverifiedCallback()
            if (withinBudget) {
                // Suppressed past the budget: the limiter logs that it has been reached, and a flood must not
                // bury everything else in the log.
                logger.warn { unverifiedCallbackWarning(verification) }
            }
            if (callbackProperties.verificationMode == CallbackVerificationMode.ENFORCE) {
                return if (withinBudget) DocumentCallbackOutcome.REJECTED else DocumentCallbackOutcome.RATE_LIMITED
            }
        }

        logger.info { "Retrieved content from Xential callback for process ${xentialToken.processId}" }

        ByteArrayInputStream(bytes).use { inputStream ->
            val metadata =
                mapOf(MetadataType.FILE_NAME.key to "${xentialToken.processId}-${xentialToken.messageName}.tmp")
            val resourceId = temporaryResourceStorageService.store(inputStream, metadata)
            runtimeService.createMessageCorrelation(xentialToken.messageName)
                .processInstanceId(xentialToken.processId.toString())
                .setVariable("xentialResourceId", resourceId)
                .correlate()
        }

        // The callback for this session has now been handled, so the session is spent. If the correlation above
        // fails it throws and the session is kept, so that a retry can still succeed until the session expires.
        xentialTokenRepository.delete(xentialToken)
        logger.debug { "Deleted document creation session for process ${xentialToken.processId}" }

        return DocumentCallbackOutcome.PROCESSED
    }

    /** Names the actual cause, and says whether it was acted on, without ever putting either on the wire. */
    private fun unverifiedCallbackWarning(verification: CallbackVerificationResult): String =
        when (callbackProperties.verificationMode) {
            CallbackVerificationMode.ENFORCE -> {
                "Rejected Xential callback: ${verification.explanation}."
            }

            CallbackVerificationMode.LOG_ONLY -> {
                "Xential callback could not be verified: ${verification.explanation}. It is still being " +
                    "processed because valtimo.xential.callback.verification-mode is LOG_ONLY. Configure the " +
                    "sending side to sign its callbacks and then switch to ENFORCE."
            }
        }

    /**
     * Logs the real reason at DEBUG and returns the single outcome shared by every rejected callback, so that the
     * caller cannot tell a malformed id from an unknown one, an expired one or a bad signature.
     *
     * A callback that never reached verification is counted against the same budget as one that failed it - both
     * are callbacks this endpoint could not accept - because reporting rate limiting on only some of the failure
     * causes would put the distinction between them back on the wire.
     */
    private fun reject(reason: String): DocumentCallbackOutcome {
        logger.debug { "Rejected Xential callback: $reason" }
        return if (callbackRateLimiter.recordUnverifiedCallback()) {
            DocumentCallbackOutcome.REJECTED
        } else {
            DocumentCallbackOutcome.RATE_LIMITED
        }
    }

    private fun parseSessionId(documentCreatieSessieId: String?): UUID? =
        documentCreatieSessieId?.let { runCatching { UUID.fromString(it) }.getOrNull() }

    private fun decodePayload(data: String?): ByteArray? =
        data?.let { runCatching { Base64.getDecoder().decode(it) }.getOrNull() }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
