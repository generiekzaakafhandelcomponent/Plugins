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

import com.fasterxml.jackson.databind.JsonNode
import com.ritense.plugin.domain.PluginConfigurationId
import com.ritense.plugin.service.PluginService
import com.ritense.valtimoplugins.xential.domain.CallbackVerificationResult
import com.ritense.valtimoplugins.xential.domain.DocumentCreatedMessage
import com.ritense.valtimoplugins.xential.domain.FileFormat
import com.ritense.valtimoplugins.xential.plugin.XentialPlugin
import com.ritense.valtimoplugins.xential.service.XentialCallbackVerificationService.Companion.encodeHex
import com.ritense.valtimoplugins.xential.service.XentialCallbackVerificationService.Companion.sign
import com.ritense.valueresolver.ValueResolverService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.atLeastOnce
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import java.security.MessageDigest
import java.util.UUID

class XentialCallbackVerificationServiceTest {
    private val pluginService: PluginService = mock()
    private val service = XentialCallbackVerificationService(pluginService)

    private val sessionId = UUID.randomUUID().toString()
    private val payload = "cGF5bG9hZA=="

    /** The configuration that started the document creation session under test. */
    private val ownConfigurationId = UUID.randomUUID()

    /** A second, unrelated Xential configuration with a different secret. */
    private val otherConfigurationId = UUID.randomUUID()

    @BeforeEach
    fun setUp() {
        givenConfiguration(ownConfigurationId, OWN_SECRET)
        givenConfiguration(otherConfigurationId, OTHER_SECRET)
    }

    @Test
    fun `should accept a correctly signed callback`() {
        assertEquals(CallbackVerificationResult.VERIFIED, verifyWith(signatureUsing(OWN_SECRET)))
    }

    /**
     * The regression this whole change exists for.
     *
     * The previous implementation resolved the secret with a `{ true }` filter, which returns whichever Xential
     * configuration the repository happens to hand back first. With two configurations that is a coin flip: a
     * genuine callback gets checked against a secret its sender never held.
     */
    @Test
    fun `should verify against the configuration that created the session and not another one`() {
        assertEquals(
            CallbackVerificationResult.VERIFIED,
            verifyWith(signatureUsing(OWN_SECRET)),
            "A callback signed with the secret of the configuration that started the session must verify",
        )
        assertEquals(
            CallbackVerificationResult.INVALID_SIGNATURE,
            verifyWith(signatureUsing(OTHER_SECRET)),
            "A callback signed with another configuration's secret must not verify",
        )

        verify(pluginService, atLeastOnce())
            .createInstance(eq(PluginConfigurationId.existingId(ownConfigurationId)))
        verify(pluginService, never()).createInstance(eq(PluginConfigurationId.existingId(otherConfigurationId)))
    }

    /** The arbitrary-first-configuration lookup must be gone, not merely unused on the happy path. */
    @Test
    fun `should never resolve the plugin configuration by filtering over all configurations`() {
        verifyWith(signatureUsing(OWN_SECRET))

        verify(pluginService, never()).createInstance(eq(XentialPlugin::class.java), any<(JsonNode) -> Boolean>())
    }

    @Test
    fun `should not verify a session that does not record its plugin configuration`() {
        assertEquals(
            CallbackVerificationResult.UNKNOWN_PLUGIN_CONFIGURATION,
            service.verify(message(), signatureUsing(OWN_SECRET), null),
        )
        verify(pluginService, never()).createInstance(any<PluginConfigurationId>())
    }

    @Test
    fun `should not verify when the recorded plugin configuration cannot be resolved`() {
        val removedConfigurationId = UUID.randomUUID()
        whenever(pluginService.createInstance(eq(PluginConfigurationId.existingId(removedConfigurationId))))
            .thenThrow(IllegalStateException("no such configuration"))

        assertEquals(
            CallbackVerificationResult.PLUGIN_CONFIGURATION_UNRESOLVABLE,
            service.verify(message(), signatureUsing(OWN_SECRET), removedConfigurationId),
        )
    }

    @Test
    fun `should not verify when the recorded configuration is not a Xential configuration`() {
        val foreignConfigurationId = UUID.randomUUID()
        whenever(pluginService.createInstance(eq(PluginConfigurationId.existingId(foreignConfigurationId))))
            .thenReturn("not a Xential plugin")

        assertEquals(
            CallbackVerificationResult.PLUGIN_CONFIGURATION_UNRESOLVABLE,
            service.verify(message(), signatureUsing(OWN_SECRET), foreignConfigurationId),
        )
    }

