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

import com.ritense.valtimoplugins.xential.autoconfiguration.XentialCallbackProperties
import io.github.oshai.kotlinlogging.KotlinLogging
import java.time.Clock

/**
 * A fixed window budget for Xential document callbacks that **fail verification**.
 *
 * ### Why only failures
 *
 * A limiter that counted every callback would be a denial-of-service tool handed to the attacker it was meant to
 * stop: the endpoint is unauthenticated, so anyone can spend the whole budget in about a second with garbage
 * requests and lock out genuine, correctly signed callbacks for the rest of the window - which stalls the BPMN
 * processes waiting on those documents.
 *
 * Counting only callbacks that failed verification removes that. A verified callback never touches this limiter
 * and can therefore never be blocked by one, no matter how much noise arrives alongside it. What remains limited
 * is exactly the traffic an attacker controls, which is what the limiter was for.
 *
 * The cost is that a failure is only recognisable after the session lookup and the HMAC, so this caps how many
 * failures are *acted on and logged* rather than how much work reaches the handler. Bounding the work itself is
 * an ingress concern, not something a single application instance can do credibly.
 *
 * ### Interaction with the verification mode
 *
 * Unverifiable callbacks are counted in both verification modes, but only blocked when verification is enforced.
 * In log-only mode an unverifiable callback is still processed - that is the entire contract of the mode, and
 * blocking there would break the running integration the mode exists to protect. The counting still happens so
 * that the warnings show an operator how much unverifiable traffic there is before they switch to enforcing.
 *
 * The consequence, stated plainly: in log-only mode this limiter does not stop anyone from grinding through
 * session ids. Only enforcing verification does. Log-only is a migration step, not a security posture.
 *
 * ### Residual
 *
 * The budget is per application instance and held in memory. With *n* instances behind a load balancer the
 * effective ceiling is *n* times the configured one, and it resets on restart. This is not a cluster-wide
 * guarantee and is not a substitute for rate limiting at the ingress; it is a local backstop.
 */
class XentialCallbackRateLimiter(
    private val callbackProperties: XentialCallbackProperties,
    private val clock: Clock = Clock.systemUTC(),
) {
    private var windowStart: Long? = null
    private var failuresInWindow = 0

    /**
     * Records a callback that could not be verified, and reports whether the current window still had room for
     * it.
     *
     * Only ever called for callbacks that failed verification; a verified callback must not consume budget.
     *
     * @return `true` when the failure fits within the configured budget, `false` when the budget for the current
     * window is spent. The caller decides what that means - see the verification mode discussion above.
     */
    @Synchronized
    fun recordUnverifiedCallback(): Boolean {
        val windowLength = callbackProperties.rateLimitWindow.toMillis()
        if (windowLength <= 0 || callbackProperties.rateLimit <= 0) {
            return true
        }
        val now = clock.millis()
        val currentWindowStart = windowStart
        if (currentWindowStart == null || now - currentWindowStart >= windowLength) {
            windowStart = now
            failuresInWindow = 0
        }
        if (failuresInWindow >= callbackProperties.rateLimit) {
            logger.warn {
                "More than ${callbackProperties.rateLimit} unverifiable Xential callbacks within " +
                    "${callbackProperties.rateLimitWindow}. Correctly signed callbacks are unaffected."
            }
            return false
        }
        failuresInWindow++
        return true
    }

    companion object {
        private val logger = KotlinLogging.logger {}
    }
}
