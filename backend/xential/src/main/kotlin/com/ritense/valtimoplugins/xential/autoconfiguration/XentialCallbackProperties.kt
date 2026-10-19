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

package com.ritense.valtimoplugins.xential.autoconfiguration

import com.ritense.valtimoplugins.xential.domain.CallbackVerificationMode
import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

/**
 * Deployment level settings for the Xential document callback endpoint.
 *
 * The shared secret itself is not configured here but on the Xential plugin configuration, so that it is
 * stored as a secret plugin property rather than in plain application configuration.
 */
@ConfigurationProperties(prefix = "valtimo.xential.callback")
data class XentialCallbackProperties(
    /**
     * Whether an unverifiable callback is rejected or merely logged. Defaults to
     * [CallbackVerificationMode.LOG_ONLY] so that upgrading this plugin never breaks a running integration.
     */
    val verificationMode: CallbackVerificationMode = CallbackVerificationMode.LOG_ONLY,
    /**
     * How long a document creation session stays valid. A session that Xential never calls back on should not
     * leave a permanent replay window open.
     */
    val tokenTimeToLive: Duration = Duration.ofDays(DEFAULT_TOKEN_TIME_TO_LIVE_DAYS),
    /**
     * The number of *unverifiable* callbacks absorbed per [rateLimitWindow]. `0` disables the limit.
     *
     * Correctly signed callbacks are never counted and never blocked, so a flood of forged callbacks cannot stop
     * a genuine one from being processed. See
     * [com.ritense.valtimoplugins.xential.service.XentialCallbackRateLimiter].
     */
    val rateLimit: Int = DEFAULT_RATE_LIMIT,
    /** The length of the window over which [rateLimit] is counted. */
    val rateLimitWindow: Duration = Duration.ofMinutes(1),
) {
    companion object {
        private const val DEFAULT_TOKEN_TIME_TO_LIVE_DAYS = 7L
        private const val DEFAULT_RATE_LIMIT = 60
    }
}