    @Test
    fun `should not verify without a configured secret`() {
        val secretlessConfigurationId = UUID.randomUUID()
        givenConfiguration(secretlessConfigurationId, null)

        assertEquals(
            CallbackVerificationResult.NO_SECRET_CONFIGURED,
            service.verify(message(), signatureUsing(OWN_SECRET), secretlessConfigurationId),
        )
    }

    @Test
    fun `should not verify with a blank configured secret`() {
        val blankSecretConfigurationId = UUID.randomUUID()
        givenConfiguration(blankSecretConfigurationId, "  ")

        assertEquals(
            CallbackVerificationResult.NO_SECRET_CONFIGURED,
            service.verify(message(), signatureUsing(OWN_SECRET), blankSecretConfigurationId),
        )
    }

    @Test
    fun `should not verify a callback without a signature`() {
        assertEquals(CallbackVerificationResult.INVALID_SIGNATURE, verifyWith(null))
        assertEquals(CallbackVerificationResult.INVALID_SIGNATURE, verifyWith(""))
    }

    @Test
    fun `should not verify a signature that is not valid hex`() {
        assertEquals(CallbackVerificationResult.INVALID_SIGNATURE, verifyWith("not-hex"))
        assertEquals(CallbackVerificationResult.INVALID_SIGNATURE, verifyWith("abc"))
    }

    @Test
    fun `should accept a signature regardless of hex casing`() {
        assertEquals(CallbackVerificationResult.VERIFIED, verifyWith(signatureUsing(OWN_SECRET).uppercase()))
    }

    @Test
    fun `should not verify a signature captured for a different session`() {
        val signatureForOtherSession = encodeHex(sign(OWN_SECRET, UUID.randomUUID().toString(), payload))

        assertEquals(CallbackVerificationResult.INVALID_SIGNATURE, verifyWith(signatureForOtherSession))
    }

    @Test
    fun `should not verify a signature captured for a different payload`() {
        val signatureForOtherPayload = encodeHex(sign(OWN_SECRET, sessionId, "b3RoZXI="))

        assertEquals(CallbackVerificationResult.INVALID_SIGNATURE, verifyWith(signatureForOtherPayload))
    }

    /**
     * Asserts on the implementation rather than on timing, which would be inherently flaky.
     *
     * A content-dependent comparison would leak the expected signature one byte at a time, so the check that
     * matters is that [MessageDigest.isEqual] is genuinely the comparison being used. This is asserted against
     * the compiled class, because no black-box behaviour can distinguish a constant-time comparison from a
     * short-circuiting one that happens to return the same answers.
     */
    @Test
    fun `should compare signatures in constant time`() {
        val compiledClass =
            checkNotNull(
                XentialCallbackVerificationService::class.java
                    .getResourceAsStream("/${SERVICE_CLASS_RESOURCE}"),
            ) { "Could not read the compiled class to verify the comparison used" }
        val bytecode = compiledClass.use { it.readBytes() }.toString(Charsets.ISO_8859_1)

        assertTrue(
            bytecode.contains("java/security/MessageDigest") && bytecode.contains("isEqual"),
            "Signature comparison must use MessageDigest.isEqual; a naive equality check would reintroduce a " +
                "timing oracle on the signature.",
        )
    }

    private fun verifyWith(signature: String?) = service.verify(message(), signature, ownConfigurationId)

    private fun signatureUsing(secret: String) = encodeHex(sign(secret, sessionId, payload))

    private fun givenConfiguration(
        pluginConfigurationId: UUID,
        secret: String?,
    ) {
        val plugin =
            XentialPlugin(
                pluginConfigurationId = PluginConfigurationId.existingId(pluginConfigurationId),
                esbClient = mock(),
                documentGenerationService = mock(),
                valueResolverService = mock<ValueResolverService>(),
                xentialSjablonenService = mock(),
            ).apply { callbackSecret = secret }
        whenever(pluginService.createInstance(eq(PluginConfigurationId.existingId(pluginConfigurationId))))
            .thenReturn(plugin)
    }

    private fun message() =
        DocumentCreatedMessage(
            taakapplicatie = "valtimo",
            gebruiker = "gebruiker",
            documentCreatieSessieId = sessionId,
            formaat = FileFormat.PDF,
            documentkenmerk = "kenmerk",
            data = payload,
        )

    private companion object {
        const val OWN_SECRET = "the-secret-of-the-configuration-that-started-the-session"
        const val OTHER_SECRET = "the-secret-of-an-unrelated-configuration"
        const val SERVICE_CLASS_RESOURCE =
            "com/ritense/valtimoplugins/xential/service/XentialCallbackVerificationService.class"
    }
}
