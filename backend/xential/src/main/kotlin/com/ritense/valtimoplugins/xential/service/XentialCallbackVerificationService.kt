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

import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.xential.domain.CallbackVerificationResult
import com.ritense.valtimoplugins.xential.domain.DocumentCreatedMessage
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin
import io.github.oshai.kotlinlogging.KotlinLogging
import java.nio.charset.StandardCharsets
import java.security.MessageDigest
import java.util.UUID
import javax.crypto.Mac
import javax.crypto.spec.SecretKeySpec

/**
 * Verifies that an incoming Xential document callback was produced by a party holding the shared secret.
 *
 * The callback endpoint is necessarily unauthenticated at the HTTP level - it is called by the Xential ESB, not
 * by a logged-in user - so the signature is what distinguishes a genuine callback from a forged one.
 *
 * The expected signature is `HMAC-SHA256(callbackSecret, documentCreatieSessieId || data)`, hex encoded, sent in
 * the [SIGNATURE_HEADER] header.
 *
 * ### Which secret
 *
 * The secret is read from the plugin configuration recorded on the document creation session, never from a
 * configuration picked out of the set that happens to exist. A deployment may legitimately hold several Xential
 * plugin configurations - different ESB endpoints, different credentials - and each has its own
 * `callbackSecret`. Choosing among them arbitrarily would compare the signature against the wrong secret, so
 * verification would fail for genuine callbacks or, worse, succeed against a secret the sender never used.
 *
 * This service therefore only answers "does this signature match the secret of *that* configuration". What to do
 * with a failure is decided by the verification mode, in [DocumentGenerationService].
 */
class XentialCallbackVerificationService(
    private val pluginService: PluginService,
) {
    /**
     * Checks [signature] against [message], using the `callbackSecret` of the plugin configuration identified by
     * [pluginConfigurationId].
     *
     * @param pluginConfigurationId the configuration that created the document creation session, or `null` for a
     * session created before the plugin recorded it. A `null` value cannot be verified and yields
     * [CallbackVerificationResult.UNKNOWN_PLUGIN_CONFIGURATION].
     * @return why the callback did or did not verify. Never throws: this runs on an unauthenticated endpoint, so
     * an unresolvable configuration is a failure result rather than an exception.
     */
    fun verify(
        message: DocumentCreatedMessage,
        signature: String?,
        pluginConfigurationId: UUID?,
    ): CallbackVerificationResult {
        if (pluginConfigurationId == null) {
            return CallbackVerificationResult.UNKNOWN_PLUGIN_CONFIGURATION
        }
        val plugin =
            resolvePlugin(pluginConfigurationId)
                ?: return CallbackVerificationResult.PLUGIN_CONFIGURATION_UNRESOLVABLE
        val secret =
            plugin.callbackSecret?.takeIf { it.isNotBlank() }
                ?: return CallbackVerificationResult.NO_SECRET_CONFIGURED
        val providedSignature =
            signature
                ?.takeIf { it.isNotBlank() }
                ?.let { decodeHex(it) }
                ?: return CallbackVerificationResult.INVALID_SIGNATURE
        val expectedSignature = sign(secret, message.documentCreatieSessieId, message.data)

        // Constant-time comparison: a length- or content-dependent comparison would leak the expected
        // signature one byte at a time.
        return if (MessageDigest.isEqual(expectedSignature, providedSignature)) {
            CallbackVerificationResult.VERIFIED
        } else {
            CallbackVerificationResult.INVALID_SIGNATURE
        }
    }

    private fun resolvePlugin(pluginConfigurationId: UUID): XentialPlugin? =
        runCatching {
            pluginService.createInstance(PluginConfigurationId.existingId(pluginConfigurationId)) as? XentialPlugin
        }.getOrElse { exception ->
            logger.debug(exception) {
                "Could not resolve the Xential plugin configuration recorded on a document creation session."
            }
            null
        }

    companion object {
        const val SIGNATURE_HEADER = "X-Xential-Signature"
        private const val HMAC_ALGORITHM = "HmacSHA256"
        private const val HEX_RADIX = 16
        private val logger = KotlinLogging.logger {}

        /**
         * Computes the signature the sending side is expected to send.
         *
         * The session id is folded into the signed material alongside the payload so that a signature captured
         * for one document creation session cannot be replayed against another.
         */
        fun sign(
            secret: String,
            documentCreatieSessieId: String,
            data: String,
        ): ByteArray =
            Mac.getInstance(HMAC_ALGORITHM).let { mac ->
                mac.init(SecretKeySpec(secret.toByteArray(StandardCharsets.UTF_8), HMAC_ALGORITHM))
                mac.doFinal((documentCreatieSessieId + data).toByteArray(StandardCharsets.UTF_8))
            }

        /** Renders [signature] the way it is expected to appear in the [SIGNATURE_HEADER] header. */
        fun encodeHex(signature: ByteArray): String = signature.joinToString("") { "%02x".format(it) }

        /** Decodes a hex encoded signature, returning `null` when it is not valid hex. */
        private fun decodeHex(value: String): ByteArray? {
            val trimmed = value.trim()
            if (trimmed.length % 2 != 0 || trimmed.isEmpty()) {
                return null
            }
            return runCatching {
                ByteArray(trimmed.length / 2) { index ->
                    trimmed.substring(index * 2, index * 2 + 2).toInt(HEX_RADIX).toByte()
                }
            }.getOrNull()
        }
    }
}
