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

package com.ritense.valtimoplugins.xential.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime
import java.util.UUID

@Entity
@Table(name = "xential_tokens")
class XentialToken(
    @Id
    @Column(name = "token", nullable = false, updatable = false)
    val token: UUID,
    @Column(name = "process_id", nullable = false, updatable = false)
    val processId: UUID,
    @Column(name = "message_name", nullable = false, updatable = false)
    val messageName: String,
    @Column(name = "resume_url", nullable = true, updatable = false)
    val resumeUrl: String?,
    /**
     * The moment after which this document creation session is no longer accepted on the callback endpoint.
     *
     * Nullable because sessions created before expiry was introduced have no value; those are treated as
     * non-expiring so that an upgrade does not invalidate documents that are still being generated.
     */
    @Column(name = "expires_on", nullable = true, updatable = false)
    val expiresOn: LocalDateTime? = null,
    /**
     * The Xential plugin configuration that started this document creation session.
     *
     * The callback for this session is verified against the `callbackSecret` of *this* configuration. Binding the
     * session to its originating configuration is what makes verification deterministic when more than one
     * Xential plugin configuration exists; picking an arbitrary configuration would check the signature against
     * the wrong secret.
     *
     * Nullable because sessions created before this column was introduced have no value. Those cannot be
     * verified at all - see [CallbackVerificationResult.UNKNOWN_PLUGIN_CONFIGURATION].
     */
    @Column(name = "plugin_configuration_id", nullable = true, updatable = false)
    val pluginConfigurationId: UUID? = null,
) {
    fun isExpired(now: LocalDateTime): Boolean = expiresOn?.isBefore(now) ?: false
}
